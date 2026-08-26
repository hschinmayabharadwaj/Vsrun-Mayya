# Citizen Services Portal — Testing Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Backend API Testing](#backend-api-testing)
4. [Frontend Manual Testing](#frontend-manual-testing)
5. [End-to-End Flow Testing](#end-to-end-flow-testing)
6. [Mobile & Accessibility Testing](#mobile--accessibility-testing)
7. [Performance Testing](#performance-testing)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ | Frontend runtime |
| Python | 3.11+ | Backend runtime |
| pip | Latest | Python package manager |
| npm | 9+ | Node package manager |
| Browser | Chrome/Firefox/Safari | Manual testing |

---

## Environment Setup

### 1. Install all dependencies

```bash
# From project root
npm run install:all
```

This runs:
- `npm install --prefix frontend` (Node deps)
- `pip install -r backend/requirements.txt` (Python deps)

### 2. Configure environment

```bash
# Backend
cp backend/.env.example backend/.env
# Default: USE_MOCK_DB=true (in-memory, no Firebase needed)

# Frontend
cp frontend/.env.local.example frontend/.env.local 2>/dev/null || echo 'NEXT_PUBLIC_API_URL=http://localhost:4000' > frontend/.env.local
```

### 3. Start development servers

```bash
# Both frontend + backend
npm run dev

# Or separately:
npm run dev:frontend   # http://localhost:3000
npm run dev:backend    # http://localhost:4000
```

---

## Backend API Testing

### Health Check

```bash
curl http://localhost:4000/api/health
```

Expected response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-08-26T...",
    "storage": "memory",
    "environment": "development",
    "version": "1.0.0"
  }
}
```

### Test All Endpoints

```bash
# 1. Root info
curl http://localhost:4000/

# 2. Health
curl http://localhost:4000/api/health

# 3. List all services
curl http://localhost:4000/api/services

# 4. Filter services by category
curl "http://localhost:4000/api/services?category=education_skills"

# 5. Search services
curl "http://localhost:4000/api/services?search=certificate"

# 6. Get popular services
curl "http://localhost:4000/api/services?popular=true"

# 7. Get single service by slug
curl http://localhost:4000/api/services/birth-certificate

# 8. List applications
curl http://localhost:4000/api/applications

# 9. Track application by ID
curl http://localhost:4000/api/applications/track/RES-2026-8842

# 10. Submit new application
curl -X POST http://localhost:4000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "svc-birth-cert",
    "citizenId": "demo-citizen-001",
    "citizenName": "Demo Citizen",
    "formData": {"name": "Test User", "dob": "2000-01-01"}
  }'

# 11. Dashboard
curl http://localhost:4000/api/dashboard

# 12. Submit grievance
curl -X POST http://localhost:4000/api/grievances \
  -H "Content-Type: application/json" \
  -d '{
    "category": "service-delay",
    "subject": "Slow processing",
    "description": "My application has been pending for over 2 weeks and there has been no update on the portal.",
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+91 98765 43210"
  }'

# 13. Track grievance (use ID from step 12)
curl http://localhost:4000/api/grievances/track/GRIEV-001

# 14. Portal content endpoints
curl http://localhost:4000/api/portal/config
curl http://localhost:4000/api/portal/notices
curl http://localhost:4000/api/portal/helplines
curl http://localhost:4000/api/portal/policies
curl http://localhost:4000/api/portal/faqs
curl http://localhost:4000/api/portal/privacy
curl http://localhost:4000/api/portal/terms
curl http://localhost:4000/api/portal/directory-nav
curl http://localhost:4000/api/portal/footer-links
curl http://localhost:4000/api/portal/grievance-categories
```

### Interactive API Docs

Open http://localhost:4000/docs in your browser for Swagger UI.

### Rate Limiting Test

```bash
# Send 301+ requests rapidly (should trigger 429)
for i in {1..310}; do
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4000/api/health
done | sort | uniq -c
```

Expected: Most return `200`, last few return `429`.

### Validation Error Test

```bash
# Missing required fields
curl -X POST http://localhost:4000/api/applications \
  -H "Content-Type: application/json" \
  -d '{}'

# Short description for grievance (< 20 chars)
curl -X POST http://localhost:4000/api/grievances \
  -H "Content-Type: application/json" \
  -d '{"category":"test","subject":"t","description":"too short","name":"","email":"","phone":""}'
