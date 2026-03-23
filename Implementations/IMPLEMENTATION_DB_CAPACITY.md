# Implementation Plan: Custom Session Capacity and Descriptions

Enhance the session and session type management with `capacity` and `description` fields to better manage event availability and information.

## Objective
The primary goal is to add a `capacity` field to session templates (session types) and a `description` field to scheduled sessions, ensuring that data flows seamlessly between the two when scheduling new events.

---

## Technical Requirements
- **Database Schema**:
    - Update `session_types` table with a `capacity` column.
    - Verify `description` column existence in the `sessions` table.
- **Frontend Management**:
    - Add UI fields to the session type creation/editing modals.
    - Update session type list tables with the new column.
    - Add UI fields to the session scheduling modals.
    - Implement auto-filling of capacity from templates to sessions.
    - Update scheduled session tables with the description column.

---

## 📅 Progress Checklist

### 🏗 Phase 1: Database Setup
- [x] Add `capacity` column to `session_types` table (Integer, default 10).
- [x] Verify `description` column existence in `sessions` table (Text).

### 📝 Phase 2: Session Type Management
- [x] Update `SessionTypeManager.tsx` form state to include `capacity`.
- [x] Add `capacity` input field to "Add/Edit Template" modal.
- [x] Update `handleSave` in `SessionTypeManager.tsx` to persist `capacity`.
- [x] Add "Capacity" column to the session types table UI.

### 📅 Phase 3: Session Scheduling Enhancements
- [x] Update `SessionManager.tsx` form state to include `description`.
- [x] Add `description` textarea field to "Schedule/Edit Session" modal.
- [x] Implement logic to auto-fill `max_slots` from the selected template's `capacity`.
- [x] Implement logic to auto-fill `price` from the selected template's `base_price`.
- [x] Update `handleSave` in `SessionManager.tsx` to handle "none" templates and persist `description`.

### 🖼 Phase 4: UI/UX Refinement
- [x] Refactor the card-based session list into a structured `Table` component.
- [x] Add a "Description" column to the scheduled sessions table (after session name).
- [x] Ensure the table is responsive and matches the premium design.

### 👥 Phase 5: Client List & Capacity Transparency
- [x] Update public `Schedule.tsx` to calculate remaining spots dynamically (Max Slots - Bookings).
- [x] Add a "Booked" column in the Admin `SessionManager` table.
- [x] Implement an "Attendees List" modal in the Admin UI to view clients booked for each session.

---

## 🛠 Branch & Issue Metadata
- **GitHub Issue**: [#4](https://github.com/ariotmr/Lovable-Cursor-Alex-Moreno-Site/issues/4)
- **Feature Branch**: `feat/issue-4-add-capacity-and-description`
- **Work Directory**: `Lovable-Cursor-Alex-Moreno-Site`
