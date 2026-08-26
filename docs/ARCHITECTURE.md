# Citizen Services Portal — Complete Architecture

## Table of Contents

1. [System Overview](#system-overview)
2. [High-Level Architecture](#high-level-architecture)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Database & Firestore](#database--firestore)
6. [API Reference](#api-reference)
7. [Authentication & Security](#authentication--security)
8. [Data Flow Diagrams](#data-flow-diagrams)
9. [Deployment Architecture](#deployment-architecture)

---

## System Overview

A monorepo citizen services portal built for the Public Service Hackathon. It provides a citizen-facing UI to browse government services, submit applications, track status, and file grievances.

| Layer | Technology | Port | Purpose |
|-------|-----------|------|---------|
| Frontend | Next.js 15 + React 19 + Tailwind CSS | 3000 | Citizen-facing UI |
| Backend | FastAPI (Python 3.11+) | 4000 | REST API + business logic |
| Database | Firebase Firestore | — | Persistent storage (or in-memory fallback) |
| Shared | TypeScript types | — | Type contract between frontend/backend |

---

## High-Level Architecture

```mermaid
graph TB
    subgraph Citizen["Citizen Device"]
        Browser["Browser / Mobile Browser"]
    end

    subgraph Frontend["Frontend — Next.js 15 (port 3000)"]
        AppRouter["App Router<br/>app/ directory"]
        Components["React Components<br/>Header · Footer · Cards"]
        APIClient["API Client<br/>lib/api.ts"]
        ThemeEngine["Theme Engine<br/>lib/theme.ts"]
        LucideIcons["Lucide Icons"]
    end

    subgraph Backend["Backend — FastAPI (port 4000)"]
        FastAPIApp["FastAPI App<br/>app/main.py"]
        Routers["Routers<br/>auth · services · applications · dashboard · grievances · portal"]
        DataStore["DataStore<br/>Dual-mode: Memory / Firestore"]
        FirebaseClient["Firebase Client<br/>Admin SDK"]
    end

    subgraph Database["Database"]
        Firestore["Cloud Firestore<br/>5 Collections"]
        MemoryStore["In-Memory Store<br/>Fallback mode"]
    end

    Browser -->|"HTTP :3000"| AppRouter
    AppRouter --> Components
    Components --> APIClient
    APIClient -->|"REST JSON :4000"| FastAPIApp
    FastAPIApp --> Routers
    Routers --> DataStore
    DataStore -->|"USE_MOCK_DB=false"| FirebaseClient
    DataStore -->|"USE_MOCK_DB=true"| MemoryStore
    FirebaseClient --> Firestore
```

---

## Frontend Architecture

### Directory Structure

```
frontend/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx            # Root layout (Outfit font, Lenis scroll)
│   ├── globals.css           # Tailwind + custom CSS
│   ├── page.tsx              # Home page
│   ├── not-found.tsx         # 404 page
│   ├── api/status/route.ts   # Mock API route (status)
│   ├── services/             # Service catalog
│   ├── apply/                # Application wizard
│   │   ├── page.tsx          # Generic apply form
│   │   └── [slug]/page.tsx   # Service-specific apply
│   ├── track/                # Track by reference ID
│   ├── dashboard/            # Citizen dashboard
│   ├── status/               # View all applications
│   ├── grievance/            # File grievance
│   ├── helpline/             # Emergency numbers
│   ├── help/                 # Help & FAQ
│   ├── departments/          # Department directory
│   ├── policies/             # Government policies
│   ├── privacy/              # Privacy policy
│   └── terms/                # Terms of service
├── components/               # Reusable UI components
│   ├── Header.tsx            # Glassmorphism sticky header
│   ├── Footer.tsx            # 4-column footer
│   ├── Icon.tsx              # Lucide icon wrapper
│   ├── Breadcrumbs.tsx       # Navigation breadcrumbs
│   ├── ServiceCard.tsx       # Service listing card
│   ├── ApplicationTimeline.tsx
│   ├── GrievanceForm.tsx
│   ├── CookieConsent.tsx
│   ├── PrototypeBanner.tsx
│   ├── DirectoryNavClient.tsx
│   ├── InfoPageLayout.tsx
│   ├── PortalChrome.tsx
│   ├── MotionWrappers.tsx    # Framer Motion animations
│   └── SmoothScrollProvider.tsx  # Lenis smooth scroll
├── lib/                      # Utilities & API layer
│   ├── api.ts                # Core API client (apiFetch)
│   ├── types.ts              # TypeScript interfaces
│   ├── portal-api.ts         # Portal-specific API calls
│   ├── theme.ts              # 3 switchable themes
│   ├── fonts.ts              # Outfit font config
│   ├── images.ts             # Curated Unsplash images
│   ├── dummydata.ts          # Frontend-only demo data
│   └── mock-data.ts          # Mock data for /api/status
├── public/
│   ├── logo.svg              # SVG logo (government building)
│   └── fonts/Outfit-Variable.woff2
├── tailwind.config.ts        # Theme-driven Tailwind config
├── next.config.js            # Turbopack root fix
└── package.json
```

### Component Flow

```mermaid
graph LR
    Layout["RootLayout<br/>Outfit · Lenis · PortalChrome"]
    Layout --> Banner["PrototypeBanner"]
    Layout --> Chrome["PortalChrome"]
    Layout --> Footer["Footer"]
    Layout --> Cookie["CookieConsent"]
    Chrome --> Header["Header<br/>Glassmorphism · Search · Nav"]
    Chrome --> Page["Page Content"]
    Page --> Cards["ServiceCard"]
    Page --> Timeline["ApplicationTimeline"]
    Page --> Grievance["GrievanceForm"]
    Page --> Icons["Icon<br/>Lucide wrapper"]
    Page --> Motion["MotionWrappers<br/>FadeIn · SlideUp"]
```

### Theme System

Three themes are defined in `lib/theme.ts`. Only one is active at a time (comment/uncomment to switch). The Tailwind config imports the active theme's colors, so all utility classes (`text-secondary`, `bg-gov-red`, etc.) update automatically.

```mermaid
graph TD
    ThemeFile["lib/theme.ts<br/>Active theme colors"] --> TWConfig["tailwind.config.ts<br/>Imports theme colors"]
    TWConfig --> CSSVars["globals.css<br/>CSS variables from theme"]
    TWConfig --> TailwindClasses["Tailwind utility classes<br/>text-secondary · bg-primary · etc."]
    CSSVars --> Gradients["Gradient classes<br/>gradient-primary · gradient-accent"]
```

| Theme | Primary | Accent | Style |
|-------|---------|--------|-------|
| Original | `#1f2937` | `#3b82f6` | Blue/Gray Corporate |
| Energetic Minimalism | `#3D3D3D` | `#FF4081` | Soft Neons & Bold Pops |
| **Soft Citrus (active)** | `#4A4A4A` | `#FF6D00` | Warm & Confident |

---

## Backend Architecture

### Directory Structure

```
backend/
├── app/
│   ├── main.py               # FastAPI app factory, middleware, exception handlers
│   ├── config.py             # Pydantic Settings (env-based)
│   ├── models.py             # All Pydantic schemas
│   ├── data/
│   │   ├── catalog.py        # 12 services, seed data, timeline builder
│   │   └── portal_content.py # Static portal content (FAQs, helplines, etc.)
│   ├── routers/
│   │   ├── services.py       # GET /api/services, GET /api/services/:slug
│   │   ├── applications.py   # GET/POST /api/applications
│   │   ├── dashboard.py      # GET /api/dashboard
│   │   ├── grievances.py     # POST/GET /api/grievances
│   │   ├── portal.py         # 10 portal content endpoints
│   │   └── health.py         # GET /api/health
│   └── services/
│       ├── data_store.py     # Dual-mode: Memory or Firestore
│       ├── firebase_client.py # Firebase Admin SDK init
│       └── grievances.py     # In-memory grievance store
├── scripts/
│   └── seed.py               # CLI Firestore seeder
├── requirements.txt
└── .env.example
```

### Startup Flow

```mermaid
sequenceDiagram
    participant CLI as Terminal
    participant UV as Uvicorn
    participant Main as app/main.py
    participant Config as app/config.py
    participant Firebase as Firebase Client
    participant Router as Routers

    CLI->>UV: python -m uvicorn app.main:app --reload --port 4000
    UV->>Main: create_app()
    Main->>Config: get_settings()
    Config-->>Main: Settings(CORS_ORIGIN, USE_MOCK_DB, ...)
    Main->>Main: Add CORSMiddleware
    Main->>Main: Add RateLimitMiddleware (300 req/min/IP)
    Main->>Main: Register ExceptionHandlers
    Main->>Router: Include all 6 routers under /api/
    Main-->>UV: FastAPI app ready
    UV-->>CLI: Uvicorn running on 0.0.0.0:4000

    Note over Firebase: On first DataStore call
    Main->>Firebase: get_firestore()
    alt USE_MOCK_DB=true
        Firebase-->>Main: None (use memory)
    else USE_MOCK_DB=false
        Firebase->>Firebase: Initialize Admin SDK
        Firebase-->>Main: Firestore client
    end
```

### Request Lifecycle

```mermaid
sequenceDiagram
    participant Client as Frontend
    participant CORS as CORS Middleware
    participant RateLimit as Rate Limiter
    participant Router as API Router
    participant DataStore as DataStore
    participant Storage as Memory / Firestore

    Client->>CORS: GET /api/services?category=education_skills
    CORS->>RateLimit: Check origin (localhost:3000)
    RateLimit->>RateLimit: Check IP count (300/60s window)
    alt Rate limit exceeded
        RateLimit-->>Client: 429 Too Many Requests
    else Under limit
        RateLimit->>Router: Forward request
        Router->>DataStore: get_services(category="education_skills")
        DataStore->>Storage: Query services collection
        Storage-->>DataStore: [Service, Service, ...]
        DataStore-->>Router: Filtered services list
        Router-->>Client: { success: true, data: [...], meta: { total: N } }
    end
```

### Rate Limiting

- **Algorithm:** Sliding window counter per IP
- **Limit:** 300 requests per 60-second window
- **Storage:** In-memory dictionary (resets on server restart)
- **Response:** `429 Too Many Requests` with `{"success": false, "error": "Too many requests..."}`

---

## Database & Firestore

### Collections Schema

```mermaid
erDiagram
    SERVICES {
        string id PK
        string slug UK
        string name
        string description
        string category
        string department
        string processingDays
        list requiredDocuments
        bool onlineAvailable
        string icon
        bool popular
    }

    APPLICATIONS {
        string id PK
        string serviceId FK
        string serviceName
        string citizenId FK
        string citizenName
        string status
        list timeline
        dict formData
        string submittedAt
        string updatedAt
        string notes
    }

    NOTIFICATIONS {
        string id PK
        string citizenId FK
        string applicationId FK
        string message
        bool read
        string createdAt
    }

    DRAFTS {
        string id PK
        string serviceId FK
        string serviceName
        string citizenId FK
        string lastSaved
        int progress
    }

    SERVICES ||--o{ APPLICATIONS : "generates"
    APPLICATIONS ||--o{ NOTIFICATIONS : "triggers"
    SERVICES ||--o{ DRAFTS : "saved in"
```

### Application Status Flow

```mermaid
stateDiagram-v2
    [*] --> draft: Citizen starts application
    draft --> submitted: Citizen submits
    submitted --> under_review: Officer reviews
    under_review --> verified: Documents verified
    verified --> approved: Final approval
    verified --> rejected: Issue found

    state draft {
        [*] --> InProgress
        InProgress --> InProgress: Auto-save
    }

    state submitted {
        [*] --> Waiting
    }

    state under_review {
        [*] --> Reviewing
        Reviewing --> NeedsInfo: Additional docs required
        NeedsInfo --> Reviewing: Citizen provides docs
    }
```

### Firestore Security Rules

```mermaid
graph TD
    Services["/services/{id}"] -->|"read: always<br/>write: never (admin only)"| Public["Public catalog"]
    Apps["/applications/{id}"] -->|"read: own citizenId<br/>write: never (backend SDK)"| AuthGuard["Auth guard"]
    Notifs["/notifications/{id}"] -->|"read: own citizenId<br/>write: never (backend SDK)"| AuthGuard
    Drafts["/drafts/{id}"] -->|"read/write: own citizenId<br/>(auth required)"| AuthGuard
```

### Composite Indexes

| Collection | Fields | Purpose |
|-----------|--------|---------|
| `applications` | `citizenId ASC, updatedAt DESC` | Dashboard: citizen's apps sorted by recent |
| `notifications` | `citizenId ASC, createdAt DESC` | Dashboard: citizen's notifications sorted by recent |

### Dual-Mode Storage

```mermaid
graph TD
    DS["DataStore<br/>app/services/data_store.py"] --> Check{"get_firestore()<br/>returns None?"}
    Check -->|"Yes (USE_MOCK_DB=true)"| Mem["_MemoryStore<br/>Python dicts in RAM"]
    Check -->|"No (USE_MOCK_DB=false)"| Firestore["Firestore Client<br/>Cloud Firestore"]
    Mem --> Seed["Auto-seed on first access<br/>12 services + 3 apps + 3 notifs"]
    Firestore --> SeedFS["Auto-seed if collection empty<br/>Batch write all seed data"]
```

---

## API Reference

### Base URL: `http://localhost:4000`

### Standard Response Envelope

```json
{
  "success": true,
  "data": "<T>",
  "error": null,
  "meta": { "total": 12 }
}
```

### Endpoint Map

```mermaid
graph LR
    subgraph Services["Service Endpoints"]
        S1["GET /api/services<br/>?category=&search=&popular="]
        S2["GET /api/services/:slug"]
    end

    subgraph Applications["Application Endpoints"]
        A1["GET /api/applications<br/>?citizenId="]
        A2["GET /api/applications/track/:id"]
        A3["POST /api/applications"]
    end

    subgraph Dashboard["Dashboard"]
        D1["GET /api/dashboard<br/>?citizenId="]
    end

    subgraph Grievances["Grievance Endpoints"]
        G1["POST /api/grievances"]
        G2["GET /api/grievances/track/:id"]
    end

    subgraph Portal["Portal Content (10 endpoints)"]
        P1["GET /api/portal/config"]
        P2["GET /api/portal/notices"]
        P3["GET /api/portal/helplines"]
        P4["GET /api/portal/policies"]
        P5["GET /api/portal/faqs"]
        P6["GET /api/portal/privacy"]
        P7["GET /api/portal/terms"]
        P8["GET /api/portal/directory-nav"]
        P9["GET /api/portal/footer-links"]
        P10["GET /api/portal/grievance-categories"]
    end

    subgraph Health["Health"]
        H1["GET /api/health"]
    end
```

### Detailed Endpoints

| Method | Path | Query Params | Request Body | Response |
|--------|------|-------------|--------------|----------|
| `GET` | `/` | — | — | Server info + docs URL |
| `GET` | `/api/health` | — | — | `{ status, timestamp, storage, environment, version }` |
| `POST` | `/api/auth/register` | — | `RegisterUserPayload` | `Citizen` (201) |
| `GET` | `/api/services` | `category?`, `search?`, `onlineOnly?`, `popular?` | — | `Service[]` + `meta.total` |
| `GET` | `/api/services/:slug` | — | — | `Service` |
| `GET` | `/api/applications` | `citizenId?` | — | `Application[]` + `meta.total` |
| `GET` | `/api/applications/track/:id` | — | — | `Application` |
| `POST` | `/api/applications` | — | `CreateApplicationPayload` | `Application` (201) |
| `GET` | `/api/dashboard` | `citizenId?` | — | `DashboardData` |
| `POST` | `/api/grievances` | — | `GrievancePayload` | `GrievanceRecord` (201) |
| `GET` | `/api/grievances/track/:id` | — | — | `GrievanceRecord` |
| `GET` | `/api/portal/config` | — | — | Portal config object |
| `GET` | `/api/portal/notices` | — | — | `Notice[]` |
| `GET` | `/api/portal/helplines` | — | — | `{ emergency: [], other: [] }` |
| `GET` | `/api/portal/policies` | — | — | `Policy[]` |
| `GET` | `/api/portal/faqs` | — | — | `Faq[]` |

---

## Authentication & Security

### Current State

```mermaid
graph TD
    Firebase["Firebase Authentication<br/>email + password"] -->|"ID token"| Auth["FastAPI auth dependency"]
    Auth -->|"POST /api/auth/register"| Citizen["citizens/{uid}"]
    Auth -->|"Bearer token required"| Protected["Applications · dashboard<br/>tracking · grievances"]
    Auth -->|"Rate limiting"| RL["300 req/min/IP"]
    Auth -->|"CORS"| CORS["localhost:3000 only"]
```

| Layer | Protection | Notes |
|-------|-----------|-------|
| CORS | Origin whitelist | `http://localhost:3000` |
| Authentication | Firebase ID token | Backend verifies the token and registers the citizen by Firebase UID |
| Rate Limiting | 300 req/min per IP | In-memory, resets on restart |
| Input Validation | Pydantic models | Auto-validated by FastAPI |
| Firestore Rules | citizenId ownership | Client reads own data only |
| Backend Writes | Admin SDK only | All writes go through API |

### Remaining Production Security Requirements

- [x] Firebase Authentication (email/password)
- [x] JWT token validation middleware
- [ ] Environment-based CORS (not hardcoded)
- [ ] HTTPS enforcement
- [ ] Secrets in environment variables only
- [ ] Firestore rules enforce auth.uid matching

---

## Data Flow Diagrams

### Application Submission Flow

```mermaid
sequenceDiagram
    actor Citizen
    participant FE as Frontend (Next.js)
    participant BE as Backend (FastAPI)
    participant DB as Firestore

    Citizen->>FE: Fill personal info + service form
    FE->>FE: Validate inputs client-side
    Citizen->>FE: Enter OTP (123456)
    FE->>FE: Validate OTP

    alt OTP valid
        FE->>BE: POST /api/applications<br/>{ serviceId, citizenId, formData }
        BE->>BE: Validate with Pydantic
        BE->>DB: Set doc: applications/{appId}
        DB-->>BE: Write success
        BE-->>FE: { success: true, data: Application }
        FE-->>Citizen: Show confirmation + reference ID
    else OTP invalid
        FE-->>Citizen: Show error "Invalid OTP"
    end
```

### Service Catalog Load Flow

```mermaid
sequenceDiagram
    actor Citizen
    participant FE as Frontend
    participant ISR as Next.js ISR Cache
    participant BE as Backend
    participant DB as Firestore / Memory

    Citizen->>FE: Navigate to /services
    FE->>ISR: Check cache (60s revalidate)

    alt Cache hit
        ISR-->>FE: Cached response
    else Cache miss
        FE->>BE: GET /api/services?category=education_skills
        BE->>DB: Query services collection
        DB-->>BE: [Service, Service, ...]
        BE-->>FE: { data: [...], meta: { total: N } }
        FE->>ISR: Store in cache
    end

    FE-->>Citizen: Render service cards
```

### Grievance Submission Flow

```mermaid
sequenceDiagram
    actor Citizen
    participant FE as Frontend
    participant BE as Backend
    participant Store as In-Memory Store

    Citizen->>FE: Fill grievance form (category, subject, description)
    FE->>FE: Validate: description min 20 chars
    FE->>BE: POST /api/grievances<br/>{ category, subject, description, name, email, phone }
    BE->>BE: Validate with Pydantic (description.length >= 20)
    BE->>Store: Append to grievances list
    Store-->>BE: GrievanceRecord with auto-ID
    BE-->>FE: { success: true, data: GrievanceRecord }
    FE-->>Citizen: Show confirmation with grievance ID

    Citizen->>FE: Enter grievance ID to track
    FE->>BE: GET /api/grievances/track/:id
    BE->>Store: Find by ID
    Store-->>BE: GrievanceRecord
    BE-->>FE: { data: GrievanceRecord }
    FE-->>Citizen: Show grievance status
```

### Dashboard Load Flow

```mermaid
sequenceDiagram
    actor Citizen
    participant FE as Frontend
    participant BE as Backend
    participant DB as Firestore / Memory

    Citizen->>FE: Navigate to /dashboard
    FE->>BE: GET /api/dashboard?citizenId=demo-citizen-001
    BE->>DB: Parallel queries:<br/>1. Get citizen<br/>2. Get applications<br/>3. Get notifications<br/>4. Get drafts
    DB-->>BE: citizen + applications + notifications + drafts
    BE->>BE: Assemble DashboardData<br/>count unread notifications
    BE-->>FE: { data: { citizen, applications, notifications, drafts, unreadCount } }
    FE-->>Citizen: Render dashboard with stats, app list, notifications
```

---

## Deployment Architecture

```mermaid
graph TB
    subgraph Production["Production Environment"]
        CDN["Firebase Hosting / Vercel<br/>Frontend CDN"]
        CloudRun["Cloud Run / Functions<br/>Backend (min instances)"]
        Firestore["Cloud Firestore<br/>Multi-region"]
    end

    subgraph CI["CI/CD"]
        GitHub["GitHub Actions"]
        BuildFE["Build frontend<br/>npm run build"]
        BuildBE["Build backend<br/>pip install"]
    end

    subgraph Local["Local Development"]
        DevFE["Frontend :3000<br/>npm run dev"]
        DevBE["Backend :4000<br/>uvicorn --reload"]
        DevFS["Firestore Emulator<br/>or In-Memory"]
    end

    GitHub -->|"push to main"| BuildFE
    GitHub -->|"push to main"| BuildBE
    BuildFE --> CDN
    BuildBE --> CloudRun
    CloudRun --> Firestore
    DevFE --> DevBE
    DevBE --> DevFS
```

### Ports

| Service | Local | Production |
|---------|-------|-----------|
| Frontend | `localhost:3000` | CDN domain |
| Backend API | `localhost:4000` | Cloud Run URL |
| Firestore | Emulator or memory | Google-managed |
| API Docs | `localhost:4000/docs` | Internal only |

### Startup Commands

```bash
# Start both frontend + backend
npm run dev

# Start individually
npm run dev:frontend    # Next.js on :3000
npm run dev:backend     # FastAPI on :4000

# Seed Firestore
npm run seed

# Build for production
npm run build
```

---

## Demo Credentials

| Item | Value |
|------|-------|
| Citizen ID | `demo-citizen-001` |
| OTP | `123456` |
| Track IDs | `RES-2026-8842`, `VEH-2026-1190`, `INC-2026-0001` |
| Services in catalog | 12 |
| Categories | 4 (identity_civil, education_skills, health_welfare, business_trade) |

---

## Compliance

- All PII is synthetic (`@example.com`, `demo-citizen-001`)
- Visible prototype disclaimer banner on every page
- No calls to live `.gov.in` endpoints
- OTP is hardcoded demo value: `123456`
- Rate limiting prevents abuse
- No production secrets committed
