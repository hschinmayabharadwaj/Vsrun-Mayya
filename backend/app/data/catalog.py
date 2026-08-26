from __future__ import annotations

from app.models import Application, ApplicationStatus, Citizen, Notification, Service, TimelineStep

DEMO_CITIZEN = Citizen(
    id="demo-citizen-001",
    name="Demo Citizen",
    email="demo.citizen@example.com",
    phone="+91-DEMO-0000-0001",
)

SERVICES_CATALOG: list[Service] = [
    Service(
        id="svc-birth-cert",
        slug="birth-certificate",
        name="Birth Certificate",
        description="Apply for a new birth certificate or request corrections to an existing one.",
        category="identity_civil",
        department="Civil Registry Department",
        processingDays="7 Working Days",
        requiredDocuments=["Hospital Record", "Parent ID Proof", "Address Proof"],
        onlineAvailable=True,
        icon="child_care",
        popular=True,
    ),
    Service(
        id="svc-income-cert",
        slug="income-certificate",
        name="Income Certificate",
        description="Official document proving annual family income for schemes and subsidies.",
        category="identity_civil",
        department="Revenue Department",
        processingDays="10 Working Days",
        requiredDocuments=["ID Proof", "Address Proof", "Income Declaration"],
        onlineAvailable=True,
        icon="account_balance_wallet",
        popular=True,
    ),
    Service(
        id="svc-pension",
        slug="pension-scheme",
        name="Pension Scheme",
        description="Apply for old age, widow, or disability pension benefits.",
        category="health_welfare",
        department="Social Welfare Department",
        processingDays="30 Working Days",
        requiredDocuments=["Age Proof", "Bank Details", "ID Proof"],
        onlineAvailable=True,
        icon="elderly",
        popular=True,
    ),
    Service(
        id="svc-domicile",
        slug="domicile-certificate",
        name="Domicile Certificate",
        description="Proof of residence for educational admissions and state employment.",
        category="identity_civil",
        department="Revenue Department",
        processingDays="15 Working Days",
        requiredDocuments=["Residence Proof", "ID Proof", "Affidavit"],
        onlineAvailable=True,
        icon="home_work",
        popular=True,
    ),
    Service(
        id="svc-driving-license",
        slug="driving-license",
        name="Driving License",
        description="Apply for learner's or permanent driving license and renewals.",
        category="identity_civil",
        department="Transport Department",
        processingDays="14 Working Days",
        requiredDocuments=["Age Proof", "Address Proof", "Medical Certificate"],
        onlineAvailable=True,
        icon="directions_car",
        popular=True,
    ),
    Service(
        id="svc-scholarship",
        slug="scholarships",
        name="Scholarships",
        description="Access state and central government scholarship portals for students.",
        category="education_skills",
        department="Department of Education",
        processingDays="Varies",
        requiredDocuments=["Transcripts", "Income Certificate", "ID Proof"],
        onlineAvailable=True,
        icon="school",
        popular=True,
    ),
    Service(
        id="svc-legal-heir",
        slug="legal-heir",
        name="Legal Heir Certificate",
        description="Certificate required to establish relationship for inheritance claims.",
        category="identity_civil",
        department="Revenue Department",
        processingDays="21 Working Days",
        requiredDocuments=["Death Certificate", "Family Records", "Affidavit"],
        onlineAvailable=True,
        icon="gavel",
    ),
    Service(
        id="svc-police-clearance",
        slug="police-clearance",
        name="Police Clearance",
        description="Apply for a Police Clearance Certificate for employment or passport.",
        category="identity_civil",
        department="Police Department",
        processingDays="10 Working Days",
        requiredDocuments=["ID Proof", "Address Proof", "Passport Photo"],
        onlineAvailable=True,
        icon="local_police",
    ),
    Service(
        id="svc-id-renewal",
        slug="national-id-renewal",
        name="National ID Card Renewal",
        description="Renew or update your national identity card details.",
        category="identity_civil",
        department="Civil Registry Department",
        processingDays="5-7 Business Days",
        requiredDocuments=["Current ID", "Proof of Address", "Recent Photo"],
        onlineAvailable=True,
        icon="badge",
    ),
    Service(
        id="svc-business-license",
        slug="business-license",
        name="Small Business License Registration",
        description="Register your small business and obtain operating license.",
        category="business_trade",
        department="Department of Commerce",
        processingDays="14-21 Business Days",
        requiredDocuments=["Business Plan", "Tax ID", "Owner ID"],
        onlineAvailable=True,
        icon="storefront",
    ),
    Service(
        id="svc-health-insurance",
        slug="health-insurance",
        name="Public Health Insurance Enrollment",
        description="Enroll in public health insurance coverage for your family.",
        category="health_welfare",
        department="Ministry of Health",
        processingDays="Immediate upon visit",
        requiredDocuments=["Proof of Income", "ID", "Birth Certificate"],
        onlineAvailable=False,
        icon="local_hospital",
    ),
    Service(
        id="svc-uni-scholarship",
        slug="university-scholarship",
        name="University Scholarship Application",
        description="Apply for higher education scholarships and financial aid.",
        category="education_skills",
        department="Department of Education",
        processingDays="30-45 Days",
        requiredDocuments=["Transcripts", "Recommendation Letters", "Essay"],
        onlineAvailable=True,
        icon="school",
    ),
]

