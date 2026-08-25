# Public Service Hackathon — Builder's Execution Playbook

*A mentor framework for the "10 Official Platforms" digital innovation challenge.*

This playbook doesn't pick your problem or write your build for you — it gives you the methodology, templates, and checklists to do that well, and to self-assess against the judging bar at every stage.

---

## 1. Project Ideation Framework

### The 5-Step Ideation Sprint

**Step 1 — Divergent Scan (30–45 min)**
Across all 10 platforms, rapid-list every friction point you know or suspect, without filtering yet. Use this grid:

| Platform | Persona affected | Suspected pain point | Where you'd verify it |
|---|---|---|---|
| | | | |

Aim for 15–20 rows before moving on. Quantity over judgment at this stage.

**Step 2 — Evidence Gathering (1–2 hrs)**
A real problem needs a receipt, not a hunch. Best sources for this specific context:
- Play Store / App Store reviews for the official app — filter to 1–2 stars. Highest density of real complaints you'll find anywhere.
- CPGRAMS' own published grievance category data / annual reports — it tracks which departments and grievance types are most common.
- News search: "[platform name] down," "[platform name] complaint," "[platform name] glitch."
- X/Twitter and Reddit (r/india, r/developersIndia, r/IndiaSpeaks) — search platform name + "not working" / "stuck" / "pending."
- RTI filing patterns — if people file RTIs just to ask "why is my application still pending," that's itself a signal of a broken status-visibility problem.
- One real conversation — a 10-minute call with a non-tech-savvy relative attempting the actual flow is often your highest-signal research in a hackathon timeframe.

**Step 3 — Convergent Scoring**
Score each surviving candidate 1–5 on each axis:

| Problem candidate | Reach | Severity | Vulnerability* | Evidence strength | Feasibility | Demo-ability | Total |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

*Vulnerability = does this disproportionately hurt low-literacy, elderly, rural, or low-income users — the group public digital services most often fail. Weight this axis highly; it's usually what separates a "nice UX fix" from a genuinely important public-service problem.

**Step 4 — Problem Statement Formula**
> "[Specific user] struggles to [specific task] on [platform] because [root cause], which results in [concrete consequence]."

A strong statement names a person, not "citizens" in general — and a moment, not a whole platform.

**Step 5 — The "So What" Gut Check**
Before you lock in, pressure-test with three questions:
1. If I fixed nothing else about this platform, would fixing just this change someone's week?
2. Could I explain why this matters to a non-technical relative in one sentence?
3. Is this actually a product/UX problem — or a policy/legal problem no interface can fix? Good hackathon problems are the ones where design is genuinely the lever.

---

## 2. UX/UI Strategy for Accessibility

### Pillar A — Design for Real Indian Bandwidth
- Target usability on a throttled "Slow 3G" profile — test this in Chrome DevTools, don't assume office Wi-Fi.
- Compress and lazy-load; avoid heavy JS bundles for a hackathon MVP.
- Design explicit loading, offline, and retry states — a blank spinner reads as "broken," not "loading."
- Use optimistic UI for form submissions so a flaky connection doesn't look like data loss.

### Pillar B — Mobile-First, Not Mobile-Adapted
- Design the core flow at ~360–400px width first, then scale up.
- Primary actions live in the thumb zone (bottom third of screen).
- Minimum 44×44px tap targets.
- No hover-dependent interactions, no dense multi-column layouts.

### Pillar C — Design for Varying Digital Literacy
- Plain language over bureaucratic terms ("Check status," not "Query Application Reference Status").
- Icon + text together — never icon-only navigation for primary actions.
- Linear, guided (wizard-style) flows for anything with multiple fields, instead of one dense form.
- Specific, actionable error messages ("This OTP expired — tap to resend" beats "Error 403").
- Consider a language toggle (Hindi + English at minimum) — even a partial implementation signals the right instinct to judges.

