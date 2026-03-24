# Calendly Embedding Integration Plan

This document outlines the strategy for integrating Calendly into the **Alex Moreno Site** using the **Embed** method. The goal is to provide a seamless booking experience that aligns with the site's branding while ensuring high performance, accessibility, and security.

---

## A) Recommended Embed Approach
**Recommendation: Advanced JS Embed using `react-calendly`**

### Reasoning:
1. **Developer Experience**: Modern React wrapper that handles the external script injection safely, preventing SSR issues and ensuring consistent behavior during route changes.
2. **Branding Power**: Easy programmatic access to customization parameters (`primary_color`, `text_color`, `background_color`).
3. **Performance**: Only loads the widget when the component is mounted; can be easily code-split if used on a specific page.
4. **Consistency**: Provides controlled components for both **Inline** and **Popup** widgets, matching the two flows requested.

---

## B) Step-by-Step Task List

### 1. Setup & Configuration
- [x] Inspect framework (Vite + React + Tailwind).
- [ ] Install `react-calendly` dependency.
- [ ] Define `VITE_CALENDLY_URL` in `.env.local`.
- [ ] Determine exact branding hex codes from Tailwind CSS/Global CSS variables.

### 2. Component Development
- [ ] Create `src/components/CalendlyInline.tsx` for the "Book a Call" section.
- [ ] Create `src/components/CalendlyPopup.tsx` for the modal/popup experience.
- [ ] Implement branding parameters (Hiding GDPR banner where appropriate, applying orange/dark-blue colors).

### 3. Page Integration
- [ ] Add a new route `/book` or update the existing `Index` page with a dedicated "Book a Call" section.
- [ ] Update `src/components/Schedule.tsx` or create a new `src/pages/BookCall.tsx`.
- [ ] Modify `Navbar` and `Hero` CTAs to trigger the `CalendlyPopup` flow.

### 4. Data & Logic
- [ ] Configure "Invitee Questions" in the Calendly Admin Dashboard (Manual step).
- [ ] (Optional) Implement `prefill` logic if user email/name is already known (from Supabase login).

---

## C) Files and Components to Modify/Add

| File Path | Action | Description |
|-----------|--------|-------------|
| `.env.local` | Update | Add `VITE_CALENDLY_URL`. |
| `src/components/CalendlyInline.tsx` | New | Inline booking widget component. |
| `src/components/CalendlyPopup.tsx` | New | Modal booking widget component using Shadcn Dialog/Drawer. |
| `src/pages/BookCall.tsx` | New | (Optional) Page for dedicated booking. |
| `src/components/Schedule.tsx` | Modify | Update CTA to link to Calendly or embed inline. |
| `src/components/Hero.tsx` | Modify | Update "Book Now" CTA to trigger popup. |
| `src/App.tsx` | Modify | Add `/book` route (if applicable). |

---

## D) Configuration & Environment

| Variable | Placeholder Context | Value/Mapping |
|----------|---------------------|---------------|
| **Calendly URL** | `VITE_CALENDLY_URL` | `https://calendly.com/your-event-type` |
| **Primary Color** | `primary_color` | `f97316` (Matches `hsl(25, 95%, 53%)`) |
| **Text Color** | `text_color` | `f8fafc` (Matches `hsl(210, 40%, 98%)`) |
| **Bg Color** | `background_color` | `0b1120` (Matches `hsl(222, 47%, 7%)`) |

---

## E) QA Checklist

- [ ] **Cross-Browser**: Test on Safari, Chrome, and Firefox (check for iframe rendering issues).
- [ ] **Mobile**: Ensure responsive layout (Calendly handles internal responsiveness; we manage outer container).
- [ ] **Adblockers**: Verify that the widget loads/fails gracefully with script blockers.
- [ ] **GDPR**: Ensure `hide_gdpr_banner` is used correctly or styled to match the site's cookie policy.
- [ ] **Timezones**: Confirm the widget accurately detects and displays the user's local timezone.
- [ ] **Completion**: Verify the "Thank You" redirect or overlay occurs after a successful booking.

---

## F) Rollout Plan

1. **Local Phase**: Implement components and test with placeholder URL.
2. **Staging**: Deploy to Vercel preview branch with the real `VITE_CALENDLY_URL`.
3. **Verification**: Confirm "Invitee Questions" are correctly appearing in the embed.
4. **Production**: Update Production environment variables in Vercel.
5. **Fallback**: If the script fails to load, display a simple link button: *"Having trouble loading the calendar? Click here to book directly on Calendly."*

---

## G) Future Upgrades (Post-Launch)

- **One-Step Form Prefill**: Collect name/email on our site first, then pass to Calendly via `prefill` props.
- **UTM Tracking**: Pass `utm_source` and `utm_medium` to Calendly for better marketing attribution.
- **Webhooks Integration**: If upgrading to Calendly Professional, use webhooks to sync bookings back to our Supabase database for "My Bookings" dashboard tracking.
- **Confirmation Page**: Use Calendly's auto-redirect to a custom "Booking Successful" page on our site for better tracking pixels (FB/Google Ads).

---

> [!NOTE]
> Calendly does not allow full CSS injection into the iframe. Pixel-perfect matching is limited to the predefined color parameters. Branding will be achieved through consistent container styling and color matching.
