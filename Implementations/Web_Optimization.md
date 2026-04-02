# Web Optimization Strategy: SEO, AEO, & GEO

**Last Updated:** 2026-04-02  
**Status:** IMPLEMENTATION IN PROGRESS  
**Target URL:** `https://alexmoreno.space`

---

## 1. SEO (Search Engine Optimization)
**Focus:** Traditional keyword-based discovery via Google, Bing, and other search engines.

### Technical SEO
- [x] **Sitemap:** `public/sitemap.xml` configured with absolute URLs and `lastmod` dates.
- [x] **Robots.txt:** `public/robots.txt` configured to allow public content, block private routes (`/admin`, `/user`, `/profile`, `/success`).
- [x] **Canonical Links:** `<link rel="canonical">` injected on every page via the `<SEO>` component.
- [x] **Meta Robots:** `index, follow` for public pages; `noindex, nofollow` for private pages (Login, Success, NotFound).
- [x] **OG Image Dimensions:** `og:image:width` and `og:image:height` specified (1200×630) for faster social previews.
- [x] **`og:site_name`:** Set to "Alex Moreno — Strength & Conditioning" for brand consistency across social cards.
- [x] **`og:locale`:** Set to `en_US`.
- [x] **HTML lang attribute:** Set to `en` via Helmet.
- [ ] **Performance:** Achieve 90+ Lighthouse score on mobile to maintain ranking.
- [ ] **Image Optimization:** Convert hero/trust images from external Unsplash URLs to locally-hosted WebP for faster load times.

### On-Page SEO
- [x] **Keywords integrated:** "Strength training Barcelona", "Personal trainer for professionals", "Conditioning coaching Spain", "Alex Moreno".
- [x] **Unique meta descriptions:** Each public page (`/`, `/courses`, `/login`) has a distinct description.
- [x] **Heading hierarchy:** Single `<h1>` per page, proper H2/H3 nesting.
- [x] **Image alt text:** Trust section images have descriptive alt text (e.g., "Alex Moreno, Strength & Conditioning Coach").
- [x] **Semantic HTML:** `<section>`, `<header>`, `<footer>`, `<main>`, `<article>` used throughout.

### Per-Page Metadata Coverage

