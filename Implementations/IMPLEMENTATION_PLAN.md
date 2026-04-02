# Final Production Refinement — Implementation Plan

> **Repo**: `ariotmr/Lovable-Cursor-Alex-Moreno-Site`
> **Stack**: Vite + React + TailwindCSS + Supabase + Stripe + Sentry + Vercel + Calendly + N8N
> **Domains**: `amoreno.space` · `alexmoreno.space` · `lovable-cursor-alex-moreno-site-nes143m13.vercel.app`
> **Supabase Project**: `llcgnxjexjgjpopjgpzr`

---

## Phase 1 — Security Audit (Priority 0)

### 1.1 Hardcoded Secrets Found in `.env` (local-only, gitignored)

> [!CAUTION]
> The `.env` file is in `.gitignore`, so these secrets are **NOT** in the GitHub repo. However, several issues remain critical.

| # | Secret | Location | Severity | Issue |
|---|--------|----------|----------|-------|
| S1 | `SUPABASE_SERVICE_ROLE_KEY=eyJhbG...` | `.env:3` | 🔴 CRITICAL | Service role key in `.env`. This key bypasses RLS. Must ONLY exist in Vercel env vars (server-side, never `VITE_` prefixed). Confirm it's set in Vercel Production/Preview. |
| S2 | `STRIPE_SECRET_KEY=sk_test_...` | `.env:33` | 🔴 CRITICAL | Stripe secret key in `.env`. Must ONLY exist in Vercel env vars. Never prefix with `VITE_`. |
| S3 | `STRIPE_SECRET_KEY=sk_live_...` (commented) | `.env:25` | 🟠 HIGH | Live Stripe secret key is commented out but **plaintext in file**. Remove entirely from `.env`. Store only in Vercel Production env vars. |
| S4 | `STRIPE_PUBLISHABLE_KEY=pk_live_...` (commented) | `.env:26` | 🟡 MEDIUM | Live publishable key commented out. Publishable keys are safe client-side but should still not sit as plaintext comments. Remove from `.env`. |
| S5 | `SENTRY_AUTH_TOKEN=sntrys_...` | `.env:19` | 🟠 HIGH | Sentry organization auth token. This is a **build-time only** token for source map uploads. Must ONLY exist in Vercel env vars. Remove from `.env`. |
| S6 | `VITE_SENTRY_DSN=...` | `.env:15` | ✅ OK | Sentry DSN is intentionally public (client-side). `VITE_` prefix is correct. |
| S7 | `VITE_SUPABASE_ANON_KEY=sb_publishable_...` | `.env:2` | ✅ OK | Publishable anon key, safe for client. `VITE_` prefix correct. |
| S8 | `VITE_N8N_WEBHOOK_URL=...` | `.env:16` | 🟡 MEDIUM | N8N webhook URL has `VITE_` prefix, meaning it's bundled into the client JS. The `api/notify.ts` proxy correctly falls back to this, but the URL is unnecessarily exposed. Should be server-only `N8N_WEBHOOK_URL` without `VITE_` prefix. |

### 1.2 Git History Scan
- ✅ **No secrets found in git history.** Scanned all commits across all branches for `sk_live`, `sk_test`, `sntrys_`, `eyJhbGci`, `service_role`. The `.env` file is properly gitignored and was never committed.

### 1.3 `.gitignore` Verification
- ✅ `.env` is listed in `.gitignore`
- ✅ `.vercel` is listed in `.gitignore`
- ✅ `*.local` is listed (covers `.env.local`)
- 🟡 **Missing**: `.env.local` should also be explicitly listed for extra safety (currently covered by `*.local` glob)

### 1.4 Client-Side vs Server-Side Separation
| Variable | Prefix | Client Bundled? | Correct? |
|----------|--------|-----------------|----------|
| `VITE_SUPABASE_URL` | `VITE_` | Yes | ✅ |
| `VITE_SUPABASE_ANON_KEY` | `VITE_` | Yes | ✅ |
| `VITE_SENTRY_DSN` | `VITE_` | Yes | ✅ |
| `VITE_CALENDLY_URL` | `VITE_` | Yes | ✅ |
| `VITE_N8N_WEBHOOK_URL` | `VITE_` | Yes | ⚠️ Should be server-only |
| `STRIPE_SECRET_KEY` | None | No | ✅ |
| `STRIPE_PUBLISHABLE_KEY` | None | No | 🟡 Could be `VITE_` if needed client-side, but currently only used server-side — OK |
| `SUPABASE_SERVICE_ROLE_KEY` | None | No | ✅ |
| `SENTRY_AUTH_TOKEN` | None | No | ✅ |

