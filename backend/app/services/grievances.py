from __future__ import annotations

import secrets
import string
from datetime import datetime, timezone

from pydantic import BaseModel, Field

from app.data.catalog import COLLECTIONS
from app.services.firebase_client import get_firestore

_grievances: list[dict] = []


class GrievancePayload(BaseModel):
    category: str
    subject: str
    description: str
    name: str = ""
    email: str = ""
    phone: str = ""


class GrievanceRecord(BaseModel):
    id: str
    citizenId: str
    category: str
    subject: str
    description: str
    name: str
    email: str
    phone: str
    status: str
    submittedAt: str


def _generate_grievance_id() -> str:
    suffix = "".join(secrets.choice(string.digits) for _ in range(4))
    year = datetime.now(timezone.utc).year
    return f"GRV-{year}-{suffix}"


def create_grievance(payload: GrievancePayload, citizen_id: str) -> GrievanceRecord:
    record = GrievanceRecord(
        id=_generate_grievance_id(),
        citizenId=citizen_id,
        category=payload.category,
        subject=payload.subject,
        description=payload.description,
        name=payload.name or "Demo Citizen",
        email=payload.email or "demo.citizen@example.com",
        phone=payload.phone or "+91-DEMO-0000-0001",
        status="submitted",
        submittedAt=datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    )
    db = get_firestore()
    if db is None:
        _grievances.insert(0, record.model_dump())
    else:
        db.collection(COLLECTIONS["grievances"]).document(record.id).set(record.model_dump())
    return record


def get_grievance(grievance_id: str, citizen_id: str) -> GrievanceRecord | None:
    db = get_firestore()
    if db is not None:
        doc = db.collection(COLLECTIONS["grievances"]).document(grievance_id.upper()).get()
        if not doc.exists:
            return None
        record = GrievanceRecord(**doc.to_dict())
        return record if record.citizenId == citizen_id else None

    for item in _grievances:
        if item["id"] == grievance_id.upper() and item["citizenId"] == citizen_id:
            return GrievanceRecord(**item)
    return None