### Pillar D — Build Trust, Not Suspicion
- Trust *is* a UX problem here: citizens are, rightly, wary of fraudulent government-lookalike apps.
- Since this is a prototype, say so — a visible "Prototype / Demo — not an official Government of India platform" disclaimer builds credibility with judges and satisfies the honesty criterion.
- You can reference real conventions (e.g., the Government of India's GIGW web guidelines) for structure and tone, but never reproduce an official seal, domain, or branding in a way that could be mistaken for the real thing.

### Pillar E — Inclusive by Default
- WCAG AA contrast (4.5:1 for body text).
- Semantic HTML / ARIA labels so a screen reader can navigate your prototype.
- Full core flow completable by keyboard alone.
- Never rely on color alone for status — pair a red dot with the word "Rejected."

**Quick checklist**
- [ ] Tested on throttled network
- [ ] Tested at mobile width, not just a resized desktop window
- [ ] Every label in plain language, no unexplained jargon
- [ ] Error states designed, not just the happy path
- [ ] Prototype disclaimer visible somewhere in the UI
- [ ] Passes a basic contrast check

---

## 3. Technical Architecture & Mocking Strategy

### 3.1 A reference architecture worth showing
Even a lightweight hackathon build should be describable in layers:

```
[Mobile-first UI]
        |
        v
[API layer — mocked REST endpoints]
        |
        v
+----------------+-------------------+------------------+
|  Auth service  |  Core domain      |  Notification    |
|  (mock OTP /   |  service          |  service (mock   |
|  eKYC stub)    |  (application /   |  SMS / email)    |
|                |  case state       |                  |
|                |  machine)         |                  |
+----------------+-------------------+------------------+
        |
        v
[Seeded synthetic database — fake users, fake records]
```

You don't need to fully build all of this — you need to be able to point to it in your technical explanation and show that at least one path through it actually works.

### 3.2 Synthetic Data Rules (non-negotiable)
- **Names**: clearly fictional, never real private individuals.
- **ID-shaped numbers** (Aadhaar/PAN/UAN/GSTIN-style): use formats that visibly fail real checksums, or label them plainly — e.g. `DEMO-XXXX-0000`.
- **Contact info**: `example.com` emails, obviously fake phone patterns.
- **Photos**: illustrated avatars or generic icons, never real identifiable people.
- **Reused fictional dataset**: seed ~10–20 fake "citizens" once, reuse them consistently for continuity across your demo.

### 3.3 Mocking External Systems

| What you'd integrate in production | How to mock it for the hackathon |
|---|---|
| Backend / database | Static JSON, `json-server`, or a free-tier Firebase/Supabase project seeded with fake data |
| OTP / SMS gateway | Hardcoded OTP shown in a visible "dev mode" banner |
| Payment gateway | A mock payment sheet with fake card numbers — never a live gateway |
| Government API (e.g. GSTN, UMANG lookup) | A stubbed endpoint returning realistic fake JSON — never a call to a real `.gov.in` endpoint |

### 3.4 Showing End-to-End Thinking Cheaply
- Implement at least one real state transition (e.g., *Submitted → Under Review → Approved*) with visible timestamps.
- Let a judge actually trigger one error/edge case in the live build (expired session, wrong OTP, no network) — don't just describe it in the video.
- If relevant, include a bare-bones "official side" view — it signals systems thinking beyond the citizen-facing screen.
- Be ready to name your core entities in one sentence (e.g., *User, Application, Status, Notification*) and how they relate.

### 3.5 Compliance Self-Check
- [ ] No real PII anywhere — data, screenshots, or testimonials
- [ ] No real credentials, no calls to live production `.gov.in` endpoints
- [ ] All fake data is identifiably fake on inspection
- [ ] A visible prototype/demo disclaimer in the UI
- [ ] No scraped copyrighted content presented as your own

---

## 4. Submission Optimization Plan

### 4.1 Storyboard — 2-Minute Video

| Time | Segment | Show | Say | Mentor note |
|---|---|---|---|---|
| 0:00–0:10 | Hook | A visual of the problem | The problem, in one punchy line | Lead with human stakes, not the platform's name |
| 0:10–0:20 | Context | Current painful flow, if possible | "Today, X users face Y" | Show, don't just tell |
| 0:20–0:50 | Core demo | Live click-through, one flow, start to finish | Narrate each screen's purpose | Don't jump between flows |
| 0:50–1:00 | Delight moment | Your strongest feature | "Here's what makes this different" | Your differentiation beat — make it count |
| 1:00–1:15 | Architecture | Simple diagram | Walk the layers (frontend / API / data) | Keep jargon light — non-engineers are judging too |
| 1:15–1:35 | Key decisions | Code or data model | Explain 1–2 deliberate choices, incl. what's mocked and why | This is where "honesty" gets scored |
| 1:35–1:50 | Accessibility & impact | A low-bandwidth or accessibility feature in action | "This works for X because Y" | Ties back to Section 2 |
| 1:50–2:00 | Close | Logo / team | One-sentence impact statement | End on "so what," not "thanks for watching" |

### 4.2 Project Summary (<250 words) Checklist

**Word budget**
- Problem — 40–50 words (who, what, why it matters, one evidence point)
- Solution — 80–100 words (what you built, core flow, plain language)
- Differentiation — 60–70 words (2–3 concrete contrasts with the status quo)
- Impact — 20–30 words (who benefits, at what scale)

**Checklist**
- [ ] A non-technical reader could explain your project back after one read
- [ ] Problem is stated before solution
- [ ] At least one concrete point of contrast with the existing platform
- [ ] No unexplained acronyms
- [ ] No overclaiming — every claim matches what's actually built
- [ ] Word count stated and under 250
- [ ] Read aloud once — bureaucratic phrasing is a red flag

### 4.3 Live Link & Mock Credentials Verification
- [ ] Loads cleanly in a fresh incognito window, not just your logged-in dev session
- [ ] Tested on an actual phone, not a resized browser
- [ ] Core flow still works on throttled "Slow 3G"
- [ ] Mock credentials written directly in the submission text, not buried in a README
- [ ] Every screen promised in your video actually exists in the live build
- [ ] Cold-start / sleep behavior on free hosting checked — flag it upfront if there's a delay
- [ ] Link won't expire before judging closes
- [ ] Tested in 2 browsers
- [ ] Backup screen recording ready in case the live link fails during review
- [ ] Someone outside your team completed the flow using only your written instructions

---

## 5. Judging Rubric Self-Assessment

Revisit this table at three checkpoints: right after you pick your problem, midway through the build, and right before you submit.

| Criterion | Idea-stage check | Mid-build check | Pre-submission check |
|---|---|---|---|
| **Problem** | Do I have real evidence this pain point matters? | Does the build still match the problem I scoped? | Would a stranger grasp why this matters in the video's first 10 seconds? |
| **Working Build** | — | Can I click through the core flow with no dead ends? | Tested fresh, incognito, mobile, throttled? |
| **Usability** | Have I named my target persona's literacy/access constraints? | Has anyone outside the team tried it unaided? | Are error/loading/empty states designed, not just the happy path? |
| **Product Thinking** | Have I deliberately scoped features OUT? | Am I still building the MVP, or feature-creeping? | Can I say clearly what I chose not to build, and why? |
| **End-to-End Thinking** | Have I sketched the full journey — data, states, edge cases — not just screens? | Does at least one real state transition or error case work live? | Does my technical explanation show a coherent system view? |
| **Honesty** | Am I committed to synthetic data only? | Is every mocked/simulated part clearly labeled in the build? | Does the video/summary avoid overclaiming anything not actually built? |

---

*Use Section 1 to lock your problem, Sections 2–3 while you build, and Sections 4–5 in the final 24 hours before submission.*
