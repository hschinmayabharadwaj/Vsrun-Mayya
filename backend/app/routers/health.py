from datetime import datetime, timezone

from fastapi import APIRouter

from app.models import ApiResponse, HealthData
from app.config import get_settings
from app.services.data_store import data_store

router = APIRouter()


@router.get("")
async def health_check() -> ApiResponse[HealthData]:
    settings = get_settings()
    return ApiResponse(
        success=True,
        data=HealthData(
            status="healthy",
            timestamp=datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            storage=data_store.mode,
            environment=settings.node_env,
            version="1.0.0",
        ),
    )
