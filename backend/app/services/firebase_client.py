from __future__ import annotations

import os
from typing import Any

from app.config import get_settings

_db: Any | None = None
_initialized = False


def get_storage_mode() -> str:
    return "memory" if get_firestore() is None else "firestore"


def get_firestore() -> Any | None:
    global _db, _initialized

    if _db is not None:
        return _db

    if _initialized:
        return None

    _initialized = True
    settings = get_settings()

    if settings.use_mock_db:
        return None

    try:
        import firebase_admin
        from firebase_admin import credentials, firestore

        if not firebase_admin._apps:
            cred_path = settings.google_application_credentials
            if cred_path and os.path.isfile(cred_path):
                cred = credentials.Certificate(cred_path)
                firebase_admin.initialize_app(
                    cred,
                    {"projectId": settings.firebase_project_id} if settings.firebase_project_id else None,
                )
            elif settings.firebase_project_id:
                firebase_admin.initialize_app(options={"projectId": settings.firebase_project_id})
            else:
                return None

        _db = firestore.client()
        return _db
    except Exception:
        return None
