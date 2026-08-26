from fastapi import APIRouter, Depends

from app.dependencies import get_current_user
from app.models import ApiResponse, DashboardData
from app.services.data_store import data_store

router = APIRouter()


@router.get("")
async def get_dashboard(
    current_user: dict = Depends(get_current_user),
) -> ApiResponse[DashboardData]:
    citizen_id = current_user["uid"]
    citizen = await data_store.get_citizen(citizen_id)
    if citizen is None:
        citizen = await data_store.upsert_citizen(
            citizen_id=citizen_id,
            name=current_user.get("name") or current_user.get("email") or "Citizen",
            email=current_user.get("email") or "",
            phone=current_user.get("phone_number") or "",
        )
    dashboard = await data_store.get_dashboard(
        citizen_id,
        citizen=citizen,
    )
    return ApiResponse(success=True, data=dashboard)