### 1.5 Stripe Webhook & Key Configuration

| Check | Status | Notes |
|-------|--------|-------|
| Webhook signature verification | ⚠️ **MISSING** | No Stripe webhook endpoint exists in `/api/`. If using n8n for webhooks, Stripe sends directly to n8n — but n8n should verify `stripe-signature` header. |
| Test vs Live key mismatch | ⚠️ **REVIEW** | Currently using TEST keys. Commented-out LIVE keys exist. Before going live: uncomment live keys in Vercel env vars only, remove test keys from production. |
| `STRIPE_PRICE_ID` alignment | ✅ | Test price ID `price_1TGuWdRoNMjZZGklWhoEMpyl` is set. Live price ID `price_1TGfMKRoNMjZZGklQZQLlME8` is commented. |

### 1.6 Sentry Configuration

| Check | Status | Notes |
|-------|--------|-------|
| DSN exposure | ✅ OK | DSN is intentionally public per Sentry docs |
| Environment tagging | ⚠️ **MISSING** | `Sentry.init()` in `main.tsx` does not set `environment` property. Should be `environment: import.meta.env.MODE` to distinguish dev/preview/production |
| Source map upload | ⚠️ **NOT CONFIGURED** | No `@sentry/vite-plugin` in `vite.config.ts`. Source maps are not being uploaded to Sentry, meaning stack traces will be obfuscated in production. |
| `tracesSampleRate: 1.0` | 🟡 | 100% trace sampling is fine for low traffic but should be reduced (e.g., 0.2) if traffic increases |

### 1.7 Recommended Actions (Phase 1)

> [!IMPORTANT]
> Per your instructions, I will **NOT** modify the `.env` file. All findings below are documented for your review.

1. **Remove commented-out live Stripe keys** from `.env` (lines 25-28) — store only in Vercel
2. **Remove `SENTRY_AUTH_TOKEN`** from `.env` (line 19) — store only in Vercel
3. **Rename `VITE_N8N_WEBHOOK_URL`** to `N8N_WEBHOOK_URL` (remove `VITE_` prefix) in `.env` and update `api/notify.ts` to remove `VITE_` fallback
4. **Add `environment` tag** to Sentry init
5. **Verify all secrets exist in Vercel** dashboard (Production + Preview scopes)

---

## Phase 2 — Full Codebase Audit + Cleanup

### 2.1 Dead Files to Delete

| File | Reason | Severity |
|------|--------|----------|
| `test-api.js` | One-off test script with hardcoded Stripe session ID | 🟠 DELETE |
| `test.js` | One-off Playwright test script | 🟠 DELETE |
| `test.mjs` | Duplicate of `test.js` in ESM format | 🟠 DELETE |
| `temp.html` | Stale build output copy of `index.html` | 🟠 DELETE |
| `Purchase_Confirmation.html` | Standalone HTML email template — not used by app (n8n handles emails) | 🟡 DELETE or move to `Implementations/` |
| `BingSiteAuth.xml` (root) | Duplicate of `public/BingSiteAuth.xml` | 🟡 DELETE root copy |
| `scripts/dev.mjs` | Development helper script — review if still needed | 🟡 REVIEW |
| `Implementations/` (entire folder) | 8 historical plan documents. Not used at runtime. Consider moving out of repo or into a `docs/` folder | 🟡 REVIEW |
| `src/test/` | Test directory — verify contents | 🟡 REVIEW |
| `bun.lock` + `bun.lockb` | Bun lockfiles alongside `package-lock.json`. Pick one package manager | 🟡 CLEANUP |

### 2.2 Duplicate / Redundant Code

