"""Portal content served via API — no hardcoded data in frontend."""

HELPLINES = {
    "emergency": [
        {
            "number": "112",
            "title": "Integrated Helpline (ERSS)",
            "description": "Police, Fire & Rescue, Health Services etc.",
            "icon": "call",
        },
        {
            "number": "102",
            "title": "National Ambulance Service",
            "description": "National Ambulance Service (NAS)",
            "icon": "local_hospital",
        },
        {
            "number": "100",
            "title": "Police Helpline",
            "description": "Police emergency assistance",
            "icon": "local_police",
        },
        {
            "number": "101",
            "title": "Fire Helpline",
            "description": "Fire and rescue emergency",
            "icon": "fire_truck",
        },
    ],
    "other": [
        {"number": "1930", "title": "Cyber Crime Helpline"},
        {"number": "1906", "title": "LPG Leak Helpline"},
        {"number": "1091", "title": "Women Helpline"},
        {"number": "1098", "title": "Child Helpline"},
        {"number": "14567", "title": "Senior Citizen Helpline"},
        {"number": "14416", "title": "Toll Free Tourist Helpline"},
        {"number": "1075", "title": "National Consumer Helpline"},
        {"number": "1912", "title": "Electricity Complaint"},
        {"number": "1911", "title": "Blood Requirement / Information"},
        {"number": "14402", "title": "Railway Enquiry"},
        {"number": "139", "title": "Railway Alert / Emergency"},
        {"number": "108", "title": "Medical Emergency / Ambulance"},
    ],
}

NOTICES = [
    {
        "id": "notice-001",
        "text": "New scholarship schemes open for academic year 2026–27.",
        "link": "/services?search=scholarship",
        "linkLabel": "View details",
    },
]

PORTAL_CONFIG = {
    "siteName": "Citizen Services Portal",
    "siteTagline": "National Portal of Citizen Services",
    "department": "Ministry of Electronics & Information Technology",
    "prototypeNotice": "Prototype / Demo — Not an official Government of India website. All data is synthetic.",
    "contact": {
        "tollFree": "1800-111-5555",
        "email": "support-citizenservices@gov.in.demo",
        "hours": "Mon–Sat, 8:00 AM – 8:00 PM IST",
    },
    "searchCategories": [
        {"value": "all", "label": "All Categories"},
        {"value": "identity_civil", "label": "Identity & Civil"},
        {"value": "education_skills", "label": "Education & Skills"},
        {"value": "health_welfare", "label": "Health & Welfare"},
        {"value": "business_trade", "label": "Business & Trade"},
        {"value": "housing_land", "label": "Housing & Land"},
    ],
}

DIRECTORY_NAV = [
    {"label": "Departments", "href": "/departments"},
    {"label": "Services", "href": "/services"},
    {"label": "Helpline", "href": "/helpline"},
    {"label": "Grievance", "href": "/grievance"},
    {"label": "Help", "href": "/help"},
]

POLICIES = [
    {
        "id": "digital-services",
        "title": "Digital Services Delivery Policy",
        "summary": "Standards for online service availability, response times, and citizen access across departments.",
        "updated": "January 2026",
        "category": "Service Delivery",
    },
    {
        "id": "data-protection",
        "title": "Citizen Data Protection Guidelines",
        "summary": "Collection, storage, and use of personal data on government digital platforms.",
        "updated": "December 2025",
        "category": "Privacy & Security",
    },
    {
        "id": "grievance-redressal",
        "title": "Public Grievance Redressal Framework",
        "summary": "Process and timelines for filing, escalating, and resolving citizen complaints.",
        "updated": "November 2025",
        "category": "Accountability",
    },
    {
        "id": "accessibility",
        "title": "Guidelines for Indian Government Websites (GIGW)",
        "summary": "WCAG-compliant interfaces, multilingual support, and low-bandwidth access requirements.",
        "updated": "October 2025",
        "category": "Inclusion",
    },
    {
        "id": "rti",
        "title": "Right to Information (RTI) Procedure",
        "summary": "How citizens may request official records and track RTI application status.",
        "updated": "September 2025",
        "category": "Transparency",
    },
]

FAQS = [
    {
        "question": "How do I track my application?",
        "answer": "Use Track Application and enter your reference ID. You may also view applications on My Dashboard.",
        "link": {"href": "/track", "label": "Track application"},
    },
    {
        "question": "What documents are required?",
        "answer": "Required documents are listed on each service page in the Services Directory.",
        "link": {"href": "/services", "label": "Browse services"},
    },
    {
        "question": "How do I file a grievance?",
        "answer": "Submit a complaint on the Grievance page. A reference number will be issued for tracking.",
        "link": {"href": "/grievance", "label": "File grievance"},
    },
    {
        "question": "Where can I find emergency helpline numbers?",
        "answer": "Emergency and department helpline numbers are listed on the Helpline page.",
        "link": {"href": "/helpline", "label": "View helplines"},
    },
]

PRIVACY_SECTIONS = [
    {
        "title": "Information We Collect",
        "body": "This demonstration portal uses synthetic data only. No real Aadhaar, PAN, or personal identifiers are stored.",
    },
    {
        "title": "How Data Is Used",
        "body": "Demo data simulates application submission, status tracking, and dashboard features for evaluation purposes.",
    },
    {
        "title": "Data Sharing",
        "body": "No data from this prototype is shared with third parties or connected to live government systems.",
    },
    {
        "title": "Your Rights",
        "body": "Production systems would provide access, correction, and deletion rights as per applicable law.",
    },
    {
        "title": "Contact",
        "body": "For queries regarding this demo platform, use the contact details on the Help page.",
    },
]

TERMS_SECTIONS = [
    {
        "title": "Acceptance of Terms",
        "body": "Use of this portal constitutes acceptance that it is a demonstration platform, not an official Government of India website.",
    },
    {
        "title": "Permitted Use",
        "body": "The portal may be used to explore demo services and workflows. Do not submit real personal identification numbers.",
    },
    {
        "title": "Service Availability",
        "body": "The demo is provided as-is without warranty regarding uptime, accuracy, or completeness.",
    },
    {
        "title": "Prohibited Conduct",
        "body": "Users must not attempt unauthorized access, submit malicious data, or misrepresent the portal as an official government site.",
    },
    {
        "title": "Limitation of Liability",
        "body": "No liability is accepted for decisions made based on information in this prototype environment.",
    },
]

GRIEVANCE_CATEGORIES = [
    "Service delivery delay",
    "Application status not updating",
    "Incorrect information on portal",
    "Accessibility issue",
    "Payment or fee related",
    "Staff conduct",
    "Other",
]

FOOTER_LINKS = [
    {"label": "Departments", "href": "/departments"},
    {"label": "Policies", "href": "/policies"},
    {"label": "Help", "href": "/help"},
    {"label": "Grievance", "href": "/grievance"},
    {"label": "Privacy", "href": "/privacy"},
    {"label": "Terms", "href": "/terms"},
]
