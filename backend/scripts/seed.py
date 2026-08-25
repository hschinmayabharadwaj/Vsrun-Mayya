"""Seed Firestore with demo catalog data."""

from app.data.catalog import (
    COLLECTIONS,
    SEED_APPLICATIONS,
    SEED_APPLICATION_IDS,
    SEED_DRAFTS,
    SEED_NOTIFICATIONS,
    SERVICES_CATALOG,
    build_timeline,
)
from app.config import get_settings
from app.services.firebase_client import get_firestore


def main() -> None:
    settings = get_settings()
    if settings.use_mock_db:
        print("USE_MOCK_DB=true — data is already seeded in memory mode.")
        print("Set USE_MOCK_DB=false and configure Firebase to seed Firestore.")
        return

    db = get_firestore()
    if db is None:
        print("Firebase not configured. Check GOOGLE_APPLICATION_CREDENTIALS.")
        return

    batch = db.batch()

    for service in SERVICES_CATALOG:
        ref = db.collection(COLLECTIONS["services"]).document(service.id)
        batch.set(ref, service.model_dump())

    for i, app_data in enumerate(SEED_APPLICATIONS):
        app_id = SEED_APPLICATION_IDS[i]
        status = app_data["status"]
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
    print("Firestore seeded successfully.")


if __name__ == "__main__":
    main()
