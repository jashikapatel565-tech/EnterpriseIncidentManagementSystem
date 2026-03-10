"""
Admin API Routes
----------------
All endpoints require admin role.

GET    /admin/incidents          → List ALL incidents
PUT    /admin/incidents/{id}     → Update any incident
DELETE /admin/incidents/{id}     → Delete any incident
GET    /admin/generate-report    → Export resolved incidents CSV
"""

from typing import List
from sqlalchemy import func

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import require_admin
from .. import crud, schemas, models
from ..services.report_generator import generate_resolved_report
from ..services.email_service import send_email_notification

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/incidents", response_model=List[schemas.IncidentResponse])
async def admin_list_incidents(
    _admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Return all incidents (admin only), newest first."""
    return await crud.get_incidents(db)


@router.put("/incidents/{incident_id}", response_model=schemas.IncidentResponse)
async def admin_update_incident(
    incident_id: int,
    updates: schemas.IncidentUpdate,
    background_tasks: BackgroundTasks,
    _admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Update any incident (admin only). Triggers emails for assignment or resolution."""
    # Fetch old incident to detect specific changes
    old_incident = await crud.get_incident(db, incident_id)
    if not old_incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    old_status = old_incident.status
    old_assignee = old_incident.assigned_to

    updated = await crud.update_incident(db, incident_id, updates)

    # Check for resolution
    if updates.status and updates.status.value == "Resolved" and old_status != "Resolved":
        if updated.creator:
            background_tasks.add_task(
                send_email_notification,
                to_email=updated.creator.email,
                subject=f"Incident #{updated.id} Resolved",
                body=f"Your incident '{updated.title}' has been marked as Resolved.",
            )

    # Check for assignment
    if updates.assigned_to and updates.assigned_to != old_assignee:
        assignee = await crud.get_user_by_id(db, updates.assigned_to)
        if assignee:
            background_tasks.add_task(
                send_email_notification,
                to_email=assignee.email,
                subject=f"Incident #{updated.id} Assigned to You",
                body=f"You have been assigned to incident '{updated.title}'.",
            )

    return schemas.IncidentResponse.from_incident(updated)


@router.delete("/incidents/{incident_id}", status_code=204)
async def admin_delete_incident(
    incident_id: int,
    _admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Delete any incident (admin only)."""
    deleted = await crud.delete_incident(db, incident_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Incident not found")
    return None


@router.get("/generate-report")
async def admin_generate_report(
    _admin: models.User = Depends(require_admin),
):
    """Generate resolved incidents CSV report (admin only)."""
    path = generate_resolved_report()
    return {"message": "Report generated successfully.", "file": path}


@router.get("/analytics")
async def get_analytics(
    _admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Return aggregated data for the Analytics Dashboard."""
    
    # Priority distribution
    priority_counts = db.query(models.Incident.priority, func.count(models.Incident.id)).group_by(models.Incident.priority).all()
    priority_data = {p.value: count for p, count in priority_counts}

    # Status breakdown
    status_counts = db.query(models.Incident.status, func.count(models.Incident.id)).group_by(models.Incident.status).all()
    status_data = {s.value: count for s, count in status_counts}

    # Tickets per day (SQLite string manipulation for YYYY-MM-DD grouping)
    # Note: SQLite `date()` function truncates the datetime
    days_counts = db.query(
        func.date(models.Incident.created_at).label("day"),
        func.count(models.Incident.id)
    ).group_by("day").order_by("day").limit(30).all()
    
    days_data = {day: count for day, count in days_counts}

    return {
        "priority_distribution": priority_data,
        "status_breakdown": status_data,
        "tickets_per_day": days_data
    }
