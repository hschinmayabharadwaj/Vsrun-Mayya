# Project Description — Mayya Citizen Services Portal

**Mayya** is a modern citizen-services portal that reimagines how citizens interact with government online. Built for the Vsrun hackathon, it pairs a **Next.js frontend** with a **FastAPI backend** and delivers a fast, accessible, and trustworthy digital experience — solving the problems that make traditional government websites frustrating.

## What Makes It Better Than Existing Government Websites

- **Modern, human-first design — not legacy portals.** Most government sites are dense, dated, and hard to navigate. Mayya uses a clean, card-based interface with shared design tokens, smooth motion, and a responsive layout that works identically on desktop and mobile.
- **A chatbot that actually helps.** A built-in rule-based assistant (with a planned LLM "Layered Hybrid" upgrade) answers citizen questions instantly, deep-linking to the right service — no phone calls, queues, or searching through PDF menus.
- **Announcements citizens can't miss.** An autoplaying, accessible banner carousel surfaces new schemes, alerts, and services at the top of the homepage instead of burying them in a sidebar.
- **Real end-to-end services.** 12+ services with application submission, live status tracking, a grievance & helpline directory, and a notice board — all under one portal rather than scattered across every department's separate site.
- **Accessibility as a requirement, not an afterthought.** ARIA roles, full keyboard navigation, reduced-motion support, and a dark mode that is safe for every graphic — compliance a typical government site lacks.
- **Engineered to scale and stay secure.** Role-based access, a dual-mode data store (in-memory for demos, Cloud Firestore for production), strict validation, CORS, and a unified `{success, data, error, meta}` API contract.

## Technical Highlights

- Next.js 15 frontend (:3000) + FastAPI backend (:4000)
- Demo-bypass auth for testing; unit-tested backend resolvers
- `docs/TESTING_GUIDE.md` with curl, Swagger, and request-body references

Mayya proves that government services can be as polished, fast, and inclusive as any consumer product — while remaining secure, simple, and ready to scale.
