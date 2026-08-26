# Vsrun-Mayya / Citizen Services Portal

A **separate frontend + backend** citizen services platform built from [Stitch/Figma screens](stitch_citizen_services_portal/) and the [Public Service Hackathon playbook](public_service_hackathon_playbook.md).

Government-grade trust and structure — faster, cleaner, and architected to scale.

## Built with Codex

The interface and application workflow in this repository were developed and refined with Codex. The standalone `Index (1).html` file is retained as the visual reference used for the civic portal refresh.

## Citizen authentication and Railway deployment

Citizen sign-in uses Firebase Authentication. Enable the Email/Password provider in Firebase Console, copy the Firebase web-app configuration into `frontend/.env.local`, and set `USE_MOCK_DB=false` plus `FIREBASE_PROJECT_ID` for the backend. Authenticated requests send Firebase ID tokens to FastAPI, which verifies them with Firebase Admin SDK before allowing applications, dashboard access, tracking, or grievance submission.

The backend includes `backend/Dockerfile`, `backend/railway.json`, and `backend/.dockerignore` for Railway. In Railway, create a service from this repository, set the service Root Directory to `/backend`, add the backend variables in the Variables tab, and deploy. Set `NEXT_PUBLIC_API_URL` to the generated Railway URL in the frontend environment and set the backend `CORS_ORIGIN` to the deployed frontend origin. Railway should receive the Firebase service-account JSON as the sealed `FIREBASE_SERVICE_ACCOUNT_JSON` variable; do not commit the JSON key.

## Architecture

```mermaid
graph TB
    subgraph Citizen["Citizen"]
        Browser["Browser / Mobile"]
    end

    subgraph Frontend["Frontend — Next.js 15 (port 3000)"]
        AppRouter["App Router"]
        Components["Components<br/>Header · Cards · Timeline · Forms"]
        APIClient["API Client<br/>lib/api.ts → fetch(:4000)"]
        Theme["3 Switchable Themes<br/>lib/theme.ts"]
    end

    subgraph Backend["Backend — FastAPI (port 4000)"]
        FastAPI["FastAPI App<br/>CORS · Rate Limiting · Validation"]
        Routers["Routers<br/>auth · services · applications · dashboard<br/>grievances · portal · health"]
        DataStore["DataStore<br/>Dual-mode: Memory / Firestore"]
    end

    subgraph Database["Storage"]
        Firestore["Cloud Firestore<br/>citizens · services · applications<br/>notifications · drafts"]
        Memory["In-Memory Store<br/>(default, no setup needed)"]
    end

    Browser -->|"HTTP"| AppRouter
    AppRouter --> Components
    Components --> APIClient
    APIClient -->|"REST JSON"| FastAPI
    FastAPI --> Routers
    Routers --> DataStore
    DataStore -->|"USE_MOCK_DB=false"| Firestore
    DataStore -->|"USE_MOCK_DB=true"| Memory
```

| Layer | Tech | Port | Role |
|-------|------|------|------|
| **Frontend** | Next.js 15, React 19, Tailwind CSS, Lucide Icons, Framer Motion | 3000 | Citizen UI — home, services, apply, track, dashboard, grievance |
| **Backend** | FastAPI (Python), Pydantic, Firebase Admin SDK | 4000 | REST API — validation, rate limiting (300 req/min), data access |
| **Database** | Firebase Firestore (or in-memory fallback) | — | 5 collections: citizens, services, applications, notifications, drafts |
| **Shared** | TypeScript types (`shared/types.ts`) | — | Type contract between frontend & backend |

### Application Status Flow

```mermaid
stateDiagram-v2
    [*] --> draft
    draft --> submitted: Citizen submits
    submitted --> under_review: Officer reviews
    under_review --> verified: Docs verified
    verified --> approved: Approved
    verified --> rejected: Rejected
```

### Key Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/services` | List/filter services |
| `POST` | `/api/applications` | Submit application |
| `GET` | `/api/applications/track/:id` | Track by reference ID |
| `GET` | `/api/dashboard` | Citizen dashboard |
| `POST` | `/api/auth/register` | Register/update the authenticated citizen profile |
| `POST` | `/api/grievances` | File grievance |
| `GET` | `/api/portal/*` | Portal content (10 endpoints) |

See **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** for full diagrams, API reference, and scaling notes.

## Quick start

```bash
# Install dependencies (frontend + Python backend)
npm run install:all

# Run both frontend and backend
npm run dev
```

- **Frontend:** http://localhost:3000  
- **Backend API:** http://localhost:4000  
- **API Docs (Swagger):** http://localhost:4000/docs  

Works out of the box with **in-memory storage**. Connect Firebase for persistent data (see Architecture doc).

## Project structure

```
frontend/          Next.js UI — Stitch design system (Home, Services, Dashboard, Apply, Track)
backend/           FastAPI REST API — Firebase Admin, rate limiting, Pydantic validation
firebase/          Firestore rules & indexes
shared/            TypeScript types (frontend reference)
docs/              Architecture & deployment guides
stitch_citizen_services_portal/   Original Figma/Stitch HTML exports (design reference)
```

## Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 4000
```

## Demo credentials

| Item | Value |
|------|-------|
| OTP | `123456` |
| Track IDs | `RES-2026-8842`, `VEH-2026-1190`, `INC-2026-0001` |

## Firebase / Firestore setup

```bash
cd backend
cp .env.example .env
# Set USE_MOCK_DB=false, FIREBASE_PROJECT_ID, and Firebase Admin credentials
python -m scripts.seed
```

From the repository root, select the Firebase project once and deploy the rules and
indexes:

```bash
firebase use --add
firebase deploy --only firestore
```

The canonical deployment files are `firestore.rules`, `firestore.indexes.json`, and
`firebase.json` at the repository root. The mirrored files under `firebase/` are kept
for compatibility with the earlier folder-based setup. Never commit a Firebase Admin
service-account JSON key; Railway should receive it through the sealed
`FIREBASE_SERVICE_ACCOUNT_JSON` variable.

---

**Prototype / Demo — Not an official Government platform**