| Issue | Location | Fix |
|-------|----------|-----|
| **Duplicate toast hook** | `src/hooks/use-toast.ts` (4121 bytes, original) AND `src/components/ui/use-toast.ts` (85 bytes, re-export) | The UI version just re-exports from hooks. This is fine as a barrel but verify no circular imports. Low priority. |
| **Duplicate `useQuery` pattern for auth** | `ProtectedRoute.tsx`, `User.tsx`, `Profile.tsx`, `NotificationCenter.tsx` all independently call `supabase.auth.getSession()`/`getUser()` | Consider a shared `useAuth()` hook to reduce duplication |
| **Duplicate inline input styles** | `EmailInquiry.tsx`, `Schedule.tsx`, `Courses.tsx` all use extensive inline Tailwind class strings for inputs | Consider using the `<Input>` shadcn component consistently |
| **`stripe` package in `dependencies`** instead of `devDependencies` | `package.json:68` | `stripe` SDK is only used in `/api/` (server-side Vercel functions). Move to `devDependencies` or keep — Vercel installs all deps anyway. Low priority. |

### 2.3 Bugs & Code Quality Issues

| # | Issue | File | Severity | Fix |
|---|-------|------|----------|-----|
| B1 | **`notifyN8n` fire-and-forget fetch doesn't await** | `src/lib/notifyN8n.ts:16` | 🟡 LOW | `fetch()` is called without `await`. The `try/catch` around it won't catch network errors. This is intentional fire-and-forget but the catch block is misleading. Add a `.catch()` handler on the fetch promise instead. |
| B2 | **`err as any` type casting** | `api/create-checkout.ts:58`, `api/get-session.ts:40` | 🟡 LOW | Should use proper Stripe error typing: `err instanceof Stripe.errors.StripeError` |
| B3 | **No rate limiting on `/api/create-checkout`** | `api/create-checkout.ts` | 🟡 MEDIUM | No protection against abuse. Consider adding basic rate limiting via Vercel Edge Config or checking for duplicate emails within timeframe. |
| B4 | **Missing `DialogDescription`** in Courses dialog | `src/pages/Courses.tsx:228` | 🟡 LOW | Radix Dialog accessibility warning — `DialogContent` should have a `DialogDescription` |
| B5 | **`NotificationCenter` delete mutation missing RLS DELETE policy** | `src/components/NotificationCenter.tsx:126-135` | 🟠 MEDIUM | The component calls `.delete()` on notifications but there's no RLS DELETE policy for notifications. This will silently fail. |
| B6 | **`User.tsx` uses `any` types extensively** | `src/pages/User.tsx:44-45` | 🟡 LOW | `useState<any>` for user and profile. Should be properly typed. |
| B7 | **`Admin.tsx` reads `profiles` table without filtering** | `src/pages/Admin.tsx:23` | 🟡 LOW | `supabase.from('profiles').select('*', { count: 'exact', head: true })` — this works because admin RLS policy allows it, but it counts ALL profiles. Verified correct behavior. |
| B8 | **`Schedule.tsx` imports unused components** | `src/components/Schedule.tsx:2-3` | 🟡 LOW | `Calendar`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger` are imported but never used in the rendered output (the schedule now uses Calendly embed instead of custom calendar). |
| B9 | **`Success.tsx` "Download PDF Receipt" button is a no-op** | `src/pages/Success.tsx:168-173` | 🟡 MEDIUM | Button has no `onClick` handler. Either implement PDF generation or remove the button. |
| B10 | **Missing error boundary** | `src/App.tsx` | 🟡 MEDIUM | No React error boundary wrapping the app. A runtime crash in any component will white-screen the entire app. Consider wrapping with `Sentry.ErrorBoundary`. |

### 2.4 Performance Issues

| Issue | Location | Severity |
|-------|----------|----------|
| **`tracesSampleRate: 1.0`** sends 100% of performance traces | `src/main.tsx:14` | 🟡 Reduce to 0.2-0.5 for production |
| **No lazy loading of routes** | `src/App.tsx` | 🟡 All pages are eagerly imported. Use `React.lazy()` + `Suspense` for admin pages and less-visited routes |
| **Large UI component library** | `src/components/ui/` (49 files) | 🟡 Many UI components appear unused (chart, carousel, command, context-menu, dropdown-menu, hover-card, input-otp, menubar, navigation-menu, pagination, resizable, sidebar, slider, toggle, toggle-group). Tree-shaking should handle this but review. |

---

## Phase 3 — Supabase Audit

### 3.1 RLS Policy Review

| Table | Policies | Status | Notes |
|-------|----------|--------|-------|
| `profiles` | Users read/update own; Admins full access via `check_is_admin()` | ✅ Secure | No public unauth access |
| `bookings` | Users insert/read own; Admins full CRUD | ✅ Secure | |
| `sessions` | Public read; Admin CRUD | ✅ Correct | Sessions are public catalog items |
| `session_types` | Public read; Admin CRUD | ✅ Correct | |
| `categories` | Public read; Admin CRUD | ✅ Correct | |
| `notifications` | Users read/update own; Admin insert | ⚠️ **Missing DELETE policy** | Users cannot delete their own notifications. `NotificationCenter.tsx` calls delete — will fail silently. |
| `history_logs` | Admin only | ✅ Secure | |

> [!IMPORTANT]
> **Missing RLS policy**: `notifications` table needs a DELETE policy for authenticated users on their own notifications.

### 3.2 Supabase Security Advisories (from Supabase Linter)

| Advisory | Severity | Fix |
|----------|----------|-----|
| `function_search_path_mutable` — `handle_new_user` | 🟡 WARN | Set `search_path` on function: `ALTER FUNCTION public.handle_new_user() SET search_path = public;` |
| `function_search_path_mutable` — `check_is_admin` | 🟡 WARN | `ALTER FUNCTION public.check_is_admin() SET search_path = public;` |
| `function_search_path_mutable` — `protect_profile_role` | 🟡 WARN | `ALTER FUNCTION public.protect_profile_role() SET search_path = public;` |
| `function_search_path_mutable` — `notify_on_booking_change` | 🟡 WARN | `ALTER FUNCTION public.notify_on_booking_change() SET search_path = public;` |
| `auth_leaked_password_protection` — Disabled | 🟠 HIGH | Enable leaked password protection in Supabase Auth settings (checks against HaveIBeenPwned.org) |

### 3.3 Auth Configuration

| Check | Status | Action Needed |
|-------|--------|---------------|
| Redirect URLs for all 3 domains | ⚠️ **VERIFY** | Confirm these are whitelisted in Supabase Auth → URL Configuration: `https://alexmoreno.space/**`, `https://amoreno.space/**`, `https://lovable-cursor-alex-moreno-site-nes143m13.vercel.app/**` |
| Session persistence | ✅ | Default Supabase auth uses `localStorage` — works across page reloads |
| Cookie scope for cross-domain | ⚠️ **N/A** | Since these are separate domains (not subdomains), Supabase auth tokens stored in localStorage won't share across domains. Users must log in on each domain separately. This is expected behavior. |

