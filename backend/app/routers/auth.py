from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies import get_current_user
from app.models import ApiResponse, Citizen, RegisterUserPayload
from app.services.data_store import data_store

router = APIRouter()


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(
    payload: RegisterUserPayload,
    current_user: dict = Depends(get_current_user),
) -> ApiResponse[Citizen]:
    """Register the Firebase-authenticated identity in the citizen portal."""
    user_id = current_user.get("uid")
    email = current_user.get("email")
    if not user_id or not email:
        raise HTTPException(status_code=401, detail="The authenticated account is missing required profile data.")

    token_name = str(current_user.get("name") or "").strip()
    requested_name = (payload.name or "").strip()
    name = requested_name or token_name or email.split("@", 1)[0] or "Citizen"
    citizen = await data_store.upsert_citizen(
        citizen_id=user_id,
        name=name,
        email=email,
        phone=payload.phone.strip(),
    )
    return ApiResponse(success=True, data=citizen)