STATUS_ORDER: list[ApplicationStatus] = [
    "draft",
    "submitted",
    "under_review",
    "verified",
    "approved",
    "rejected",
]


def build_timeline(status: ApplicationStatus) -> list[TimelineStep]:
    stages = [
        ("submitted", "Submitted"),
        ("under_review", "Under Review"),
        ("verified", "Verified"),
        ("approved", "Approved"),
    ]
    current_index = STATUS_ORDER.index(status)

    steps: list[TimelineStep] = []
    for stage, label in stages:
        stage_index = STATUS_ORDER.index(stage)  # type: ignore[arg-type]
        completed = current_index > stage_index or status == "approved"
        active = (
            status == stage
            or (status == "under_review" and stage == "under_review")
            or (status == "verified" and stage == "verified")
        ) and not completed
        steps.append(
            TimelineStep(stage=stage, label=label, completed=completed, active=active)
        )
    return steps


SEED_APPLICATIONS: list[dict] = [
    {
        "serviceId": "svc-domicile",
        "serviceName": "Residential Certificate Renewal",
        "citizenId": DEMO_CITIZEN.id,
        "citizenName": DEMO_CITIZEN.name,
        "status": "verified",
        "formData": {"purpose": "Educational admission"},
        "submittedAt": "2026-08-10T09:00:00Z",
        "updatedAt": "2026-08-22T14:30:00Z",
        "notes": "Additional documentation may be required",
    },
    {
        "serviceId": "svc-driving-license",
        "serviceName": "Vehicle Registration Transfer",
        "citizenId": DEMO_CITIZEN.id,
        "citizenName": DEMO_CITIZEN.name,
        "status": "approved",
        "formData": {"vehicleNumber": "DEMO-XX-0000"},
        "submittedAt": "2026-07-15T11:00:00Z",
        "updatedAt": "2026-08-01T16:00:00Z",
    },
    {
        "serviceId": "svc-income-cert",
        "serviceName": "Income Certificate",
        "citizenId": DEMO_CITIZEN.id,
        "citizenName": DEMO_CITIZEN.name,
        "status": "submitted",
        "formData": {"annualIncome": "DEMO-450000"},
        "submittedAt": "2026-08-24T08:00:00Z",
        "updatedAt": "2026-08-24T08:00:00Z",
    },
]

SEED_APPLICATION_IDS = ["RES-2026-8842", "VEH-2026-1190", "INC-2026-0001"]

SEED_NOTIFICATIONS: list[dict] = [
    {
        "citizenId": DEMO_CITIZEN.id,
        "applicationId": "RES-2026-8842",
        "message": "Your Residential Certificate Renewal requires additional documentation.",
        "read": False,
        "createdAt": "2026-08-25T10:00:00Z",
    },
    {
        "citizenId": DEMO_CITIZEN.id,
        "message": "Scheduled maintenance on payment gateway tomorrow 2 AM - 4 AM.",
        "read": False,
        "createdAt": "2026-08-24T18:00:00Z",
    },
    {
        "citizenId": DEMO_CITIZEN.id,
        "applicationId": "VEH-2026-1190",
        "message": "Vehicle Registration successfully completed.",
        "read": True,
        "createdAt": "2026-08-21T12:00:00Z",
    },
]

SEED_DRAFTS = [
    {
        "id": "draft-001",
        "serviceId": "svc-business-license",
        "serviceName": "Business License App",
        "citizenId": DEMO_CITIZEN.id,
        "lastSaved": "2026-08-23T15:00:00Z",
        "progress": 40,
    },
    {
        "id": "draft-002",
        "serviceId": "svc-domicile",
        "serviceName": "Property Tax Declaration",
        "citizenId": DEMO_CITIZEN.id,
        "lastSaved": "2026-08-18T09:00:00Z",
        "progress": 60,
    },
]

COLLECTIONS = {
    "services": "services",
    "applications": "applications",
    "notifications": "notifications",
    "drafts": "drafts",
    "grievances": "grievances",
}
