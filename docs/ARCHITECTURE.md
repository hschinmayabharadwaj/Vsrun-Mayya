# Citizen Services Portal — Architecture

This project separates **frontend** (citizen UI) from **backend** (API + data) so each layer can scale independently — the pattern used by high-traffic government digital platforms.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CITIZEN (Browser / Mobile)                │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTPS
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND  (frontend/)                                           │
│  Next.js 15 · Stitch/Figma design · Static + SSR where useful   │
│  Port: 3000                                                      │
│  • Home, Services, Dashboard, Apply wizard, Track by ID          │
│  • No direct database access — only REST calls to backend        │
└───────────────────────────────┬─────────────────────────────────┘
                                │ REST JSON (NEXT_PUBLIC_API_URL)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  BACKEND  (backend/)                                             │
│  FastAPI · Stateless API · Rate limiting · CORS · OpenAPI docs  │
│  Port: 4000                                                      │
│  • /api/services      — service catalog (read-heavy, cacheable)  │
│  • /api/applications  — submit & track applications              │
│  • /api/dashboard     — citizen dashboard aggregate              │
│  • /api/health        — health check for load balancers          │
└───────────────────────────────┬─────────────────────────────────┘
                                │ Firebase Admin SDK
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  DATABASE  (Firebase Firestore)                                  │
│  • Auto-scaling · Multi-region · Real-time capable               │
│  Collections: services, applications, notifications, drafts    │
│  Security rules: read-only from client; writes via backend only  │
└─────────────────────────────────────────────────────────────────┘
```

## Why separate frontend and backend?

| Concern | Frontend | Backend |
|---------|----------|---------|
| **Scaling** | CDN + edge (Vercel/Firebase Hosting) serves static assets globally | Horizontal pod autoscaling behind load balancer |
| **Traffic spikes** | Cached pages & ISR for catalog | Stateless API instances; Firestore handles concurrent writes |
| **Security** | No secrets; prototype disclaimer | Service account keys; validation; rate limits |
| **Team ownership** | UX, accessibility, Stitch design | Domain logic, integrations, compliance |

## Data model (Firestore)

| Collection | Purpose | Example document |
|------------|---------|------------------|
| `services` | Read-only catalog | Income Certificate, Birth Certificate |
| `applications` | Citizen submissions + status machine | `RES-2026-8842` |
| `notifications` | Status alerts | "Additional docs required" |
| `drafts` | Incomplete applications | Business License 40% complete |

### Application status flow

```
draft → submitted → under_review → verified → approved
                                              ↘ rejected
```

## Scalability design (millions of requests)

1. **Stateless API** — No session stored in memory; any instance can serve any request.
2. **Firestore** — Google-managed, automatically scales reads/writes; composite indexes for citizen queries.
3. **Rate limiting** — 300 req/min/IP on API (configurable); protects against abuse during spikes.
4. **Read-heavy caching** — Service catalog is immutable between deploys; CDN cache `GET /api/services` (60s revalidate on frontend).
5. **Production path** — Frontend on Firebase Hosting / Vercel CDN; Backend on Cloud Run or Firebase Functions with min instances; Firestore multi-region.

## Local development

```bash
# Terminal 1 — Backend (FastAPI, in-memory fallback if Firebase not configured)
cd backend && pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 4000

# Terminal 2 — Frontend
cd frontend && npm install && cp .env.local.example .env.local && npm run dev
```

Open http://localhost:3000

### Connect real Firebase

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore
3. Generate service account key → save as `backend/serviceAccountKey.json`
4. Set in `backend/.env`:
   ```
   USE_MOCK_DB=false
   FIREBASE_PROJECT_ID=your-project-id
   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
   ```
5. Seed data: `cd backend && python -m scripts.seed`
6. Deploy rules: `cd firebase && npx firebase deploy --only firestore:rules`

## API reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health + storage mode |
| GET | `/api/services` | List services (`?category=`, `?search=`, `?popular=true`) |
| GET | `/api/services/:slug` | Single service |
| GET | `/api/applications` | List applications for demo citizen |
| GET | `/api/applications/track/:id` | Track by reference ID |
| POST | `/api/applications` | Submit new application |
| GET | `/api/dashboard` | Dashboard aggregate |

## Compliance (hackathon playbook)

- All PII is synthetic (`DEMO-XXXX`, `@example.com`)
- Visible prototype disclaimer in UI
- No calls to live `.gov.in` endpoints
- OTP is hardcoded demo value: `123456`

## Demo credentials

- **Citizen:** Demo Citizen (`demo-citizen-001`)
- **OTP:** `123456`
- **Track IDs:** `RES-2026-8842`, `VEH-2026-1190`, `INC-2026-0001`
