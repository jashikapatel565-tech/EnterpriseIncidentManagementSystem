"""
Pydantic Schemas (v2)
---------------------
Request / response models with validation for auth and incident endpoints.
"""

from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict


# ---------------------------------------------------------------------------
# Enumerations
# ---------------------------------------------------------------------------
class PriorityEnum(str, Enum):
    low = "Low"
    medium = "Medium"
    high = "High"


class StatusEnum(str, Enum):
    open = "Open"
    in_progress = "In Progress"
    resolved = "Resolved"


# ---------------------------------------------------------------------------
# Auth Schemas
# ---------------------------------------------------------------------------
class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "user"  # "user" or "admin"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ---------------------------------------------------------------------------
# Incident Schemas
# ---------------------------------------------------------------------------
class IncidentCreate(BaseModel):
    """User submits a ticket — user_id is set from JWT, not the request body."""
    title: str
    description: Optional[str] = None
    priority: PriorityEnum = PriorityEnum.medium


class IncidentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[PriorityEnum] = None
    status: Optional[StatusEnum] = None
    assigned_to: Optional[int] = None


class IncidentResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    priority: PriorityEnum
    status: StatusEnum
    created_at: datetime
    updated_at: datetime
    user_id: int
    creator_name: Optional[str] = None
    creator_email: Optional[str] = None
    assigned_to: Optional[int] = None
    assignee_name: Optional[str] = None
    assignee_email: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

    @classmethod
    def from_incident(cls, inc):
        """Build response with creator and assignee details resolved."""
        data = {
            "id": inc.id,
            "title": inc.title,
            "description": inc.description,
            "priority": inc.priority,
            "status": inc.status,
            "created_at": inc.created_at,
            "updated_at": inc.updated_at,
            "user_id": inc.user_id,
            "creator_name": inc.creator.name if inc.creator else None,
            "creator_email": inc.creator.email if inc.creator else None,
            "assigned_to": inc.assigned_to,
            "assignee_name": inc.assignee.name if inc.assignee else None,
            "assignee_email": inc.assignee.email if inc.assignee else None,
        }
        return cls(**data)