```

Expected: `400 Bad Request` with field-level error details.

---

## Frontend Manual Testing

### Page-by-Page Checklist

#### Home Page (`/`)
- [ ] Hero section renders with title + tagline
- [ ] Quick action cards (Services, Track, Helpline, Grievance) are clickable
- [ ] Stats section shows 4 stat cards
- [ ] "How it works" section renders
- [ ] Footer renders with links
- [ ] Prototype banner visible at top
- [ ] Logo visible in header

#### Services (`/services`)
- [ ] Service cards load from API
- [ ] Category filter tabs work
- [ ] Search filters services in real-time
- [ ] "Apply Now" button on each card navigates to `/apply/[slug]`
- [ ] Empty state shows when no results match search

#### Apply Form (`/apply/[slug]`)
- [ ] Service details load (name, description, required docs)
- [ ] Step 1: Personal info form validates name, email, phone
- [ ] Step 2: Address form validates address, city, pincode
- [ ] Step 3: Document upload UI renders (mock upload)
- [ ] Step 4: Declaration checkbox required
- [ ] Step 5: Review shows all entered data
- [ ] Back button works on every step
- [ ] Submit sends POST to `/api/applications`
- [ ] Confirmation shows reference ID

#### Generic Apply (`/apply`)
- [ ] Step 1: Personal info validates
- [ ] Step 2: Application type, title, description validates
- [ ] Step 3: OTP input (use `123456`)
- [ ] Step 4: Success confirmation shows
- [ ] Progress bar updates correctly

#### Track Application (`/track`)
- [ ] Input field accepts reference ID
- [ ] Submit triggers API call
- [ ] Error shows for invalid ID
- [ ] Application details render with timeline
- [ ] Status badge shows correct color

#### Status Page (`/status`)
- [ ] Applications load from `/api/status`
- [ ] Each card shows title, status badge, dates
- [ ] "New Application" button works
- [ ] Empty state shows when no applications

#### Dashboard (`/dashboard`)
- [ ] Stats cards show counts
- [ ] Applications list loads
- [ ] Notifications panel shows
- [ ] "View Details" links work

#### Grievance (`/grievance`)
- [ ] Category dropdown loads from API
- [ ] Form validates all fields
- [ ] Description enforces min 20 characters
- [ ] Submit sends POST to `/api/grievances`
- [ ] Confirmation shows grievance ID
- [ ] Track grievance form works

#### Helpline (`/helpline`)
- [ ] Emergency numbers section renders
- [ ] Other helplines section renders
- [ ] Phone numbers are clickable (`tel:` links)

#### Help (`/help`)
- [ ] FAQ accordion items expand/collapse
- [ ] Quick action cards link to correct pages

#### Info Pages (`/departments`, `/policies`, `/privacy`, `/terms`)
- [ ] Content loads from API
- [ ] Page renders without errors
- [ ] Back navigation works

#### 404 Page
- [ ] Navigate to `/nonexistent-page`
- [ ] 404 page renders with search + home link

---

## End-to-End Flow Testing

### Flow 1: Complete Application Submission

```mermaid
sequenceDiagram
    participant User as Tester
    participant FE as Frontend :3000
    participant BE as Backend :4000

    User->>FE: Navigate to /services
    FE->>BE: GET /api/services
    BE-->>FE: 12 services
    User->>FE: Click "Birth Certificate"
    FE->>BE: GET /api/services/birth-certificate
    BE-->>FE: Service details
    User->>FE: Click "Apply Now"
    FE->>FE: /apply/birth-certificate form
    User->>FE: Fill personal info + address
    User->>FE: Upload docs (mock)
    User->>FE: Accept declaration
    User->>FE: Review + Submit
    FE->>BE: POST /api/applications
    BE-->>FE: { id: "RES-2026-XXXX" }
    FE-->>User: Confirmation page with reference ID
    User->>FE: Copy reference ID
    User->>FE: Navigate to /track
    User->>FE: Paste reference ID + Search
    FE->>BE: GET /api/applications/track/{id}
    BE-->>FE: Application with timeline
    FE-->>User: Status displayed with timeline
