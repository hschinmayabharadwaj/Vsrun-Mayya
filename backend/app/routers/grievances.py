from fastapi import APIRouter, HTTPException

from app.models import ApiResponse
from app.services.grievances import GrievancePayload, GrievanceRecord, create_grievance, get_grievance

router = APIRouter()


@router.post("", status_code=201)
async def submit_grievance(payload: GrievancePayload) -> ApiResponse[GrievanceRecord]:
    if len(payload.description.strip()) < 20:
        raise HTTPException(status_code=400, detail="Description must be at least 20 characters.")
    record = create_grievance(payload)
    return ApiResponse(success=True, data=record)


@router.get("/track/{grievance_id}")
async def track_grievance(grievance_id: str) -> ApiResponse[GrievanceRecord]:
    record = get_grievance(grievance_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Grievance not found. Check your reference ID.")
    return ApiResponse(success=True, data=record)