### 3.4 Test User Cleanup

| User | Email | Action |
|------|-------|--------|
| `arioteimuri@gmail.com` | Admin account | ✅ Keep |
| `test@...` (inappropriate email) | Test account | 🟠 **DELETE** — Remove from `auth.users` and `profiles` table before production |

### 3.5 Schema Alignment
- ✅ All tables match frontend expectations (profiles, sessions, session_types, categories, bookings, notifications, history_logs)
- ✅ All foreign keys are properly defined
- ✅ All enums match frontend usage (`user_role`: user/client/admin, `booking_status`: pending/confirmed/cancelled/completed)

---

## Phase 4 — Deployment & Config Audit

### 4.1 Vercel Environment Variables

> [!IMPORTANT]
> I cannot access Vercel dashboard via MCP. The following must be **manually verified** by you.

**Required Vercel env vars (Production + Preview):**

| Variable | Scope | Value Source |
|----------|-------|-------------|
| `VITE_SUPABASE_URL` | All | `https://llcgnxjexjgjpopjgpzr.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | All | `sb_publishable_...` |
| `STRIPE_SECRET_KEY` | Production: live key, Preview: test key | |
| `STRIPE_PUBLISHABLE_KEY` | Production: live key, Preview: test key | |
| `STRIPE_PRICE_ID` | Production: live price, Preview: test price | |
| `STRIPE_PRODUCT_ID` | Production: live product, Preview: test product | |
| `VITE_SENTRY_DSN` | All | Current DSN |
| `SENTRY_AUTH_TOKEN` | All (build-time) | Current token |
| `N8N_WEBHOOK_URL` | All (server-only, no `VITE_` prefix) | Production n8n URL |
| `VITE_CALENDLY_URL` | All | Calendly link |
| `VITE_BRAND_PRIMARY` | All | `f97316` |
| `VITE_BRAND_BG` | All | `0b1120` |
| `VITE_BRAND_TEXT` | All | `f8fafc` |
| `VITE_CALENDLY_HIDE_GDPR` | All | `true` |

### 4.2 Domain Resolution

| Domain | Expected Behavior | Verify |
|--------|-------------------|--------|
| `alexmoreno.space` | Primary domain, canonical URLs | Test in Phase 5 |
| `amoreno.space` | Should redirect to `alexmoreno.space` OR serve same content | Test in Phase 5 |
| `lovable-cursor-alex-moreno-site-nes143m13.vercel.app` | Vercel auto-generated, should work | Test in Phase 5 |

### 4.3 `vercel.json` Review
- Current config: `{ "devCommand": "npm run framework-dev" }`
- ⚠️ **Missing**: No `rewrites` or `routes` config for SPA fallback. Vercel handles this automatically for Vite projects via its framework detection, but explicit config is safer.
- ⚠️ **Missing**: No `headers` config for security headers (CORS, CSP, etc.)

---

## Phase 5 — Live Site Testing

### Test Matrix

| Test | Pages/Routes | Method |
|------|-------------|--------|
| All public pages load | `/`, `/courses`, `/login`, `/success`, `/not-a-real-page` (404) | Browser subagent |
| All protected pages redirect to login | `/admin`, `/admin/sessions`, `/admin/clients`, `/admin/bookings`, `/profile`, `/user` | Browser subagent |
| Navigation: all links, buttons | Navbar, footer, CTAs | Browser subagent |
| Stripe checkout flow | `/courses` → fill form → Stripe redirect → `/success?session_id=...` | Browser subagent (test mode) |
| Forms: EmailInquiry, Schedule booking | Submit forms, verify N8N proxy | Browser subagent |
| Responsive layout | Each page at mobile/tablet/desktop | Browser subagent |
| Console errors | Zero errors, zero warnings | Browser subagent |
| Cross-domain | Repeat key tests on all 3 domains | Browser subagent |

---

## Phase 6 — Final Sign-Off Report

Will be generated after all fixes are applied and verified.

---

## User Review Required

> [!WARNING]
> **Stripe Live Mode**: Before switching to live keys, ensure:
> 1. Webhook endpoint is configured (either in Vercel API or n8n)
> 2. Webhook signing secret is verified
> 3. Live price/product IDs are correct
> 4. Test the full flow with a real card in test mode first

> [!IMPORTANT]
> **Questions for you before execution:**
> 1. **Test user cleanup**: Should I delete the test user account from Supabase auth & profiles?
> 2. **`Implementations/` folder**: Delete from repo or keep as documentation?
> 3. **`Purchase_Confirmation.html`**: Is this used by n8n email templates, or can it be deleted?
> 4. **"Download PDF Receipt" button** on Success page: Implement it or remove it?
> 5. **Bun lockfiles** (`bun.lock`, `bun.lockb`): Are you using Bun? If npm only, should I remove these?
> 6. **Domain redirect strategy**: Should `amoreno.space` redirect to `alexmoreno.space`, or serve the same content independently?

## Verification Plan

### Automated Tests
- Run `npm run build` to verify zero build errors
- Run `npm run lint` to verify zero lint errors
- Browser testing via subagent on all 3 domains

### Manual Verification
- You verify Vercel environment variables are correctly scoped
- You verify Supabase Auth redirect URL configuration
- You test a real Stripe checkout (test mode) end-to-end
