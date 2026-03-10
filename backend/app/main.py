"""
Enterprise Incident Management System — FastAPI Application
------------------------------------------------------------
Entry point: registers auth, incident, admin, and user routers.
Configures CORS and auto-creates database tables on startup.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routes import auth, users, incidents, admin

app = FastAPI(
    title="Enterprise Incident Management System",
    description="Production-grade IT ticketing platform with JWT auth and RBAC.",
    version="2.0.0",
)

# CORS — allow React dev server.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers.
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(incidents.router)
app.include_router(admin.router)


@app.on_event("startup")
async def on_startup():
    """Create all database tables on first run."""
    Base.metadata.create_all(bind=engine)


@app.get("/", tags=["Health"])
async def root():
    return {
        "message": "Enterprise Incident Management System API v2 is running.",
        "docs": "/docs",
    }
