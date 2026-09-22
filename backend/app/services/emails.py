"""
RENOVA / ECOVAL Backend — Email Service (Disabled)

Email confirmation features have been removed to eliminate SMTP server dependencies.
Registration data is preserved directly in the database and CSV files.
"""

def send_bilingual_confirmation_email(to_email: str, recipient_name: str, form_type: str, form_data: dict):
    """No-op stub for email notifications."""
    pass
