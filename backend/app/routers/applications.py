from fastapi import APIRouter, Depends, HTTPException

from app.data.catalog import DEMO_CITIZEN
from app.dependencies import get_current_user
from app.models import ApiResponse, Application, CreateApplicationPayload
from app.services.data_store import data_store

router = APIRouter()


@router.get("")
async def list_applications(
    current_user: dict = Depends(get_current_user),
) -> ApiResponse[list[Application]]:
    applications = await data_store.get_applications(current_user["uid"])
    return ApiResponse(success=True, data=applications, meta={"total": len(applications)})


@router.get("/track/{app_id}")
async def track_application(app_id: str, current_user: dict = Depends(get_current_user)) -> ApiResponse[Application]:
    application = await data_store.get_application_by_id(app_id.upper())
    if application is None or application.citizenId != current_user["uid"]:
        raise HTTPException(
            status_code=404,
            detail="Application not found. Check your reference ID and try again.",
        )
    return ApiResponse(success=True, data=application)


@router.post("", status_code=201)
async def create_application(payload: CreateApplicationPayload, current_user: dict = Depends(get_current_user)) -> ApiResponse[Application]:
    citizen_name = current_user.get("name") or current_user.get("email") or DEMO_CITIZEN.name
    authenticated_payload = payload.model_copy(update={"citizenId": current_user["uid"], "citizenName": citizen_name})
    application = await data_store.create_application(authenticated_payload)
    return ApiResponse(success=True, data=application)
