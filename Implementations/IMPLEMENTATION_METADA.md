# Implementation Plan: Metadata Updates

## Objective
To replace any generic or Lovable-based preview metadata with custom, robust metadata specifically tailored for Alex Moreno's Strength & Conditioning Coach website. This includes capturing a high-fidelity image of the actual website to use across social media platforms (Open Graph and Twitter Cards) and fleshing out SEO attributes.

## 1. Asset Generation (Website Snapshot)
Instead of a generic preview, we will capture an explicit screenshot of the site’s hero section to serve as the baseline Open Graph and Twitter card image.
- [x] **Action**: Run the local development server.
- [x] **Action**: Use the browser subagent to capture a clean, professional screenshot of the site (at standard 1200x630 resolution for optimal social media previews).
- [x] **Action**: Save this screenshot in the `public/` directory (e.g., `public/og-preview.png`).

## 2. Open Graph (og:) Metadata Updates
We will expand the current Open Graph tags in `index.html` to be fully compliant and visually appealing when shared on LinkedIn, Facebook, Slack, etc.
- [x] `og:title`: "Alex Moreno — Strength Training Barcelona"
- [x] `og:description`: "Structured personal training for busy professionals. Indoor studio and outdoor sessions in Barcelona."
- [x] `og:type`: "website"
- [ ] `og:url`: Add the canonical absolute URL of the deployed application (awaiting your confirmation on domain name).
- [x] `og:image`: Add the path referencing the new website snapshot (`og-preview.png`).
- [x] `og:image:width` / `og:image:height`: Specify `1200` and `630` for faster initial rendering speeds.

## 3. Twitter Card Metadata
We will add specialized tags that dictate how the link displays on X (formerly Twitter).
- [x] `twitter:card`: "summary_large_image"
- [x] `twitter:title`: "Alex Moreno — Strength Training Barcelona"
- [x] `twitter:description`: "Structured personal training for busy professionals. Indoor studio and outdoor sessions in Barcelona."
- [x] `twitter:image`: Path to the same `og-preview.png`.

## 4. Standard Document Metadata
These provide a fallback and dictate regular search engine behaviors.
- [ ] **Canonical Link**: Add `<link rel="canonical" href="[PRODUCTION_URL]" />` to consolidate SEO (awaiting URL).
- [x] **Theme Color**: Added `<meta name="theme-color" content="#ffffff" />`.
- [ ] **Favicon**: Verify or improve `/favicon.ico` and consider adding a `.png` format Apple Touch Icon for better mobile saving.

## Next Steps
- Provide the canonical production URL for this website so the standard URL structure can be locked in for search rankings (`og:url` and `<link rel="canonical" />`).
- Confirm if an Apple Touch Icon PNG is required for mobile.
