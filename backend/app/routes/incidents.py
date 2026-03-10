"""
Incident API Routes (User-scoped, protected)
---------------------------------------------
POST /incidents       → Submit new incident (user_id from JWT)
GET  /incidents       → Fetch current user's incidents only
GET  /incidents/{id}  → Fetch specific ticket (own only)
"""

from typing import List
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import get_current_user
from .. import crud, schemas, models
from ..services.sla_monitor import check_sla
from ..services.email_service import send_email_notification

router = APIRouter(prefix="/incidents", tags=["Incidents"])


@router.post("/", response_model=schemas.IncidentResponse, status_code=201)
async def create_incident(
    incident: schemas.IncidentCreate,
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit a new incident. user_id is set from the JWT token."""
    created = await crud.create_incident(db, incident, user_id=current_user.id)

    # Schedule SLA monitoring for high-priority tickets.
    if incident.priority.value == "High":
        background_tasks.add_task(check_sla, created.id)

    # Trigger email notification
    background_tasks.add_task(
        send_email_notification,
        to_email="it-support@company.com",
        subject=f"New Incident #{created.id}: {created.title}",
        body=f"A new incident was submitted by {current_user.name} ({current_user.email}).\nPriority: {created.priority}",
    )

    # Reload to include creator relationship.
    db.refresh(created)
    return schemas.IncidentResponse.from_incident(created)


@router.get("/", response_model=List[schemas.IncidentResponse])
async def list_my_incidents(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return only the current user's incidents."""
    incidents = await crud.get_incidents_by_user(db, current_user.id)
    return [schemas.IncidentResponse.from_incident(i) for i in incidents]


@router.get("/{incident_id}", response_model=schemas.IncidentResponse)
async def get_incident(
    incident_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Fetch a single incident. Users can only view their own tickets."""
    incident = await crud.get_incident(db, incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    # Allow admin to view any ticket, user only own tickets.
    if current_user.role != "admin" and incident.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this incident")
    return schemas.IncidentResponse.from_incident(incident)
