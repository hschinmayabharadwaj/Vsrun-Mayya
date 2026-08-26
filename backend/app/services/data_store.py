from __future__ import annotations

import secrets
import string
from datetime import datetime, timezone

from app.data.catalog import (
    COLLECTIONS,
    DEMO_CITIZEN,
    SEED_APPLICATIONS,
    SEED_APPLICATION_IDS,
    SEED_DRAFTS,
    SEED_NOTIFICATIONS,
    SERVICES_CATALOG,
    build_timeline,
)
from app.models import (
    Application,
    ApplicationStatus,
    CreateApplicationPayload,
    DashboardData,
    Draft,
    Notification,
    Service,
)
from app.services.firebase_client import get_firestore, get_storage_mode


def _generate_id(length: int = 8) -> str:
    alphabet = string.digits + "ABCDEFGHJKLMNPQRSTUVWXYZ"
    return "".join(secrets.choice(alphabet) for _ in range(length))


class _MemoryStore:
    def __init__(self) -> None:
        self.services = list(SERVICES_CATALOG)
        self.applications: list[Application] = []
        self.notifications: list[Notification] = []
        self.drafts = list(SEED_DRAFTS)
        self._seeded = False

    def seed(self) -> None:
        if self._seeded:
            return
        for i, app_data in enumerate(SEED_APPLICATIONS):
            status: ApplicationStatus = app_data["status"]  # type: ignore[assignment]
            self.applications.append(
                Application(
                    id=SEED_APPLICATION_IDS[i],
                    timeline=build_timeline(status),
                    **{k: v for k, v in app_data.items() if k != "status"},
                    status=status,
                )
            )
        for i, notif_data in enumerate(SEED_NOTIFICATIONS):
            self.notifications.append(
                Notification(id=f"notif-{i + 1:03d}", **notif_data)
            )
        self._seeded = True


_memory = _MemoryStore()
_memory.seed()


