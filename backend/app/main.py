from collections import defaultdict
import time

from fastapi.exceptions import RequestValidationError
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.routers import applications, dashboard, grievances, health, portal, services
from app.services.firebase_client import get_storage_mode

_request_log: dict[str, list[float]] = defaultdict(list)


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="Citizen Services API",
        description="REST API for the Citizen Services Portal — FastAPI + Firebase Firestore",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.cors_origin],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
        allow_headers=["*"],
    )

    @app.middleware("http")
    async def rate_limit_middleware(request: Request, call_next):
        ip = request.client.host if request.client else "unknown"
        now = time.time()
        window = [t for t in _request_log[ip] if now - t < 60]
        if len(window) >= 300:
            return JSONResponse(
                status_code=429,
                content={
                    "success": False,
                    "error": "Too many requests. Please wait a moment and try again.",
                },
            )
        window.append(now)
        _request_log[ip] = window
        return await call_next(request)

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(_request: Request, exc: RequestValidationError):
        errors = exc.errors()
        message = ", ".join(
            f"{'.'.join(str(loc) for loc in e['loc'] if loc != 'body')}: {e['msg']}"
            for e in errors
        )
        return JSONResponse(
            status_code=400,
            content={"success": False, "error": message or "Invalid request"},
        )

    @app.exception_handler(HTTPException)
    async def http_exception_handler(_request: Request, exc: HTTPException):
        detail = exc.detail if isinstance(exc.detail, str) else str(exc.detail)
        return JSONResponse(
            status_code=exc.status_code,
            content={"success": False, "error": detail},
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(_request: Request, exc: Exception):
        message = (
            "An unexpected error occurred. Please try again."
            if settings.is_production
            else str(exc)
        )
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": message},
        )

    @app.get("/")
    async def root():
        return {
            "name": "Citizen Services API",
            "version": "1.0.0",
            "framework": "FastAPI",
            "storage": get_storage_mode(),
            "docs": {
                "health": "/api/health",
                "services": "/api/services",
                "applications": "/api/applications",
                "dashboard": "/api/dashboard",
                "grievances": "/api/grievances",
                "portal": "/api/portal",
                "openapi": "/docs",
            },
        }

    app.include_router(health.router, prefix="/api/health", tags=["health"])
    app.include_router(services.router, prefix="/api/services", tags=["services"])
    app.include_router(applications.router, prefix="/api/applications", tags=["applications"])
    app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
    app.include_router(grievances.router, prefix="/api/grievances", tags=["grievances"])
    app.include_router(portal.router, prefix="/api/portal", tags=["portal"])

    return app


app = create_app()
