from __future__ import annotations

import secrets
import string
from datetime import datetime, timezone

from pydantic import BaseModel, Field

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


def create_grievance(payload: GrievancePayload) -> GrievanceRecord:
    record = GrievanceRecord(
        id=_generate_grievance_id(),
        category=payload.category,
        subject=payload.subject,
        description=payload.description,
        name=payload.name or "Demo Citizen",
        email=payload.email or "demo.citizen@example.com",
        phone=payload.phone or "+91-DEMO-0000-0001",
        status="submitted",
        submittedAt=datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    )
    _grievances.insert(0, record.model_dump())
    return record


def get_grievance(grievance_id: str) -> GrievanceRecord | None:
    for item in _grievances:
        if item["id"] == grievance_id.upper():
            return GrievanceRecord(**item)
    return None
