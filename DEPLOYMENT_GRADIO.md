# Deployment Guide: Vercel + Hugging Face (Gradio - FREE)

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (free at vercel.com)
- GitHub account

### Steps

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select the `frontend` directory as root
   - Add environment variables:
     - `NEXT_PUBLIC_API_URL`: `https://your-username-citizen-services.hf.space/api`
     - Firebase variables (optional)
   - Click Deploy
   - You get: `https://your-app.vercel.app`

---

## Backend Deployment (Hugging Face Spaces + Gradio) ✨ FREE

### Prerequisites
- Hugging Face account (free at huggingface.co)
- NO Docker required!

### Steps

1. **Create a Hugging Face Space**
   - Go to https://huggingface.co/new-space
   - Fill in:
     - **Space name**: `citizen-services-backend`
     - **License**: `OpenRAIL`
     - **Space SDK**: `Gradio` ← This is free!
   - Click **Create Space**

2. **Push Backend Code to HF**
   ```bash
   # Clone the HF space
   git clone https://huggingface.co/spaces/YOUR_USERNAME/citizen-services-backend
   cd citizen-services-backend

   # Copy backend files
   cp -r ../../varun-mayya/backend/* .

   # Create .gitignore for HF
   echo "*.pyc
   __pycache__/
   .env
   .venv/
   venv/" > .gitignore

   # Copy the correct requirements
   cp requirements_gradio.txt requirements.txt

   # Copy Gradio app as main file
   cp gradio_app.py app.py

   # Create README (HF auto-uses this)
   cat > README.md << 'EOF'
   ---
   title: Citizen Services Portal Backend
   emoji: 🏛️
   colorFrom: blue
   colorTo: green
   sdk: gradio
   sdk_version: 4.26.0
   app_file: app.py
   pinned: false
   ---

   # Citizen Services Portal Backend
   
   Free government citizen services backend running on Hugging Face Spaces.
   EOF

   # Commit and push
   git add .
   git commit -m "Deploy backend using Gradio"
   git push
   ```

3. **Wait for Deployment**
   - HF Spaces auto-detects Gradio
   - Builds and launches automatically
   - Takes ~2-5 minutes

4. **Get Your URL**
   - Your backend URL: `https://YOUR_USERNAME-citizen-services-backend.hf.space`
   - Gradio interface at: `https://YOUR_USERNAME-citizen-services-backend.hf.space` (for testing)
   - API at: `https://YOUR_USERNAME-citizen-services-backend.hf.space/api`

---

## Connect Frontend to Backend

After both are deployed:

1. **Update Vercel Environment**
   - Go to Vercel Dashboard
   - Select your project
   - Settings > Environment Variables
   - Update `NEXT_PUBLIC_API_URL`:
     ```
     https://YOUR_USERNAME-citizen-services-backend.hf.space/api
     ```
   - Save & Redeploy

2. **Update HF Spaces Environment (Optional)**
   - HF Spaces Settings > Secrets
   - Add:
     ```
     CORS_ORIGIN=https://your-app.vercel.app
     USE_MOCK_DB=true
     ```

---

## Test Everything Works

1. **Visit Frontend**: `https://your-app.vercel.app`
2. **Try a Service**: Browse services (should fetch from HF backend)
3. **Check Console**: Look for any CORS or API errors
4. **Test API Directly**:
   ```bash
   curl https://YOUR_USERNAME-citizen-services-backend.hf.space/api/services
   ```

---

## Architecture Diagram

```
┌─────────────────────────────────────┐
│  Vercel (Frontend)                  │
│  https://your-app.vercel.app        │
│                                     │
│  Next.js 15 + React 19              │
└─────────────┬───────────────────────┘
              │ HTTP REST API
              │ NEXT_PUBLIC_API_URL
              ▼
┌─────────────────────────────────────┐
│  HF Spaces (Backend)                │
│  https://username-citizen-svc.hf... │
│                                     │
│  FastAPI + Gradio (FREE)            │
│  USE_MOCK_DB=true                   │
└─────────────────────────────────────┘
```

---

## Cost Breakdown

| Service | Plan | Cost | Storage |
|---------|------|------|---------|
| **Vercel Frontend** | Free | $0 | 100GB bandwidth/mo |
| **HF Spaces Backend** | Free | $0 | 20GB ephemeral |
| **Total** | | **$0** | Enough for demo |

**Upgrade options if needed:**
- Vercel: ~$20/mo for more bandwidth
- HF Spaces: ~$7.50/mo for persistent storage

---

## Gradio vs Docker

| | Gradio | Docker |
|---|--------|--------|
| Setup | 2 minutes | Requires Docker ($) |
| Free Tier | ✅ Yes | ❌ Paid |
| GUI Interface | ✅ Built-in | ❌ Manual |
| API Support | ✅ Yes | ✅ Yes |
| Best for | Demos, MVPs | Production |

---

## Monitoring & Logs

**Vercel:**
- Dashboard > Deployments > View logs
- Real-time error tracking
- Performance metrics

**HF Spaces:**
- Space page > Logs tab
- Shows startup and runtime errors
- Restart button if needed

---

## Troubleshooting

### CORS Errors
```
Error: Access to XMLHttpRequest blocked by CORS policy
```
**Fix:**
- Update `CORS_ORIGIN` in HF Spaces secrets
- Restart the space
- Redeploy frontend

### API Not Found (404)
```
GET https://...hf.space/api/services 404
```
**Fix:**
- Verify HF Space URL includes `/api`
- Check `NEXT_PUBLIC_API_URL` in Vercel
- Test API directly: `curl https://...hf.space/api/health`

### Space Won't Start
```
Error building space
```
**Fix:**
- Check `README.md` has correct `app_file: app.py`
- Verify `requirements.txt` exists
- Push to HF again: `git push`

### Port Issues
- Gradio auto-uses port 7860 on HF
- Can't change on free tier
- Frontend just uses the public URL

---

## Files You Need

**Frontend:**
- `vercel.json` ✅ Created
- `app.json` ✅ Created

**Backend:**
- `gradio_app.py` ✅ Created (renamed to `app.py` on HF)
- `requirements_gradio.txt` ✅ Created (rename to `requirements.txt`)
- `GRADIO_README.md` ✅ Created (use as HF README.md)

---

## Next Steps

1. ✅ Create HF Space (Gradio SDK)
2. ✅ Push backend code
3. ✅ Deploy on Vercel
4. ✅ Update Vercel env with HF URL
5. ✅ Test frontend → backend connection
6. ✅ Share your live URLs!

**Your Live URLs will be:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-username-citizen-services-backend.hf.space`
- API: `https://your-username-citizen-services-backend.hf.space/api`
