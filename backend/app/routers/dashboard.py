from fastapi import APIRouter, Depends

from app.data.catalog import DEMO_CITIZEN
from app.dependencies import get_current_user
from app.models import ApiResponse, DashboardData
from app.services.data_store import data_store

router = APIRouter()


@router.get("")
async def get_dashboard(
    current_user: dict = Depends(get_current_user),
) -> ApiResponse[DashboardData]:
    citizen_id = current_user["uid"]
    dashboard = await data_store.get_dashboard(
        citizen_id,
        citizen=DEMO_CITIZEN.model_copy(update={
            "id": citizen_id,
            "name": current_user.get("name") or current_user.get("email") or DEMO_CITIZEN.name,
            "email": current_user.get("email") or DEMO_CITIZEN.email,
            "phone": current_user.get("phone_number") or "",
        }),
    )
    return ApiResponse(success=True, data=dashboard)
