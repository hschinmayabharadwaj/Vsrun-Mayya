---
title: Citizen Services Portal Backend
emoji: 🏛️
colorFrom: blue
colorTo: green
sdk: gradio
sdk_version: 4.26.0
app_file: gradio_app.py
pinned: false
---

# Citizen Services Portal Backend

Government-grade citizen services platform backend running on Hugging Face Spaces.

## Features

- **Services**: Browse and apply for government services
- **Applications**: Submit and track application status
- **Grievances**: File and track complaints
- **Dashboard**: View application history and status

## Architecture

- **Frontend**: Deployed on Vercel (Next.js)
- **Backend**: This Gradio app on HF Spaces
- **Database**: Firebase or in-memory (demo mode)

## API Base URL

```
https://your-username-citizen-services.hf.space/api
```

## Environment Variables

Set these in HF Spaces Settings > Secrets:

```
USE_MOCK_DB=true
CORS_ORIGIN=https://your-vercel-frontend.vercel.app
```

## Local Development

```bash
pip install -r requirements_gradio.txt
python gradio_app.py
```

Visit `http://localhost:7860`

## Deployment Steps

1. Create a new HF Space (Gradio SDK)
2. Clone the space
3. Copy backend files
4. Update `.env` with your settings
5. Push to HF
6. HF auto-launches the Gradio app

## Integration with Frontend

The Vercel frontend connects to this backend API:

```javascript
const API_URL = 'https://your-username-citizen-services.hf.space/api'
```

All requests from frontend go through this URL.
