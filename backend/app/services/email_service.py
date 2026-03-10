"""
Email Service (Mock)
--------------------
Simulates sending email notifications by logging them to the terminal.
Designed to be called via FastAPI BackgroundTasks.
"""

import logging

# Configure basic logging for the mock email service
logger = logging.getLogger("email_service")
logger.setLevel(logging.INFO)
ch = logging.StreamHandler()
formatter = logging.Formatter('\n[EMAIL NOTIFICATION] %(asctime)s - %(message)s\n', datefmt='%Y-%m-%d %H:%M:%S')
ch.setFormatter(formatter)
logger.addHandler(ch)


def send_email_notification(to_email: str, subject: str, body: str):
    """
    Mock sending an email. In a real production app, this would use
    smtplib, SendGrid, AWS SES, etc.
    """
    if not to_email:
        return
        
    log_msg = f"""
    To: {to_email}
    Subject: {subject}
    ------------------------------------------------------------
    {body}
    ------------------------------------------------------------
    """
    logger.info(log_msg)
