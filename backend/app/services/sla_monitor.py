"""
SLA Monitoring Background Task
------------------------------
Checks whether a **High** priority incident has been moved to "In Progress"
within the configured SLA window (default: 10 minutes).

This function is designed to be run via FastAPI's BackgroundTasks mechanism.
"""

import asyncio
import logging
from datetime import datetime, timezone

# SLA window in seconds (10 minutes).
SLA_WINDOW_SECONDS: int = 10 * 60

logger = logging.getLogger("sla_monitor")
logging.basicConfig(level=logging.INFO)


async def check_sla(incident_id: int) -> None:
    """
    Wait for the SLA window to elapse, then re-query the incident.
    If it is still not "In Progress" (or "Resolved"), print an SLA ALERT.
    """
    logger.info(
        "⏱  SLA monitor started for incident #%s  —  will check in %s seconds.",
        incident_id,
        SLA_WINDOW_SECONDS,
    )

    # Sleep for the duration of the SLA window.
    await asyncio.sleep(SLA_WINDOW_SECONDS)

    # Import here to avoid circular dependency at module level.
    from ..database import SessionLocal
    from .. import models

    db = SessionLocal()
    try:
        incident = (
            db.query(models.Incident)
            .filter(models.Incident.id == incident_id)
            .first()
        )

        if incident is None:
            logger.info("Incident #%s was deleted before SLA check.", incident_id)
            return

        if incident.status == "Open":
            # Calculate how long the ticket has been open.
            age_seconds = (
                datetime.now(timezone.utc) - incident.created_at.replace(tzinfo=timezone.utc)
            ).total_seconds()
            age_minutes = round(age_seconds / 60, 1)

            alert_msg = (
                f"🚨  SLA ALERT  |  Incident #{incident.id} \"{incident.title}\" "
                f"(priority=High) has been OPEN for {age_minutes} min without "
                f"being moved to 'In Progress'.  Please investigate immediately!"
            )
            logger.warning(alert_msg)
            print(alert_msg)  # Also print to stdout for visibility.
        else:
            logger.info(
                "✅  Incident #%s is now '%s' — SLA satisfied.",
                incident.id,
                incident.status,
            )
    finally:
        db.close()
