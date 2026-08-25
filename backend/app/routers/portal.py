from fastapi import APIRouter, Query

from app.data.portal_content import (
    DIRECTORY_NAV,
    FAQS,
    FOOTER_LINKS,
    GRIEVANCE_CATEGORIES,
    HELPLINES,
    NOTICES,
    POLICIES,
    PORTAL_CONFIG,
    PRIVACY_SECTIONS,
    TERMS_SECTIONS,
)
from app.models import ApiResponse

router = APIRouter()


@router.get("/config")
async def get_config() -> ApiResponse[dict]:
    return ApiResponse(success=True, data=PORTAL_CONFIG)


@router.get("/notices")
async def get_notices() -> ApiResponse[list]:
    return ApiResponse(success=True, data=NOTICES)


@router.get("/directory-nav")
async def get_directory_nav() -> ApiResponse[list]:
    return ApiResponse(success=True, data=DIRECTORY_NAV)


@router.get("/footer-links")
async def get_footer_links() -> ApiResponse[list]:
    return ApiResponse(success=True, data=FOOTER_LINKS)


@router.get("/helplines")
async def get_helplines() -> ApiResponse[dict]:
    return ApiResponse(success=True, data=HELPLINES)


@router.get("/policies")
async def get_policies() -> ApiResponse[list]:
    return ApiResponse(success=True, data=POLICIES)


@router.get("/faqs")
async def get_faqs() -> ApiResponse[list]:
    return ApiResponse(success=True, data=FAQS)


@router.get("/privacy")
async def get_privacy() -> ApiResponse[list]:
    return ApiResponse(success=True, data=PRIVACY_SECTIONS)


@router.get("/terms")
async def get_terms() -> ApiResponse[list]:
    return ApiResponse(success=True, data=TERMS_SECTIONS)


@router.get("/grievance-categories")
async def get_grievance_categories() -> ApiResponse[list]:
    return ApiResponse(success=True, data=GRIEVANCE_CATEGORIES)
