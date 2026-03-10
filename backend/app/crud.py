"""
CRUD Operations
---------------
Database helper functions for User and Incident resources.
"""

from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from . import models, schemas


# ===========================  USER CRUD  ===================================

async def create_user(
    db: Session,
    *,
    name: str,
    email: str,
    password_hash: str,
    role: str = "user",
) -> models.User:
    """Insert a new user with a hashed password."""
    db_user = models.User(
        name=name,
        email=email,
        password_hash=password_hash,
        role=role,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


async def get_users(db: Session) -> List[models.User]:
    return db.query(models.User).all()


async def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()


async def get_user_by_id(db: Session, user_id: int) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()


# =========================  INCIDENT CRUD  =================================

async def create_incident(
    db: Session, incident: schemas.IncidentCreate, user_id: int
) -> models.Incident:
    """Insert a new incident linked to the authenticated user."""
    db_incident = models.Incident(
        title=incident.title,
        description=incident.description,
        priority=incident.priority.value,
        user_id=user_id,
    )
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)
    return db_incident


async def get_incidents(db: Session) -> List[models.Incident]:
    """All incidents, newest first."""
    return (
        db.query(models.Incident)
        .options(joinedload(models.Incident.creator), joinedload(models.Incident.assignee))
        .order_by(models.Incident.created_at.desc())
        .all()
    )


async def get_incidents_by_user(db: Session, user_id: int) -> List[models.Incident]:
    """Incidents for a specific user, newest first."""
    return (
        db.query(models.Incident)
        .options(joinedload(models.Incident.creator), joinedload(models.Incident.assignee))
        .filter(models.Incident.user_id == user_id)
        .order_by(models.Incident.created_at.desc())
        .all()
    )


async def get_incident(db: Session, incident_id: int) -> Optional[models.Incident]:
    return (
        db.query(models.Incident)
        .options(joinedload(models.Incident.creator), joinedload(models.Incident.assignee))
        .filter(models.Incident.id == incident_id)
        .first()
    )


async def update_incident(
    db: Session, incident_id: int, updates: schemas.IncidentUpdate,
) -> Optional[models.Incident]:
    db_incident = (
        db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    )
    if not db_incident:
        return None

    update_data = updates.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if hasattr(value, "value"):
            value = value.value
        setattr(db_incident, field, value)

    db_incident.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(db_incident)
    return db_incident


async def delete_incident(db: Session, incident_id: int) -> bool:
    db_incident = (
        db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    )
    if not db_incident:
        return False
    db.delete(db_incident)
    db.commit()
    return True
