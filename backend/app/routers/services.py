from fastapi import APIRouter, HTTPException, Query

from app.models import ApiResponse, Service
from app.services.data_store import data_store

router = APIRouter()


@router.get("")
async def list_services(
    category: str | None = Query(None),
    onlineOnly: bool = Query(False),
    search: str | None = Query(None),
    popular: bool = Query(False),
) -> ApiResponse[list[Service]]:
    services = await data_store.get_services(
        category=category,
        online_only=onlineOnly,
        search=search,
    )
    if popular:
        services = [s for s in services if s.popular]
    return ApiResponse(success=True, data=services, meta={"total": len(services)})


@router.get("/{slug}")
async def get_service(slug: str) -> ApiResponse[Service]:
    service = await data_store.get_service_by_slug(slug)
    if service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    return ApiResponse(success=True, data=service)
