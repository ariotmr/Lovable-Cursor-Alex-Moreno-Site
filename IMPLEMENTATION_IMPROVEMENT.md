## Frontend Improvement Implementation Plan

This document tracks the implementation of frontend improvements for the site. It is structured in phases so we can iterate without getting overwhelmed. Check items off as they are completed.

---

### Changes Checklist (Implemented)

- [x] **Schedule section redesign**
  - [x] Replace dense schedule layout with a cleaner, easy-to-scan section header + content area.
  - [x] Add a **Grid** view for weekly browsing.
  - [x] Add a **Calendar** view with date selection and session list for that day.
  - [x] Align “focus” chips to the design system palette (primary/accent/neutrals) instead of extra colors.

## Phase 1 – Foundations (Structure, Navigation, Narrative)

- [ ] **Clarify target audience and goal**
  - [ ] Decide the primary audience for the site (e.g. hiring managers, clients, collaborators).
  - [ ] Define the main goal of the site (e.g. get portfolio views, receive contact requests, show personality).
  - [ ] Write a short one-sentence summary of what success looks like for this site.

- [ ] **Review current information architecture**
  - [ ] List all current sections (e.g. Hero, About, Projects, Skills, Contact, etc.).
  - [ ] Decide which sections are essential and which can be removed or merged.
  - [ ] Define a simple top-level navigation (e.g. Home, About, Work, Contact).

- [ ] **Plan section purposes and key messages**
  - [ ] For each section, write down its primary purpose in one sentence.
  - [ ] For each section, list the 2–3 key points a visitor should remember.
  - [ ] Identify any missing sections needed to tell a coherent story (e.g. “Highlights”, “Timeline”, “Stack”).

---

## Phase 2 – Hero Section & First Impression

- [ ] **Hero content strategy**
  - [ ] Draft a clear, concise headline that states who you are and what you do.
  - [ ] Write a supporting subheadline that adds context (what makes you different or what you focus on).
  - [ ] Decide on a single primary call-to-action (CTA) (e.g. “View my work”, “Get in touch”).

- [ ] **Hero visual direction**
  - [ ] Choose whether the hero will feature a photo, illustration, or abstract visual.
  - [ ] Decide on layout pattern (e.g. text left / image right, centered text, etc.).
  - [ ] Determine any motion/interaction elements (e.g. subtle scroll animation, hover on CTA).

- [ ] **Hero UX details**
  - [ ] Ensure the primary CTA is visually distinct (button style, color, size).
  - [ ] Decide on secondary actions, if any (e.g. “Download CV”, “See GitHub”).
  - [ ] Specify responsive behavior (how hero should adapt on mobile vs desktop).

---

## Phase 3 – Visual Design System (Colors, Typography, Spacing)

### Phase 3 – Implementation Checklist

- [x] **Color palette**
  - [x] Choose 1 primary brand color.
  - [x] Choose 1 accent color (for highlights, small elements).
  - [x] Choose 1–2 neutral colors for backgrounds and surfaces.
  - [x] Define use rules (e.g. primary for CTAs, accent for tags, neutral for backgrounds).
  - [ ] Audit existing UI elements to remove or replace “extra” colors that don’t fit the palette.

- [x] **Typography**
  - [x] Select a heading font (for titles and section headings).
  - [x] Select a body font prioritizing readability.
  - [x] Define font sizes and line-heights for key text styles (hero, H1–H3, body, captions).
  - [ ] Decide alignment rules (e.g. left-align for most content, center-align only in specific sections).

- [x] **Spacing and layout rhythm**
  - [x] Define a base spacing unit (e.g. 4px or 8px).
  - [x] Specify vertical spacing between sections and components.
  - [x] Standardize padding for cards, buttons, and containers.
  - [x] Decide on border radius defaults for cards, buttons, and avatars.

---

## Phase 3 – Visual Design System (Colors, Typography, Spacing)

- [ ] **Color palette**
  - [ ] Choose 1 primary brand color.
  - [ ] Choose 1 accent color (for highlights, small elements).
  - [ ] Choose 1–2 neutral colors for backgrounds and surfaces.
  - [ ] Define use rules (e.g. primary for CTAs, accent for tags, neutral for backgrounds).
  - [ ] Audit existing UI elements to remove or replace “extra” colors that don’t fit the palette.

- [ ] **Typography**
  - [ ] Select a heading font (for titles and section headings).
  - [ ] Select a body font prioritizing readability.
  - [ ] Define font sizes and line-heights for key text styles (hero, H1–H3, body, captions).
  - [ ] Decide alignment rules (e.g. left-align for most content, center-align only in specific sections).

- [ ] **Spacing and layout rhythm**
  - [ ] Define a base spacing unit (e.g. 4px or 8px).
  - [ ] Specify vertical spacing between sections and components.
  - [ ] Standardize padding for cards, buttons, and containers.
  - [ ] Decide on border radius defaults for cards, buttons, and avatars.

---

## Phase 4 – Navigation & Layout

- [ ] **Header and navigation**
  - [ ] Decide which items appear in the top navigation.
  - [ ] Decide whether the header should be sticky on scroll.
  - [ ] Define visual states: default, hover, active, and on-scroll background style.

