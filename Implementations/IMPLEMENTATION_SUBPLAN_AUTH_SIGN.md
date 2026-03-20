# IMPLEMENTATION SUB-PLAN: Authentication, Sign-In/Out & Dashboards

This sub-plan focuses on the clean and functional implementation of the authentication flow, role-based access control, and the core dashboard structure (Admin and User pages).

## 1. Supabase Backend Setup

### A. Database Schema
Ensure the following base tables and enums are present to support role-based logic:

```sql
-- Enums
CREATE TYPE public.user_role AS ENUM ('user', 'client', 'admin');

-- Profiles Table (Links to Auth.Users)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  first_name text,
  last_name text,
  email text,
  role public.user_role DEFAULT 'user'::public.user_role,
  created_at timestamptz DEFAULT now(),
  -- Additional fields for address and contact
  address1 text,
  address2 text,
  post_code text,
  city text,
  county text,
  country text DEFAULT 'UK',
  phone text
);
```

### B. Automation (Triggers)
Automatically create a profile when a new user signs up:

```sql
-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### C. Security (RLS) & Column Protection
To ensure only admins can manage roles and access the admin dashboard:

```sql
-- Helper function to check admin status without recursion
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to prevent non-admins from updating the 'role' column
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS trigger AS $$
BEGIN
  IF (OLD.role IS DISTINCT FROM NEW.role) THEN
    IF NOT public.check_is_admin() THEN
      NEW.role := OLD.role; -- Revert role change if not an admin
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_protect_profile_role
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own profile" ON profiles 
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile, but 'role' is protected by the trigger
CREATE POLICY "Users can update their own profile" ON profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins have full access to profiles" ON profiles 
  FOR ALL TO authenticated USING (public.check_is_admin());
```

---

## 2. Frontend Foundation

### A. Supabase Client (`src/lib/supabase.ts`)
Initialize the client using environment variables.

### B. Protected Route Wrapper (`src/components/ProtectedRoute.tsx`)
Create a wrapper that:
1. Checks for an active session.
2. Fetches the user's role from the `profiles` table.
3. Redirects to `/login` if unauthenticated.
4. Redirects to `/user` if a user tries to access `/admin` without permissions.

---

## 3. Auth Flow Implementation

### A. Sign-In Page (`src/pages/Login.tsx`)
- Implement `signInWithPassword`.
- Logic: After successful login, fetch the `role` and navigate to the appropriate dashboard:
  - `admin` -> `/admin`
  - `user/client` -> `/user`

### B. Sign-Out Logic
- Implement `supabase.auth.signOut()`.
- Logic: Reset application state and navigate back to the home page or login screen.

---

## 4. Dashboards

### A. Admin Dashboard (`src/pages/Admin.tsx`)
- Protected by `<ProtectedRoute requireAdmin>`.
- Sidebar/Header for administrative navigation (Management of sessions, users, logs).
- Statistics overview cards.

### B. User Dashboard (`src/pages/User.tsx`)
- Protected by `<ProtectedRoute>`.
- Personalized welcome message using profile data.
- Overview of current bookings and quick links to booking a new session.

---

## 5. Navigation & Global State
- **Navbar**: Dynamically show "Sign In" or "Dashboard" (pointing to `/admin` or `/user` based on role).
- **Session Listener**: Use `supabase.auth.onAuthStateChange` in the root component to keep the UI in sync with the current user session.

---

## 6. Auth Profiles & Dropdown Integration

### Objective
Implement the profiles page and update the navigation bar to include a dynamic profile dropdown menu.

### Sub-Tasks
#### 1. Profile Page Creation
- Create a new `Profile` page accessible to all user roles (user, client, admin).

#### 2. Navbar Updates
- Replace the existing generic "Sign In" / "Dashboard" button block for authenticated users.
- Add a profile button displaying the user's profile picture.
- If no profile picture is available, display a modern placeholder (e.g., an icon or user initials).
- Ensure the profile button triggers a dropdown menu.

#### 3. Dropdown Menu Integration
- Add "Profile" option linking to the newly created profile page.
- Add "Log Out" option reusing the existing logout logic without modification.

### Checklist
- [x] Create `Profile.tsx` page.
- [x] Update Navbar component with a profile picture button for authenticated users.
- [x] Implement dropdown menu with 'Profile' and 'Log Out' links.
- [x] Verify profile page retrieves and displays correct data.
- [x] Confirm logout function operates as intended.
