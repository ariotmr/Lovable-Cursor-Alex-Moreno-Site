# Stripe Integration Implementation Plan

This plan outlines the architecture, best practices, and a step-by-step checklist to integrate **Stripe** into your Site, connected to **n8n** for workflow automation, and syncing data to **Supabase** acting as the backend database.

## Architecture Overview

**1. The Site (Frontend):** Collects user information via a form and initiates the payment process. 
**2. API/Backend (Vercel Serverless):** Creates the secure Stripe Checkout Session so API keys aren't exposed in the browser.
**3. Stripe:** Handles the secure payment collection, SCA compliance, and mobile wallets.
**4. n8n (Webhooks):** Listens for Stripe Webhook events (e.g., `checkout.session.completed`), protecting the process from frontend drop-offs.
**5. Supabase (Database):** n8n formats the confirmed payment data and inserts/updates the user records securely into Supabase.

---

## Best Practices
- **Never trust the frontend for fulfillment:** Always rely on secure Stripe Webhooks (via n8n) to fulfill the order or update the database. If a user closes the browser during the "success" redirect, the webhook will still fire.
- **Pass data via Metadata:** Attach the user's form inputs (e.g., `user_id`, `email`, `plan_type`) to the Stripe Checkout Session `metadata`. This data will be passed along through the webhook to n8n.
- **Verify Webhook Signatures:** n8n must verify the Stripe webhook signature to ensure the payload actually came from Stripe and isn't malicious.
- **Idempotency:** Ensure your n8n workflows and Supabase upserts can handle duplicate webhook events gracefully (Stripe occasionally sends the same event twice).

---

## Implementation Checklist

### Phase 1: Stripe Dashboard Setup
- [ ] Create a "Product" in Stripe for the Transformation Plan.
- [ ] Document the `PRICE_ID` generated for that product.
- [ ] Retrieve your Stripe `SECRET_KEY` and `PUBLISHABLE_KEY` from the Developer Dashboard.
- [ ] Create a Webhook endpoint in Stripe pointing to your n8n Production Webhook URL.
- [ ] Configure the Webhook to only listen for `checkout.session.completed`.
- [ ] Document the `WEBHOOK_SECRET` provided by Stripe.

### Phase 2: Supabase Database Preparation
- [ ] Ensure a `users` or `payments` table exists in Supabase.
- [ ] Add columns for Stripe data (e.g., `stripe_customer_id`, `payment_status`, `plan_type`).
- [ ] Ensure RLS (Row Level Security) policies allow your n8n service role key to insert/update rows.

### Phase 3: Site & Serverless Function (Vercel)
- [ ] Add Stripe environment variables to your Vercel project (`STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `VITE_APP_URL`).
- [ ] Build a Vercel serverless function (`/api/create-checkout.ts`) that does the following:
  - [ ] Initializes the Stripe client.
  - [ ] Receives user form data from the frontend.
  - [ ] Calls `stripe.checkout.sessions.create()` with the `PRICE_ID`, `success_url`, and `cancel_url`.
  - [ ] Attaches the critical user data to the `metadata` object of the session.
  - [ ] Returns the generated `session.url`.
- [ ] Update the frontend form to `POST` to `/api/create-checkout` and redirect the user to the returned URL upon submission.

### Phase 4: n8n Workflow Automation
- [ ] Create a new workflow in n8n starting with a Webhook Trigger node.
- [ ] Set up a Stripe Webhook verification step (strongly recommended) to validate the payload signature.
- [ ] Add a Switch or If node to ensure the event type is exactly `checkout.session.completed`.
- [ ] Add a Supabase node (or HTTP Request node using Supabase REST API).
- [ ] Map the Stripe payload data (specifically `data.object.metadata` and `data.object.customer_email`) to your Supabase table schema.
- [ ] Configure the Supabase node to "Upsert" or "Insert" the record into your database.
- [ ] (Optional) Add email notification nodes in n8n to send a welcome email to the user.
- [ ] Activate the n8n workflow.

### Phase 5: Testing & QA
- [ ] Run a test transaction using Stripe Test Mode credit cards (e.g., `4242 4242 4242 4242`).
- [ ] Verify the frontend successfully redirects to the Stripe Checkout page.
- [ ] Verify the payment succeeds and redirects to your Site's success page.
- [ ] Open n8n and verify the Webhook was received and the workflow executed successfully.
- [ ] Open Supabase and verify the new user/payment record was created with the correct data.
