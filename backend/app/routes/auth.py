"""
Auth API Routes
---------------
POST /auth/signup  → Register a new user
POST /auth/login   → Authenticate and receive JWT
GET  /auth/me      → Get current user profile (protected)
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..security import hash_password, verify_password, create_access_token
from ..dependencies import get_current_user
from .. import models, schemas, crud

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=schemas.TokenResponse, status_code=201)
async def signup(payload: schemas.SignupRequest, db: Session = Depends(get_db)):
    """
    Register a new user.  Hashes the password with bcrypt, stores the user,
    and returns a JWT access token.
    """
    # Check for duplicate email.
    existing = await crud.get_user_by_email(db, payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(payload.password)
    user = await crud.create_user(
        db,
        name=payload.name,
        email=payload.email,
        password_hash=hashed,
        role=payload.role,
    )

    token = create_access_token({"user_id": user.id, "role": user.role})
    return schemas.TokenResponse(
        access_token=token,
        user=schemas.UserResponse.model_validate(user),
    )


@router.post("/login", response_model=schemas.TokenResponse)
async def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    """
    Verify email + password and return a JWT access token.
    """
    user = await crud.get_user_by_email(db, payload.email)
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token({"user_id": user.id, "role": user.role})
    return schemas.TokenResponse(
        access_token=token,
        user=schemas.UserResponse.model_validate(user),
    )


@router.get("/me", response_model=schemas.UserResponse)
async def me(current_user: models.User = Depends(get_current_user)):
    """Return the profile of the currently authenticated user."""
    return current_user
