# N8N Webhook Integration — Implementation Plan & Checklist

**Branch:** `feat/n8n-webhook-changes`  
**GitHub Issue:** [#6 — feat: n8n webhook integration](https://github.com/ariotmr/Lovable-Cursor-Alex-Moreno-Site/issues/6)  
**Last updated:** 2026-03-24

---

## MCP Connections

| Server | Status |
|---|---|
| **Supabase** | ✅ Connected — `llcgnxjexjgjpopjgpzr` ACTIVE_HEALTHY |
| **GitHub** | ✅ Connected — `ariotmr` |
| **Sentry** | ⚠️ Not yet configured in MCP |

---

## Architecture

```
Browser (React)
   │
   │  POST /api/notify  (same-origin — no CORS)
   ▼
Vercel Serverless Function  (/api/notify.ts)
   │
   │  POST N8N_WEBHOOK_URL  (server-to-server)
   ▼
n8n Workflow
```

---

## Environment Variables

| Variable | Prefix | Where | Status |
|---|---|---|---|
| `N8N_WEBHOOK_URL` | None (server-side only) | `.env` + Vercel dashboard | ⚠️ Needs your URL filled in |

> ⚠️ **Do NOT use `VITE_` prefix** — this key must never be exposed in the browser bundle.

---

## Webhook Event Payloads

All events share this structure with an `event_type` discriminator:

```json
{
  "eventType": "booking_intent" | "booking_confirmed" | "contact_inquiry" | "email_inquiry",
  "submittedAt": "2026-03-24T12:00:00.000Z",
  "firstName": "...",
  "lastName": "...",
  "email": "...",
  "sessionId": "...",
  "sessionTitle": "...",
  "sessionDate": "...",
  "message": "...",
  "reason": "..."
}
```

---

## Implementation Checklist

### Infrastructure
- [x] Install `@vercel/node` devDependency
- [x] Create `/api/notify.ts` — Vercel serverless proxy to n8n (with honeypot bot protection)
- [x] Create `vercel.json` — routes `/api/*` to serverless functions
- [x] Create `src/lib/notifyN8n.ts` — shared fire-and-forget client utility

### Webhook Triggers — Existing Flows
- [x] `Schedule.tsx` — `booking_intent` fires when user submits contact info and proceeds to Calendly
- [x] `Schedule.tsx` — `contact_inquiry` fires when "Contact for Details" CTA is clicked
- [x] `User.tsx` — `booking_confirmed` fires after Supabase insert succeeds in dashboard

### New Feature — Email Inquiry Section
- [x] Create `src/components/EmailInquiry.tsx` — form with first name, last name, email, message
- [x] Mount `<EmailInquiry />` in `Index.tsx` (between SocialProof and Logistics)
- [x] Connect form submit to `/api/notify` with `event_type: 'email_inquiry'`
- [x] Honeypot anti-bot field on form
- [x] Loading / success / error UI states

### GitHub
- [x] Issue #6 created
- [x] Branch `feat/n8n-webhook-changes` created off `main`
- [ ] Commit all changes to the branch
- [ ] Open PR when ready

### Environment & Deployment
- [ ] Fill in `N8N_WEBHOOK_URL=<your-url>` in local `.env`
- [ ] Add `N8N_WEBHOOK_URL` to Vercel dashboard (Production + Preview)
- [ ] Test locally with `vercel dev`
- [ ] Verify all 4 event types arrive in n8n
- [ ] Deploy to production

---

## Files Changed

| File | Action | Purpose |
|---|---|---|
| `api/notify.ts` | ✅ Created | Vercel serverless proxy to n8n |
| `vercel.json` | ✅ Created | API route configuration |
| `src/lib/notifyN8n.ts` | ✅ Created | Client-side fire-and-forget utility |
| `src/components/EmailInquiry.tsx` | ✅ Created | Email inquiry contact section |
| `src/components/Schedule.tsx` | ✅ Modified | Added booking_intent + contact_inquiry triggers |
| `src/pages/User.tsx` | ✅ Modified | Added booking_confirmed trigger |
| `src/pages/Index.tsx` | ✅ Modified | Mounted `<EmailInquiry />` |
| `.env` | ✅ Modified | Added `N8N_WEBHOOK_URL=` key (needs value) |

---

## n8n Workflow Suggestions

Use a **Switch** node on `event_type`:
- `email_inquiry` → Email Alex + CRM add contact
- `booking_intent` → Slack notification, add to waitlist/CRM
- `booking_confirmed` → Confirmation email to client, update CRM
- `contact_inquiry` → Email Alex, tag as "corporate interest"
