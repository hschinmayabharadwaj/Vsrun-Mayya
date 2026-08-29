"""Rule-based chat assistant (Approach A) — no LLM, no API keys, no network calls."""

import re

from fastapi import APIRouter

from app.data.catalog import SERVICES_CATALOG
from app.data.portal_content import FAQS, GRIEVANCE_CATEGORIES, HELPLINES
from app.models import ApiResponse, ChatLink, ChatMessage, ChatReply

router = APIRouter()

GREETING_WORDS = {"hi", "hello", "hey", "namaste", "hola"}
TRACK_WORDS = {"track", "status", "reference", "ref", "where", "my application"}
HELPLINE_WORDS = {"helpline", "emergency", "number", "police", "ambulance", "fire", "women", "child", "cyber", "toll", "contact", "call"}
GRIEVANCE_WORDS = {"grievance", "complaint", "complain", "complained"}
SERVICE_WORDS = {"apply", "how", "documents", "eligibility", "fee", "certificate", "license", "licence", "pension", "scholarship", "required", "need", "register", "renew"}

SYNONYMS = {
    "aadhar": "aadhaar",
    "adhaar": "aadhaar",
    "licence": "license",
    "cert": "certificate",
}


def _normalize(text: str) -> str:
    text = text.lower().strip()
    for key, value in SYNONYMS.items():
        text = text.replace(key, value)
    text = re.sub(r"[^a-z0-9\s]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def _service_score(text: str, service) -> int:
    query = set(_normalize(text).split())
    name = set(_normalize(service.name).split())
    desc = set(_normalize(service.description).split())
    docs = set(_normalize(" ".join(service.requiredDocuments)).split())
    return len(name & query) * 3 + len(desc & query) + len(docs & query)


def _helplines_text(group: str, count: int) -> str:
    items = HELPLINES.get(group, [])[:count]
    return ", ".join(f"{item['number']} ({item['title']})" for item in items)


def _reply_greeting() -> ChatReply:
    return ChatReply(
        answer="Hello! I'm the Citizen Services assistant. I can help you find services, apply, track applications, and reach helplines.",
        intent="greeting",
        links=[
            ChatLink(label="Browse services", href="/services"),
            ChatLink(label="Track application", href="/track"),
            ChatLink(label="Helplines", href="/helpline"),
        ],
    )


def _reply_helpline() -> ChatReply:
    emergency = _helplines_text("emergency", 4)
    return ChatReply(
        answer=f"Emergency numbers: {emergency}. The full list of emergency and department helplines is on the Helpline page.",
        intent="helpline",
        matches=["112 Emergency", "102 Ambulance", "100 Police", "101 Fire"],
        links=[ChatLink(label="View all helplines", href="/helpline")],
    )


def _reply_track() -> ChatReply:
    return ChatReply(
        answer="Use Track Application and enter your reference ID to see the real-time status. If you are signed in, your applications are also shown on My Dashboard.",
        intent="track",
        links=[
            ChatLink(label="Track application", href="/track"),
            ChatLink(label="My dashboard", href="/dashboard"),
        ],
    )


def _reply_grievance() -> ChatReply:
    categories = ", ".join(GRIEVANCE_CATEGORIES[:3])
    return ChatReply(
        answer=f"You can file a grievance on the Grievance page. Common categories include {categories}. A reference number is issued for tracking.",
        intent="grievance",
        matches=GRIEVANCE_CATEGORIES[:3],
        links=[ChatLink(label="File a grievance", href="/grievance")],
    )


def _reply_service(text: str) -> ChatReply | None:
    scored = sorted(
        ((_service_score(text, s), s) for s in SERVICES_CATALOG),
        key=lambda item: item[0],
        reverse=True,
    )
    best_score, best = scored[0]
    if best_score <= 0:
        return None
    docs = ", ".join(best.requiredDocuments)
    return ChatReply(
        answer=f"To apply for {best.name}: this service is handled by the {best.department} and typically takes {best.processingDays}. Required documents: {docs}. You can apply online from the Services page.",
        intent="service",
        matches=[best.name],
        links=[ChatLink(label=f"Apply for {best.name}", href=f"/services?search={best.name.lower()}")],
    )


def _reply_faq(text: str) -> ChatReply | None:
    query = set(_normalize(text).split())
    for faq in FAQS:
        q = set(_normalize(faq["question"]).split())
        if query & q:
            link = faq.get("link")
            return ChatReply(
                answer=faq["answer"],
                intent="faq",
                links=[ChatLink(label=link["label"], href=link["href"])] if link else None,
            )
    return None


def _reply_fallback() -> ChatReply:
    return ChatReply(
        answer="I can help you with services, applying, tracking applications, helplines, and grievances. Try asking something like 'How do I get an income certificate?' or 'Emergency helplines'.",
        intent="fallback",
        links=[
            ChatLink(label="Browse services", href="/services"),
            ChatLink(label="Track application", href="/track"),
            ChatLink(label="Helplines", href="/helpline"),
            ChatLink(label="File a grievance", href="/grievance"),
        ],
    )


def resolve_chat(message: str) -> ChatReply:
    text = _normalize(message)
    words = set(text.split())

    if not text:
        return _reply_fallback()

    if words & GREETING_WORDS:
        return _reply_greeting()
    if words & HELPLINE_WORDS:
        return _reply_helpline()
    if words & GRIEVANCE_WORDS:
        return _reply_grievance()
    if words & TRACK_WORDS:
        return _reply_track()
    if words & SERVICE_WORDS or any(w in text for w in ("certificate", "license", "pension", "scholarship")):
        reply = _reply_service(text)
        if reply is not None:
            return reply

    reply = _reply_faq(text)
    if reply is not None:
        return reply

    return _reply_fallback()


@router.post("", response_model=ApiResponse[ChatReply])
async def chat(msg: ChatMessage) -> ApiResponse[ChatReply]:
    return ApiResponse(success=True, data=resolve_chat(msg.message))