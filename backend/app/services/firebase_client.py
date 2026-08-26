from __future__ import annotations

import os
import json
from typing import Any

from app.config import get_settings

_app: Any | None = None
_db: Any | None = None
_initialized = False


def get_storage_mode() -> str:
    return "memory" if get_firestore() is None else "firestore"


def get_firestore() -> Any | None:
    global _db

    if _db is not None:
        return _db

    app = get_firebase_app()
    if app is None:
        return None

    try:
        from firebase_admin import firestore
        _db = firestore.client(app)
        return _db
    except Exception:
        return None


def get_firebase_app() -> Any | None:
    global _app, _initialized

    if _app is not None:
        return _app
    if _initialized:
        return None

    _initialized = True
    settings = get_settings()
    if settings.use_mock_db:
        return None

    try:
        import firebase_admin
        from firebase_admin import credentials

        if firebase_admin._apps:
            _app = firebase_admin.get_app()
        else:
            cred_path = settings.google_application_credentials
            if settings.firebase_service_account_json:
                cred = credentials.Certificate(json.loads(settings.firebase_service_account_json))
                _app = firebase_admin.initialize_app(
                    cred,
                    {"projectId": settings.firebase_project_id} if settings.firebase_project_id else None,
                )
            elif cred_path and os.path.isfile(cred_path):
                cred = credentials.Certificate(cred_path)
                _app = firebase_admin.initialize_app(
                    cred,
                    {"projectId": settings.firebase_project_id} if settings.firebase_project_id else None,
                )
            elif settings.firebase_project_id:
                _app = firebase_admin.initialize_app(options={"projectId": settings.firebase_project_id})
            else:
                return None
        return _app
    except Exception:
        return None


def verify_id_token(id_token: str) -> dict[str, Any]:
    app = get_firebase_app()
    if app is None:
        raise ValueError("Firebase Authentication is not configured")

    from firebase_admin import auth
    return auth.verify_id_token(id_token, app=app, check_revoked=True)
