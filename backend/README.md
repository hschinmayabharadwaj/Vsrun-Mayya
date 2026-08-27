# Citizen Services Backend (FastAPI)

Python REST API for the Citizen Services Portal.

## Setup

```bash
cd backend
py -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
cp .env.aexample .env
```

## Run

```bash
py -m uvicorn app.main:app --reload --host 0.0.0.0 --port 4000
```

- API: http://localhost:4000  
- Swagger docs: http://localhost:4000/docs  
- ReDoc: http://localhost:4000/redoc  

## Seed Firestore

```bash
# Set USE_MOCK_DB=false and configure Firebase in .env first
py -m scripts.seed
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/services` | List services |
| GET | `/api/services/{slug}` | Get service by slug |
| GET | `/api/applications` | List applications |
| GET | `/api/applications/track/{id}` | Track by reference ID |
| POST | `/api/applications` | Submit application |
| GET | `/api/dashboard` | Citizen dashboard |
| POST | `/api/auth/register` | Register/update the authenticated citizen profile |

## Storage modes

- **Memory** (default): `USE_MOCK_DB=true` — no Firebase needed for local demo
- **Firestore**: `USE_MOCK_DB=false` + service account credentials