class DataStore:
    @property
    def mode(self) -> str:
        return get_storage_mode()

    def _filter_services(
        self,
        services: list[Service],
        category: str | None = None,
        online_only: bool = False,
        search: str | None = None,
    ) -> list[Service]:
        results = services
        if category and category != "all":
            results = [s for s in results if s.category == category]
        if online_only:
            results = [s for s in results if s.onlineAvailable]
        if search:
            q = search.lower()
            results = [
                s
                for s in results
                if q in s.name.lower()
                or q in s.description.lower()
                or q in s.department.lower()
            ]
        return results

    async def get_services(
        self,
        category: str | None = None,
        online_only: bool = False,
        search: str | None = None,
    ) -> list[Service]:
        db = get_firestore()
        if db is None:
            return self._filter_services(list(_memory.services), category, online_only, search)

        snapshot = db.collection(COLLECTIONS["services"]).stream()
        docs = list(snapshot)
        if not docs:
            await self._seed_firestore(db)
            return self._filter_services(list(SERVICES_CATALOG), category, online_only, search)

        services = [Service(**doc.to_dict()) for doc in docs]
        return self._filter_services(services, category, online_only, search)

    async def get_service_by_slug(self, slug: str) -> Service | None:
        services = await self.get_services()
        return next((s for s in services if s.slug == slug), None)

    async def get_applications(self, citizen_id: str | None = None) -> list[Application]:
        db = get_firestore()
        if db is None:
            apps = _memory.applications
            if citizen_id:
                apps = [a for a in apps if a.citizenId == citizen_id]
            return list(apps)

        query = db.collection(COLLECTIONS["applications"])
        if citizen_id:
            query = query.where("citizenId", "==", citizen_id)
        query = query.order_by("updatedAt", direction="DESCENDING")
        return [Application(id=doc.id, **doc.to_dict()) for doc in query.stream()]

    async def get_application_by_id(self, app_id: str) -> Application | None:
        db = get_firestore()
        if db is None:
            return next((a for a in _memory.applications if a.id == app_id), None)

        doc = db.collection(COLLECTIONS["applications"]).document(app_id).get()
        if not doc.exists:
            return None
        return Application(id=doc.id, **doc.to_dict())

    async def create_application(self, payload: CreateApplicationPayload) -> Application:
        now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

        service = (
            next((s for s in SERVICES_CATALOG if s.id == payload.serviceId), None)
            or next((s for s in SERVICES_CATALOG if s.slug == payload.serviceId), None)
            or await self.get_service_by_slug(payload.serviceId)
            or SERVICES_CATALOG[1]
        )

        prefix = service.slug[:3].upper()
        year = datetime.now(timezone.utc).year
        app_id = f"{prefix}-{year}-{_generate_id()}"
        status: ApplicationStatus = "draft" if payload.saveAsDraft else "submitted"
        timeline_status: ApplicationStatus = "submitted" if status == "draft" else status

        application = Application(
            id=app_id,
            serviceId=service.id,
            serviceName=service.name,
            citizenId=payload.citizenId,
            citizenName=payload.citizenName,
            status=status,
            timeline=build_timeline(timeline_status),
            formData=payload.formData,
            submittedAt=now,
            updatedAt=now,
        )

        db = get_firestore()
        if db is None:
            _memory.applications.insert(0, application)
        else:
            db.collection(COLLECTIONS["applications"]).document(app_id).set(
                application.model_dump()
            )

        return application

    async def get_notifications(self, citizen_id: str) -> list[Notification]:
        db = get_firestore()
        if db is None:
            return [n for n in _memory.notifications if n.citizenId == citizen_id]

        query = (
            db.collection(COLLECTIONS["notifications"])
            .where("citizenId", "==", citizen_id)
            .order_by("createdAt", direction="DESCENDING")
        )
        return [Notification(id=doc.id, **doc.to_dict()) for doc in query.stream()]

    async def get_drafts(self, citizen_id: str) -> list[Draft]:
        db = get_firestore()
        if db is None:
            return [Draft(**d) for d in _memory.drafts if d["citizenId"] == citizen_id]

        query = db.collection(COLLECTIONS["drafts"]).where("citizenId", "==", citizen_id)
        return [Draft(id=doc.id, **doc.to_dict()) for doc in query.stream()]

    async def get_dashboard(self, citizen_id: str, citizen: Citizen | None = None) -> DashboardData:
        applications = await self.get_applications(citizen_id)
        notifications = await self.get_notifications(citizen_id)
        drafts = await self.get_drafts(citizen_id)
        return DashboardData(
            citizen=citizen or DEMO_CITIZEN,
            applications=applications,
            notifications=notifications,
            drafts=drafts,
            unreadCount=sum(1 for n in notifications if not n.read),
        )

    async def _seed_firestore(self, db) -> None:
        batch = db.batch()
        for service in SERVICES_CATALOG:
            ref = db.collection(COLLECTIONS["services"]).document(service.id)
            batch.set(ref, service.model_dump())

        for i, app_data in enumerate(SEED_APPLICATIONS):
            app_id = SEED_APPLICATION_IDS[i]
            status: ApplicationStatus = app_data["status"]  # type: ignore[assignment]
            batch.set(
                db.collection(COLLECTIONS["applications"]).document(app_id),
                {
                    **app_data,
                    "id": app_id,
                    "timeline": [s.model_dump() for s in build_timeline(status)],
                },
            )

        for i, notif_data in enumerate(SEED_NOTIFICATIONS):
            batch.set(
                db.collection(COLLECTIONS["notifications"]).document(f"notif-{i + 1}"),
                {**notif_data, "id": f"notif-{i + 1:03d}"},
            )

        for draft in SEED_DRAFTS:
            batch.set(db.collection(COLLECTIONS["drafts"]).document(draft["id"]), draft)

        batch.commit()


data_store = DataStore()
