from fastapi import APIRouter, HTTPException, Query

from app.data.catalog import DEMO_CITIZEN
from app.models import ApiResponse, Application, CreateApplicationPayload
from app.services.data_store import data_store

router = APIRouter()


@router.get("")
async def list_applications(
    citizenId: str | None = Query(None),
) -> ApiResponse[list[Application]]:
    citizen_id = citizenId or DEMO_CITIZEN.id
    applications = await data_store.get_applications(citizen_id)
    return ApiResponse(success=True, data=applications, meta={"total": len(applications)})


@router.get("/track/{app_id}")
async def track_application(app_id: str) -> ApiResponse[Application]:
    application = await data_store.get_application_by_id(app_id.upper())
    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found. Check your reference ID and try again.",
        )
    return ApiResponse(success=True, data=application)


@router.post("", status_code=201)
async def create_application(payload: CreateApplicationPayload) -> ApiResponse[Application]:
    application = await data_store.create_application(payload)
    return ApiResponse(success=True, data=application)
