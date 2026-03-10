"""
User API Routes
---------------
GET /users → List all users (admin only)
"""

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import require_admin
from .. import crud, schemas, models

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=List[schemas.UserResponse])
async def list_users(
    _admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Return all users (admin only)."""
    return await crud.get_users(db)
