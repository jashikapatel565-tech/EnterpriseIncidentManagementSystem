"""
Report Generator
----------------
Queries all resolved incidents and exports them to a CSV file called
``resolved_incidents_report.csv``.

Can be invoked:
  • Programmatically via ``generate_resolved_report()``
  • Through the ``GET /generate-report`` API endpoint (see main.py)
"""

import csv
import os
import logging
from datetime import timezone

from ..database import SessionLocal
from .. import models

logger = logging.getLogger("report_generator")

# Output CSV will be written to the backend/ directory.
REPORT_FILENAME = "resolved_incidents_report.csv"


def generate_resolved_report(output_path: str | None = None) -> str:
    """
    Query all incidents with status = 'Resolved', then write them to a CSV
    file.

    Parameters
    ----------
    output_path : str, optional
        Full path for the CSV file.  Defaults to ``resolved_incidents_report.csv``
        in the current working directory.

    Returns
    -------
    str
        The absolute path of the generated CSV file.
    """
    output_path = output_path or REPORT_FILENAME
    db = SessionLocal()

    try:
        # Fetch all resolved incidents and eagerly load their creator.
        resolved = (
            db.query(models.Incident)
            .filter(models.Incident.status == "Resolved")
            .all()
        )

        with open(output_path, mode="w", newline="", encoding="utf-8") as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow([
                "Ticket ID",
                "Title",
                "Priority",
                "Resolution Time",
                "User Email",
            ])

            for inc in resolved:
                # Resolution time = time between creation and last update.
                created = inc.created_at.replace(tzinfo=timezone.utc)
                updated = inc.updated_at.replace(tzinfo=timezone.utc)
                resolution_delta = updated - created
                resolution_time = str(resolution_delta)

                user_email = ""
                if inc.creator:
                    user_email = inc.creator.email

                writer.writerow([
                    inc.id,
                    inc.title,
                    inc.priority,
                    resolution_time,
                    user_email,
                ])

        abs_path = os.path.abspath(output_path)
        logger.info("📄  Report generated: %s  (%d resolved incidents)", abs_path, len(resolved))
        return abs_path

    finally:
        db.close()
