from fastapi import APIRouter, Depends, HTTPException

from app.dependencies import get_current_user
from app.models import ApiResponse
from app.services.grievances import GrievancePayload, GrievanceRecord, create_grievance, get_grievance

router = APIRouter()


@router.post("", status_code=201)
async def submit_grievance(payload: GrievancePayload, current_user: dict = Depends(get_current_user)) -> ApiResponse[GrievanceRecord]:
    if len(payload.description.strip()) < 20:
        raise HTTPException(status_code=400, detail="Description must be at least 20 characters.")
    authenticated_payload = payload.model_copy(update={
        "name": current_user.get("name") or current_user.get("email") or "Citizen",
        "email": current_user.get("email") or "",
        "phone": current_user.get("phone_number") or "",
    })
    record = create_grievance(authenticated_payload, current_user["uid"])
    return ApiResponse(success=True, data=record)


@router.get("/track/{grievance_id}")
async def track_grievance(grievance_id: str, current_user: dict = Depends(get_current_user)) -> ApiResponse[GrievanceRecord]:
    record = get_grievance(grievance_id, current_user["uid"])
    if record is None:
        raise HTTPException(status_code=404, detail="Grievance not found. Check your reference ID.")
    return ApiResponse(success=True, data=record)
