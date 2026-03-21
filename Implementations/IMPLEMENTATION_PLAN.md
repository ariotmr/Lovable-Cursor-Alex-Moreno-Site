# Implementation Plan: Full Backend + Dashboards

This document outlines the step-by-step implementation plan for adding a Supabase backend and dashboard systems (Admin & Client) to the Personal Trainer booking platform.

## 1. Project Infrastructure & Auth
### Supabase Setup
- Initialize a new Supabase project.
- Configure Auth Providers:
  - Email/Password (SMTP setup for magic links/verification).
  - Google OAuth (optional, but recommended for high UX).
- Set up **Row Level Security (RLS)** as the primary security layer.

### Environment Variables
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for admin-only edge functions)

---

## 2. Database Schema (Supabase)

### Enums
- `user_role`: `user`, `client`, `admin`
- `booking_status`: `pending`, `confirmed`, `cancelled`, `completed`

- `session_type`: `one-on-one`, `group`, `workshop` > use this as starting template but allow admin to create their own types of sessions, so these should not be enums but options to be CRUD in a table.

### Tables
#### `profiles`
- `id`: uuid (references auth.users)
- `first_name`: text
- `last_name`: text
- `avatar_url`: text
- `role`: user_role (default: 'user')
- `is_banned`: boolean (default: false)
- `banned_at`: timestamp
- `created_at`: timestamp
> include address lines and phone number as standard in our days (add1, add2, post code, city, county, country, then ph nbr refix + number.)

#### `session_types`
- `id`: uuid
- `name`: text (e.g., "HIIT Intensive", "Strength Training")
- `description`: text
- `base_price`: numeric
- `category`: text
> let also create a table category, for the user to create categories as needed.

#### `categories` (New table based on notes)
- `id`: uuid
- `name`: text

#### `sessions`
- `id`: uuid
- `type_id`: uuid (references session_types)
- `title`: text
- `description`: text
- `max_slots`: integer
- `price`: numeric
- `location`: text
- `image_url`: text
- `is_active`: boolean
- `start_date`: timestamp (active from)
- `end_date`: timestamp (active until, null if ongoing)
- `recurrence_rule`: text (rrule format for recurring availability)

#### `bookings`
- `id`: uuid
- `session_id`: uuid (references sessions)
- `user_id`: uuid (references profiles)
- `status`: booking_status
- `cancel_reason`: text
- `cancelled_at_datetime`: timestamp
- `created_at`: timestamp

#### `history_logs`
- `id`: uuid
- `entity_type`: text (user_login, session, booking)
- `entity_id`: uuid
- `action`: text
- `performed_by`: uuid (references profiles)
- `details`: jsonb
- `created_at`: timestamp

### Security (RLS)
- Implement strict policies: 
  - Users can read/update their own `profiles` and `bookings`.
  - Admins have `ALL` access to all tables.
  - `session_types` and available `sessions` are publicly readable.

---

## 3. Frontend Routing & Auth State

### Routing Setup
- Configure `react-router-dom` with role-based protected routes:
  - **Public:** `/`, `/login`, `/signup`
  - **Protected (User/Client):** `/client/dashboard`, `/profile`, `/client/bookings`
  - **Protected (Admin):** `/admin/dashboard`, `/admin/*`
- Create a `RoleProtectedRoute` wrapper to redirect unauthorized access.

### Authentication Flow
- Build `/login` and `/signup` pages.
- Integrate Supabase Auth listener to manage global session state.
- Upon first signup, default user role is `user`.

---

## 4. General User & Client Experience

### Profile Management
- **`/profile`**: Form to update basic info (name, phone) and upload an avatar to the Supabase bucket.

### Client Pages
- **`/client/dashboard`**: High-level overview (next upcoming session, fast action to book a new session).
- **`/client/bookings`**: History of past bookings and list of upcoming bookings. 
  - Allow cancellation of upcoming bookings (triggers modal confirmation, asks for optional cancel reason, records datetime).
- **Booking Flow**: A clean interface for users to see the calendar of available `sessions`, see remaining slots, and confirm a booking. 
> Note: Payment is collected in person, no Stripe integration yet.

---

## 5. Admin Controls & Dashboards

### Admin Dashboard Overview
- **`/admin/dashboard`**: Quick stats (Today's sessions, pending bookings, total active clients).

### Session Management
- **`/admin/session-types`**: CRUD for the service templates.
- **`/admin/sessions`**: CRUD for scheduling specific instances on the calendar. 
  - Handle cancellations (prompting for reason and datetime).

### Availability Management
- **`/admin/settings/availability`**: UI to set recurring weekly schedules and exception dates. 

### User & Client Management
- **`/admin/clients`**: Data table listing all registered users.
  - Ability to view a specific user's detailed booking history.
  - **Role Management Modal:** Upgrade `user` to `client`, or mark as `rejected`/`banned`.

### Bookings & History Reporting
- **`/admin/bookings`**: Global view of all bookings. Admin can change statuses (e.g., mark a user as a 'no show').
- **`/admin/reporting`**: A dedicated view querying the `history_logs` table. Allows filtering by:
  - User login history.
  - Session creation/modification/cancellation history.
  - Booking alterations.

---

## 6. Edge Functions & Automation (Optional/Advanced)

### Role Automation
- Create a Supabase Database Webhook or Edge Function that automatically promotes a `user` to a `client` the moment their first booking is successfully inserted into the database.

### Security Enhancements
- Ensure banned/rejected users are blocked from reading/writing via RLS policies.

---

## 7. Polish & Testing

### UI Improvements
- Integrate Top-Left Toasts for every CRUD operation (e.g., "Session Created", "Booking Cancelled").
- Implement loading skeletons for dashboard tables.

### Responsiveness & Testing
- Mobile responsiveness check for tables (using scroll areas or card-based mobile views).
- Final end-to-end testing of user roles to ensure a `client` cannot access `/admin` routes.

---

## Detailed Phases

### Phase 2: Session & Category Management
- [ ] CRUD for categories.
- [ ] CRUD for session_types.
- [ ] CRUD for sessions.
- [ ] Implement Availability Rules using JSONB recurrence rules.
- [ ] Admin UI for Session management (List, Create, Edit).

### Admin UI UX Improvements
- [ ] Implement Collapsible Sidebar.
- [ ] Add Breadcrumbs Navigation (small text).
- [ ] Implement Real-time Notification Center.
- [ ] Add Trend Indicators on Summary Cards (with date range filter).
- [ ] Add Contextual Quick Actions directly on dashboard tables.