| Page | `<SEO>` | `<title>` | Unique Description | Canonical | noindex |
|---|---|---|---|---|---|
| `/` (Index) | ✅ | ✅ | ✅ | ✅ | — |
| `/courses` | ✅ | ✅ | ✅ | ✅ | — |
| `/login` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/success` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `404` (NotFound) | ✅ | ✅ | ✅ | — | ✅ |
| `/admin/*` | — | — | — | — | N/A (behind auth) |
| `/user` | — | — | — | — | N/A (behind auth) |
| `/profile` | — | — | — | — | N/A (behind auth) |

---

## 2. AEO (Answer Engine Optimization)
**Focus:** Being the directly cited source for queries like *"Who is the best trainer in Barcelona?"*

### JSON-LD Structured Data (In-Code)
- [x] **`HealthAndBeautyBusiness`** schema — Full business entity with address, geo coordinates, opening hours, price range, and area served.
- [x] **`Person`** schema — Alex Moreno entity with job title, expertise areas (`knowsAbout`), and credentials. (Critical E-A-T signal.)
- [x] **`WebSite`** schema — Site-level entity for sitelinks and search targeting.
- [x] **`Service` + `Offer`** schema — 12-Week Transformation Plan with pricing, availability, and provider linkage.
- [x] **`FAQPage`** schema (7 questions) — Targets high-value Barcelona fitness queries.
- [x] **`Product` + `Offer`** schema on `/courses` — Stripe-integrated plan with pricing.

### FAQ Questions Targeted for AEO

| # | Question | Target Query |
|---|---|---|
| 1 | What does the 12-Week Transformation Plan include? | "transformation plan personal training" |
| 2 | Where do training sessions take place in Barcelona? | "outdoor training barcelona" |
| 3 | Are these sessions suitable for beginners? | "beginner personal training barcelona" |
| 4 | How often should I train per week? | "how many times train per week" |
| 5 | How much does a personal trainer cost in Barcelona? | "personal trainer cost barcelona" |
| 6 | What qualifications does Alex Moreno have? | "alex moreno coach credentials" |
| 7 | How long is each training session? | "how long personal training session" |

### Content Signals
- [x] **Expert attribution:** "Answers provided by Alex Moreno, certified Strength & Conditioning Coach with 10+ years of experience in Barcelona" added below FAQ section.
- [x] **Contextual density:** "Alex Moreno" name explicitly included in FAQ answers (not just "we" or "our") so AI models can attribute facts to the entity.

---

## 3. GEO (Generative Engine Optimization)
**Focus:** Ensuring ChatGPT, Gemini, Claude, and Perplexity accurately *understand and cite* Alex Moreno's services.

### Bot Access (robots.txt)
- [x] **GPTBot** — Explicitly allowed.
- [x] **Google-Extended** — Explicitly allowed.
- [x] **CCBot** — Explicitly allowed (Common Crawl, used by many AI training sets).
- [x] **anthropic-ai** — Explicitly allowed.
- [x] **PerplexityBot** — Explicitly allowed.
- [x] **Bytespider** — Explicitly allowed (ByteDance/TikTok search).

### Semantic HTML for Chunking
- [x] **`<section>` elements** — Each content block is wrapped in a semantic section with `id` and `aria-labelledby` attributes.
- [x] **`<header>` elements** — Used in FAQ section for proper content delineation.
- [x] **`<footer>` element** — Semantic footer with business attribution.
- [x] **`<main>` element** — Wraps primary content on Index and Courses pages.

### Content Strategy
- [x] **Citation-ready anchors:** Descriptive alt text on all images (e.g., "Clean modern training studio", "Outdoor training in Barcelona park").
- [ ] **Long-form content:** Consider adding a `/about` page with Alex Moreno's full biography for deeper AI understanding.
- [ ] **Blog/Articles:** Consider adding a `/blog` route for fresh, indexable content about training philosophy.

---

## 📅 Implementation Roadmap

### Phase 1: Technical Foundations ✅ COMPLETE
- [x] Enhanced `<SEO>` component with canonical, robots, locale, image dimensions.
- [x] Added `<SEO>` to all pages (Login, Success, NotFound).
- [x] Updated `robots.txt` with AI crawler allowances.
- [x] Updated `sitemap.xml` with all public pages and current dates.

### Phase 2: JSON-LD & Structured Data ✅ COMPLETE
- [x] Enriched homepage with 5 schemas: HealthAndBeautyBusiness, Person, WebSite, Service, FAQPage.
- [x] Courses page has Product + Offer schema.
- [x] FAQ expanded to 7 questions targeting high-value search queries.

### Phase 3: Content Refinement ✅ COMPLETE
- [x] FAQ answers rewritten for entity attribution (first-person → "Alex Moreno").
- [x] Expert E-A-T attribution added below FAQ section.
- [x] Trust section has descriptive image alt text.

### Phase 4: Future Enhancements
- [ ] Add `/about` page with full coach biography.
- [ ] Convert external Unsplash images to locally-hosted optimized assets.
- [ ] Run Lighthouse audit and optimize for 90+ mobile score.
- [ ] Add `BreadcrumbList` schema for multi-page navigation.
- [ ] Submit sitemap to Google Search Console and Bing Webmaster Tools.

---

## 🔍 Verification Checklist

After deployment, validate the structured data and SEO setup:

- [ ] **Google Rich Results Test:** Paste `https://alexmoreno.space` → Verify FAQPage, LocalBusiness, Person schemas are detected.
- [ ] **Schema.org Validator:** Verify all JSON-LD blocks pass validation.
- [ ] **Perplexity Audit:** Ask *"Who is Alex Moreno strength coach Barcelona?"* and check if the site is cited.
- [ ] **ChatGPT Audit:** Ask *"What services does alexmoreno.space offer?"* and verify accuracy.
- [ ] **Google Search Console:** Submit sitemap and monitor crawl coverage.
- [ ] **Social Preview Test:** Share URL on LinkedIn/Twitter and verify OG preview renders correctly.

---

> [!TIP]
> Run a "Perplexity Audit" periodically by asking: *"Summarize Alex Moreno's services in Barcelona from alexmoreno.space"* and adjusting content based on missed key points.
