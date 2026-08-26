import json
from typing import Any
from urllib.parse import unquote

from fastapi import Cookie, Header, HTTPException, status

from app.services.firebase_client import verify_id_token


def get_current_user(
    authorization: str | None = Header(default=None),
    citizen_session: str | None = Cookie(default=None, alias="citizen-services-auth"),
) -> dict[str, Any]:
    if not authorization and citizen_session:
        try:
            session = json.loads(unquote(citizen_session))
            id_token = session.get("idToken")
            if id_token:
                authorization = f"Bearer {id_token}"
        except (TypeError, ValueError, AttributeError):
            authorization = None

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sign in is required for this action.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = authorization.removeprefix("Bearer ").strip()
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication token.")

    try:
        return verify_id_token(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Your session has expired. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
