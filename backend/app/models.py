from typing import Any, Generic, Literal, TypeVar

from pydantic import BaseModel, Field

ApplicationStatus = Literal[
    "draft", "submitted", "under_review", "verified", "approved", "rejected"
]
ServiceCategory = Literal[
    "identity_civil",
    "education_skills",
    "health_welfare",
    "business_trade",
    "housing_land",
]

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    success: bool
    data: T | None = None
    error: str | None = None
    meta: dict[str, Any] | None = None


class TimelineStep(BaseModel):
    stage: str
    label: str
    completed: bool
    active: bool
    timestamp: str | None = None


class Service(BaseModel):
    id: str
    slug: str
    name: str
    description: str
    category: ServiceCategory
    department: str
    processingDays: str
    requiredDocuments: list[str]
    onlineAvailable: bool
    icon: str
    popular: bool | None = None


class Application(BaseModel):
    id: str
    serviceId: str
    serviceName: str
    citizenId: str
    citizenName: str
    status: ApplicationStatus
    timeline: list[TimelineStep]
    formData: dict[str, Any] = Field(default_factory=dict)
    submittedAt: str
    updatedAt: str
    notes: str | None = None


class Notification(BaseModel):
    id: str
    citizenId: str
    applicationId: str | None = None
    message: str
    read: bool
    createdAt: str


class Citizen(BaseModel):
    id: str
    name: str
    email: str
    phone: str = ""


class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, max_length=500)
    history: list[dict[str, Any]] = Field(default_factory=list)


class ChatLink(BaseModel):
    label: str
    href: str


class ChatReply(BaseModel):
    answer: str
    intent: str
    matches: list[str] | None = None
    links: list[ChatLink] | None = None


class RegisterUserPayload(BaseModel):
    name: str | None = Field(default=None, max_length=120)
    phone: str = Field(default="", max_length=30)


class Draft(BaseModel):
    id: str
    serviceId: str
    serviceName: str
    citizenId: str
    lastSaved: str
    progress: int


class CreateApplicationPayload(BaseModel):
    serviceId: str
    citizenId: str = "demo-citizen-001"
    citizenName: str = "Demo Citizen"
    formData: dict[str, Any] = Field(default_factory=dict)
    saveAsDraft: bool = False


class DashboardData(BaseModel):
    citizen: Citizen
    applications: list[Application]
    notifications: list[Notification]
    drafts: list[Draft]
    unreadCount: int


class HealthData(BaseModel):
    status: str
    timestamp: str
    storage: str
    environment: str
    version: str
