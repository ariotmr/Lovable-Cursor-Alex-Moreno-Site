# Personal Trainer Booking Web Application

Welcome to the Personal Trainer Booking Web Application! This project is a comprehensive booking platform and dashboard designed for personal trainers and their clients. It provides a full suite of tools to manage sessions, bookings, and users, featuring dedicated dashboards for both clients and administrators.

## 📖 What is this project?

This application serves as a complete platform to handle scheduling and management for a personal training business. 

### Key Features
- **Public Pages:** Landing page, Authentication (Login/Signup).
- **Client Dashboard:** Users and clients can view upcoming sessions, book new sessions, check their booking history, and manage their profile and avatars.
- **Admin Dashboard:** Administrators have wide-ranging controls, including:
  - Session and service type management (CRUD operations).
  - Client and user role management (User, Client, Admin, Rejected, Banned).
  - Detailed reporting and history logging for system events.
  - Setting ongoing availability and exception dates (time-offs).
- **Secure Architecture:** Role-Based Access Control (RBAC) and Supabase Row Level Security (RLS) ensure data privacy and integrity.

## 💻 Tech Stack

This project is built using a modern, scalable web development stack.

### Frontend
- **React 18** - Core UI Library
- **Vite** - Lightning-fast build tool and development server
- **TypeScript** - For robust type-safe code
- **Tailwind CSS** - Utility-first CSS framework for rapid UI styling
- **shadcn/ui** (& Radix UI Primitives) - Accessible, customizable, and unstyled UI components
- **React Router** - For seamless, role-based client-side routing
- **React Query** - For intelligent server data fetching and caching
- **React Hook Form & Zod** - For robust form handling, schema definition, and validation
- **Lucide React** - For beautiful, lightweight iconography

### Backend (BaaS)
- **Supabase** - An open-source ecosystem providing:
  - **PostgreSQL Database**: Relational database for core data schemas (`profiles`, `sessions`, `bookings`, `history_logs`, etc.).
  - **Authentication**: Secure email/password and role-based auth synced with Postgres via triggers.
  - **Storage Buckets**: For media such as avatars and session images.
  - **Edge Functions / Triggered Webhooks**: For automated server-side logic (e.g., auto-promoting users to clients upon first booking).

## 🚀 Getting Started

If you want to contribute to the code or run the project locally, follow these instructions:

### Prerequisites
- Node.js (v18+)
- npm, yarn, or pnpm
- A Supabase account and project to connect to.

### Installation

1. **Clone the repository:**
   ```sh
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up Environment Variables:**
   You will need to connect the frontend to a Supabase backend project.
   Create a `.env` file in the root directory based on your Supabase dashboard details:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server:**
   ```sh
   npm run dev
   ```
   The application will be available on your localhost (typically port `8080` unless specified otherwise).

## 🛠️ Development Guidelines

- **UI Consistency:** Primarily utilize `shadcn/ui` components and Tailwind utility classes. Adhere to the styling tokens located in `index.css`.
- **User Feedback:** Use the top-left positioned toast notifications (`sonner`) to provide immediate, non-blocking feedback after API calls and CRUD operations.
- **Routing & Modals:** Use unique URL paths for large layouts (e.g., `/admin/sessions/edit/123`). Restrict modals and dialogs tightly to confirmations, alerts, or localized micro-edits. Check user authorization at the routing layer heavily.
