"""
SQLAlchemy ORM Models
---------------------
User and Incident tables with one-to-many relationship.
"""

from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Text, DateTime, ForeignKey, Enum as SAEnum,
)
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    """Employee or admin who can create and manage incidents."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(
        SAEnum("user", "admin", name="user_role"),
        nullable=False,
        default="user",
    )
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    incidents = relationship(
        "Incident", 
        back_populates="creator",
        foreign_keys="[Incident.user_id]"
    )


class Incident(Base):
    """IT incident / support ticket submitted by a user."""

    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(
        SAEnum("Low", "Medium", "High", name="incident_priority"),
        nullable=False,
        default="Medium",
    )
    status = Column(
        SAEnum("Open", "In Progress", "Resolved", name="incident_status"),
        nullable=False,
        default="Open",
    )
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)

    creator = relationship("User", foreign_keys=[user_id], back_populates="incidents")
    assignee = relationship("User", foreign_keys=[assigned_to])