```

**Steps:**
1. Go to http://localhost:3000/services
2. Click any service card → "Apply Now"
3. Fill all form steps (personal → address → documents → declaration → review)
4. Submit → note the reference ID
5. Go to http://localhost:3000/track
6. Enter the reference ID → search
7. Verify the application appears with correct status and timeline

### Flow 2: Grievance Submission & Tracking

1. Go to http://localhost:3000/grievance
2. Select a category from dropdown
3. Enter subject: `Test grievance`
4. Enter description (min 20 chars): `This is a test grievance submission to verify the flow works end to end`
5. Fill name, email, phone
6. Submit → note the grievance ID
7. Use the track form on the same page to search by grievance ID
8. Verify the grievance details appear

### Flow 3: Dashboard Overview

1. Go to http://localhost:3000/dashboard
2. Verify stats cards show numbers
3. Verify applications list shows 3 seed applications
4. Verify notifications panel shows entries
5. Click "View Details" on any application

---

## Mobile & Accessibility Testing

### Responsive Breakpoints

| Breakpoint | Width | Target |
|-----------|-------|--------|
| Mobile | 360px | Phones |
| Tablet | 768px | iPad, tablets |
| Desktop | 1024px+ | Laptops, monitors |

### Mobile Testing Checklist

```bash
# Open Chrome DevTools → Device Toolbar
# Test at these widths: 360px, 375px, 414px, 768px
```

- [ ] Header: hamburger menu appears on mobile
- [ ] Mobile menu opens/closes with animation
- [ ] All buttons are minimum 44px tap targets
- [ ] Forms are usable on small screens
- [ ] Service cards stack vertically
- [ ] No horizontal scrolling
- [ ] Text is readable without zooming
- [ ] Images scale properly

### Keyboard Navigation Testing

- [ ] Tab through all interactive elements
- [ ] Focus indicators visible (blue outline)
- [ ] Skip to main content link works
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals/menus
- [ ] Form fields are focusable in order

### Screen Reader Testing

- [ ] All images have alt text (or `aria-hidden` for decorative)
- [ ] Form inputs have associated labels
- [ ] Heading hierarchy is correct (h1 → h2 → h3)
- [ ] ARIA landmarks present (`<nav>`, `<main>`, `<footer>`)
- [ ] Status messages announced

---

## Performance Testing

### Lighthouse Audit

```bash
# Build production version
cd frontend && npm run build && npm run start

# Run Lighthouse in Chrome DevTools → Lighthouse tab
# Target scores:
#   Performance: 90+
#   Accessibility: 95+
#   Best Practices: 90+
#   SEO: 90+
```

### API Response Time

```bash
# Test API response times
for endpoint in /api/health /api/services /api/applications /api/dashboard /api/portal/config; do
  echo -n "$endpoint: "
  curl -s -o /dev/null -w "%{time_total}s\n" "http://localhost:4000$endpoint"
done
```

Target: All endpoints < 200ms in memory mode.

### Bundle Size Check

After build, check the build output:
- First Load JS shared by all: should be < 200 kB
- Individual page JS: should be < 50 kB per page

---

## Troubleshooting

### Port 3000 or 4000 already in use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <pid> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Turbopack picks up root files

If you see errors about root-level files (`instrumentation.ts`, `app/`):

```bash
# The fix is in frontend/next.config.js:
# turbopack: { root: path.join(__dirname) }
# This forces Turbopack to use frontend/ as workspace root

# Also ensure root lockfile doesn't interfere:
rm -rf frontend/.next && cd frontend && npm run dev
```

### Backend returns 500

```bash
# Check backend logs in the terminal running uvicorn
# Common causes:
# 1. Missing .env file → cp backend/.env.example backend/.env
# 2. Port conflict → change port in .env
# 3. Python dependency missing → pip install -r requirements.txt
```

### Frontend can't reach backend

```bash
# Verify backend is running
curl http://localhost:4000/api/health

# Check frontend .env.local
cat frontend/.env.local
# Should contain: NEXT_PUBLIC_API_URL=http://localhost:4000

# Check CORS: backend must allow localhost:3000
```

### Build fails with ESLint error

```
ESLint: Failed to load config "next/core-web-vitals"
```

This is a root `.eslintrc.json` issue. The root ESLint config references `next/core-web-vitals` but Next.js isn't installed at root. Safe to ignore — it doesn't affect the build output.

### Theme changes not visible

After editing `lib/theme.ts`:
1. Save the file
2. **Restart the dev server** (`Ctrl+C` then `npm run dev`)
3. Tailwind config changes require a full restart — hot reload won't pick them up

---

## Test Data Reference

### Seed Applications

| ID | Service | Status |
|----|---------|--------|
| `RES-2026-8842` | Income Certificate | under_review |
| `VEH-2026-1190` | Vehicle Registration | approved |
| `INC-2026-0001` | Birth Certificate | submitted |

### Demo Credentials

| Item | Value |
|------|-------|
| Citizen ID | `demo-citizen-001` |
| OTP | `123456` |
| Email | `demo.user@example.com` |

### Service Slugs (for `/apply/[slug]`)

| Slug | Service Name |
|------|-------------|
| `birth-certificate` | Birth Certificate |
| `income-certificate` | Income Certificate |
| `vehicle-registration` | Vehicle Registration |
| `driving-license` | Driving License |
| `passport` | Passport Application |
| `aadhaar-update` | Aadhaar Card Update |
| `pan-card` | PAN Card |
| `ration-card` | Ration Card |
| `scholarship` | Scholarship Application |
| `trade-license` | Trade License |
| `property-registration` | Property Registration |
| `death-certificate` | Death Certificate |