- [ ] **Section layout patterns**
  - [ ] Choose 2–3 reusable layout patterns (e.g. two-column, grid of cards, full-width hero).
  - [ ] Map each existing section to one of the layout patterns.
  - [ ] Plan background treatments for each section (solid, gradient, subtle pattern, or tinted background).

- [ ] **Responsiveness**
  - [ ] Define the breakpoints we care about (e.g. mobile, tablet, desktop).
  - [ ] For each section, note any layout changes needed at each breakpoint.
  - [ ] Plan how navigation behaves on small screens (e.g. hamburger menu, collapsed navigation).

---

## Phase 5 – Projects / Portfolio Presentation

- [ ] **Project selection and hierarchy**
  - [ ] Choose 1–3 “hero” projects to feature more prominently.
  - [ ] Decide how many total projects should be visible on the main page.
  - [ ] Determine criteria for which projects to include (e.g. recent, impactful, showcases specific skills).

- [ ] **Project storytelling structure**
  - [ ] Define a standard structure for each project (Problem → Approach → Outcome).
  - [ ] For each project, write a short one-line summary.
  - [ ] For each project, draft bullet points for problem, your role/approach, and results/impact.
  - [ ] Decide which metrics or concrete outcomes to highlight (e.g. performance improvements, user impact).

- [ ] **Project card design**
  - [ ] Decide what appears on the card: image/thumbnail, title, short description, tags, CTA.
  - [ ] Define tag categories (e.g. type of project, tech stack, role).
  - [ ] Decide interactions (e.g. hover effects, click to open detail, external link).
  - [ ] Determine layout for “hero” projects vs regular projects (e.g. larger cards, featured section).

---

## Phase 6 – About Section & Personal Brand

- [ ] **Personal narrative**
  - [ ] Write a short paragraph that tells your story (background, focus, what you care about).
  - [ ] Identify 2–3 themes (e.g. craftsmanship, experimentation, user empathy) you want to emphasize.
  - [ ] Decide on 1–2 sentences that describe how you like to work or collaborate.

- [ ] **Visual identity**
  - [ ] Choose or update your photo/portrait to match the site’s visual style.
  - [ ] Decide on how the image is displayed (e.g. circle avatar, card with subtle frame, full-width).
  - [ ] Consider adding simple decorative elements that align with your brand (e.g. icons, shapes).

- [ ] **Quick facts and highlights**
  - [ ] List key facts (location, languages, time zone, current role/status).
  - [ ] Decide on 3–5 “highlight” bullets (e.g. years of experience, notable collaboration, key strengths).
  - [ ] Plan a small “What I’m open to” list (e.g. freelance, full-time, collaborations).

---

## Phase 7 – Contact & Calls to Action

- [ ] **Primary CTA strategy**
  - [ ] Define the single primary action you want visitors to take (e.g. email you, view portfolio, schedule a call).
  - [ ] Decide where the primary CTA appears (hero, mid-page, footer).
  - [ ] Ensure the primary CTA text is specific and action-oriented.

- [ ] **Contact methods**
  - [ ] Decide which channels to show (email, LinkedIn, GitHub, other).
  - [ ] Determine if you want a contact form at all or just links/buttons.
  - [ ] Write a short “When to contact me” statement that sets expectations.

- [ ] **Footer and final impression**
  - [ ] Plan footer content (navigation links, social links, small note about the site).
  - [ ] Decide if you want a final call-to-action section before the footer.
  - [ ] Add any small personal touches (e.g. a short motto or a fun fact).

---

## Phase 8 – Trust, Social Proof & Extras

- [ ] **Social proof**
  - [ ] List any companies, clients, or communities you can reference (logos or names).
  - [ ] Identify any testimonials or quotes you could request or already have.
  - [ ] Decide how and where to place social proof (e.g. “Worked with”, testimonial slider, quotes in cards).

- [ ] **Skill signaling**
  - [ ] Decide whether to include a skills/stack section or integrate skills into projects.
  - [ ] Prioritize skills that align with your desired opportunities.
  - [ ] Group skills into meaningful categories (e.g. Frontend, Tooling, Design, Workflow).

- [ ] **Micro-interactions and polish**
  - [ ] List any hover effects, transitions, and animations you want in the final design.
  - [ ] Decide on scroll behavior (e.g. section reveal, smooth scroll, scroll-to-top button).
  - [ ] Plan accessibility basics (color contrast, focus states, readable font sizes).

---

## Phase 9 – Review & Iteration

- [ ] **Internal review**
  - [ ] Walk through the site as if you were a first-time visitor and note any friction points.
  - [ ] Check whether each section is clearly communicating its purpose and key message.
  - [ ] Validate that the visual style feels consistent across all pages and sections.

- [ ] **External feedback**
  - [ ] Share the site with 2–3 people in your target audience.
  - [ ] Collect feedback on clarity: do they quickly understand who you are and what you do?
  - [ ] Collect feedback on visual appeal and perceived professionalism.

- [ ] **Iteration plan**
  - [ ] Prioritize feedback items into “must fix soon” vs “nice to have”.
  - [ ] Add a short backlog of future improvements (e.g. new sections, more animations, content updates).
  - [ ] Schedule a regular cadence for small updates (e.g. monthly content refresh).

