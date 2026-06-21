# Law EdTech Platform — Full Site Spec
**Stack: Vite + React + TS + Tailwind + shadcn/ui · Supabase (Postgres/Auth/Storage/RLS) · Render**

---

## 1. Site Map

```
/                      Home
/subjects              Subjects (browse)
/subjects/:slug        Subject detail (semester/unit breakdown)
/resources             Resources (browse all, filters)
/resources/:id         Resource detail (preview/video/discussion)
/latest                Latest additions feed
/search?q=             Search results
/blog                  Blog index
/blog/:slug            Blog post detail
/about                 About
/contact               Contact
/auth/login            Login
/auth/signup           Signup
/auth/reset            Password reset
/dashboard             User dashboard (bookmarks, progress, account)
/admin                 Admin panel (resources + blog + subjects, role-gated)
/admin/blog/new        Blog post editor
/admin/blog/:id/edit   Blog post editor (existing)
*                      404
```

---

## 2. Global Components (used across pages)

| Component | Notes |
|---|---|
| `Navbar` | Logo, Home/Subjects/Resources/Latest/Blog/About/Contact, search icon→expands inline, auth state (Login button vs. avatar dropdown) |
| `Footer` | Site map links, social, contact, "built for [her name/brand]" credit line |
| `SearchBar` | Typo-tolerant (pg_trgm + tsvector), instant dropdown preview (top 5 results), full results on Enter → `/search` |
| `AuthGate` | Wraps protected routes (`/dashboard`, `/admin`), redirects to `/auth/login` with return URL |
| `Toast` | Success/error feedback (bookmark added, comment posted, upload complete) |
| `LoadingSkeleton` | Used on all data-fetching pages instead of spinner — feels more premium |
| `EmptyState` | For zero-result search, empty bookmarks, no comments yet |
| `SEOHead` | Per-page title/description/OG tags |

---

## 3. Page Specs

### `/` Home
**Purpose:** First impression — premium positioning + fast path into content.
- Hero: Lightfall background (gated by IntersectionObserver + `prefers-reduced-motion`), headline, subhead, dual CTA (Browse Subjects / Sign Up)
- Stats strip: subjects count, resources count, learners count (live from DB counts, not hardcoded — beats lawbench's static numbers)
- Featured sections: "New this week," "Most bookmarked," "Latest blog post" (3 cards)
- Subject quick-grid: top 6-8 subjects as clickable cards with icon
- Testimonial/social proof strip (optional, if she has any)
- Footer

### `/subjects` Subjects
**Purpose:** Browse all subjects (lawbench's core IA).
- Grid of subject cards (icon, name, resource count, short description)
- Filter/sort: alphabetical vs. most-resourced
- Click → `/subjects/:slug`

### `/subjects/:slug` Subject Detail
**Purpose:** Drill into one subject — semester/unit structure (lawbench's actual hierarchy).
- Subject header (name, description)
- Semester tabs → Unit accordion → resource list per unit (type icon, title, quick bookmark button)
- Empty state per unit if no resources yet

### `/resources` Resources
**Purpose:** Flat browse across everything, filterable (lawbench has this as a separate top-level page).
- Filter bar: subject, semester, type (note/bare act/case law/judgment/article/PYQ/presentation/video), sort (newest/most bookmarked)
- Resource card grid: type badge, title, subject tag, bookmark icon, preview thumbnail for video/PDF
- Pagination or infinite scroll

### `/resources/:id` Resource Detail
**Purpose:** Core content consumption page — this is where lawbench's "preview/download/discuss" features live, plus our additions.
- Header: title, type badge, subject/semester/unit breadcrumb, author/uploader
- **PDF resources:** in-browser preview (PDF.js embed) + download button
- **Video resources:** embedded player (YouTube unlisted iframe → swappable to Bunny later), resume position via `progress` table
- Bookmark toggle (writes to `bookmarks` table)
- Tags (from `resource_tags`)
- Discussion thread below (comments, threaded or flat, auth-gated to post)
- "Related resources" rail (same subject/unit)

### `/latest` Latest
**Purpose:** Chronological feed of newest additions across all types (lawbench has this as a nav item).
- Simple reverse-chronological list/grid, same resource card component as `/resources`
- Optional filter by type

### `/search` Search Results
**Purpose:** Full results for a query (lawbench advertises "Powerful Search" but it's unclear if delivered — this is where we beat it).
- Query echoed, result count
- Same filter bar as `/resources`, scoped to the search
- Highlights matched term in title/description
- Empty state with suggestion to browse subjects instead

### `/blog` Blog Index
**Purpose:** Her personal/professional blog — new vs. lawbench, this is a differentiator.
- Featured post (large card, latest)
- Grid below: cover image, title, excerpt, tag, reading time, published date
- Filter by tag
- Clean, restrained typography per the "sleek/elegant" brief — no clutter, generous whitespace

### `/blog/:slug` Blog Post Detail
**Purpose:** Reading experience — this needs to feel editorial, not like a forum post.
- Cover image full-bleed at top
- Constrained content width (~65-75ch), markdown-rendered body
- Author byline, published date, reading time, tags
- Share buttons (copy link / socials)
- Comments section (toggle-able per her Section 8 answer — On/Off per post or sitewide)
- "More from the blog" rail at bottom

### `/about` About
**Purpose:** Mission/vision/values — lawbench's structure, but written in her voice.
- Mission/Vision/Values three-pillar block
- Her story/bio (since it's her platform — personal credibility matters for a law blog+library)
- Stats strip (reused component from Home)

### `/contact` Contact
**Purpose:** Simple contact form.
- Name/email/message fields → writes to a `contact_messages` table or sends via email (Resend/SendGrid free tier)
- Social links

### `/auth/login`, `/auth/signup`, `/auth/reset`
**Purpose:** Supabase Auth UI — Google OAuth + email/password (matches lawbench's flow).
- Login: email/password + "Continue with Google" button
- Signup: same + name field, writes to `profiles` on success
- Reset: email-based reset link flow (Supabase built-in)

### `/dashboard` User Dashboard
**Purpose:** "My account" — lawbench's "personal library" pitch, made real.
- Tabs: **Bookmarks** (saved resources), **In Progress** (videos with saved position), **My Comments**, **Account Settings** (name, avatar, password)

### `/admin` Admin Panel (role-gated, her + any co-curators)
**Purpose:** Where she/you actually manage content — this replaces "admin-curated tagging" from lawbench's pitch with a real interface.
- **Resources tab:** upload new resource (file → Supabase Storage, or video URL), assign subject/semester/unit/type/tags, set draft/published
- **Subjects tab:** create/edit/reorder subjects
- **Blog tab:** list of posts (draft/published), New Post button
- **Messages tab:** view contact form submissions

### `/admin/blog/new`, `/admin/blog/:id/edit` Blog Editor
**Purpose:** Where she actually writes — the feature you just added.
- Title, slug (auto-generated, editable), excerpt, cover image upload
- Tiptap editor (markdown-output) for body
- Tag picker, comments-on/off toggle
- Save Draft / Publish buttons
- Live preview pane (optional, nice-to-have)

### `*` 404
- On-brand illustration/message, links back to Home/Subjects

---

## 4. Lawbench Parity + Improvement Checklist

| Lawbench feature/page | Status here | How we improve on it |
|---|---|---|
| Home (mission/vision/values, stats) | ✅ Built | Live DB-driven stats, not static numbers |
| Subjects (16+ subjects, semester/unit) | ✅ Built | Full drill-down page, not just a list |
| Resources (notes/acts/case law/judgments/articles/PYQs/presentations) | ✅ Built | Unified filterable browse + dedicated detail page per resource |
| Latest | ✅ Built | Same as lawbench, type-filterable |
| "Powerful Search" (claimed, unclear if delivered) | ✅ Built | Actual typo-tolerant ranked search (pg_trgm + tsvector), live dropdown preview |
| Personal library/bookmarking | ✅ Built | Full dashboard tab, not just a save button |
| Offline PDF preview/download | ✅ Built | In-browser PDF.js preview + download |
| Admin-curated tagging | ✅ Built | Real admin panel UI, not implied/manual |
| Per-resource discussion | ✅ Built | Threaded comments, auth-gated |
| About | ✅ Built | Personal bio/credibility angle added |
| Contact | ✅ Built | Same |
| Auth (Google + email/password) | ✅ Built | Same, via Supabase |
| — | ➕ New | **Video lecture streaming** with resume-position tracking |
| — | ➕ New | **Blog** — full CMS-lite with markdown editor, tags, comments toggle |
| — | ➕ New | **Premium animated hero** (Lightfall), accessibility-gated |
| — | ➕ New | **Progress tracking** across video + reading |
| — | ➕ New | Live homepage stats instead of static numbers |

---

## 5. SEO Architecture

**Core decision: SSR/ISR, not pure client-side rendering.**
Confirmed risk: lawbench's own `/resources` page returns an empty "Loading…" shell to a non-JS-executing crawler — exactly the failure mode to avoid. Swap frontend to **Next.js (App Router)** on Vercel free tier (Supabase backend unchanged):
- Public pages (`/`, `/subjects/*`, `/resources/*`, `/blog/*`, `/about`) → SSR or ISR (static, revalidated on content change)
- Private pages (`/dashboard`, `/admin`) → client-rendered, fine since crawlers never need them

**On-page requirements, every public page:**
- Unique `<title>` + meta description generated from DB fields (resource title/subject, blog title/excerpt) — never a repeated template
- JSON-LD structured data: `LearningResource` (resource pages), `BlogPosting` (blog posts), `BreadcrumbList` (all nested pages), `Organization` (sitewide)
- Canonical URL on every page; `/search` results marked non-canonical against filtered `/resources` views
- Auto-generated `sitemap.xml` from DB (subjects + resources + blog posts), regenerated on deploy
- `robots.txt`: disallow `/admin`, `/dashboard`; allow everything else

**Performance (Core Web Vitals — directly affects ranking, also IS the premium feel):**
- Hero text renders immediately; Lightfall canvas loads independently behind it (no LCP blocking)
- Next.js `<Image>` for all images — responsive sizing, lazy below fold, priority on hero
- `font-display: swap` on Fraunces/Inter/IBM Plex Mono to avoid invisible-text flash

**Content/keyword strategy:**
- Resource titles/descriptions mirror real student search phrasing ("[Act] notes for [semester]," not generic labels)
- Blog posts internally link to 2-3 related resources; resource pages surface related resources — compounds both SEO and session time

**Day-one off-page steps:** verify domain in Google Search Console + Bing Webmaster Tools, submit sitemap manually, link the domain from her existing social/LinkedIn for early trust signal.

---

## 6. Design System (locked tokens — every page builds against this)

| Token | Value | Usage |
|---|---|---|
| Ink | `#14171F` | Dark backgrounds (hero, nav) |
| Parchment | `#F6F3EC` | Light backgrounds (blog reading, resource detail) |
| Brass | `#B8975A` | Single accent — Lightfall glow, active link state, signature citation styling. Never a fill, never repeated decoratively |
| Deep Forest | `#1F3A33` | Secondary — tags, badges |
| Slate | `#5B6470` | Body text on light backgrounds |

- **Display type**: Fraunces — headlines only, used sparingly
- **Body type**: Inter — tuned type scale, optimized for long-form reading
- **Citation/metadata type**: IBM Plex Mono — signature device. Subject/semester/unit breadcrumbs and tags render monospaced, e.g. `LAW · SEM 4 · UNIT 2`, echoing real legal citation format. This is the one distinctive, on-brief visual signature — not decoration, true to the subject matter.
- **Motion**: one orchestrated hero load sequence; scroll-triggered reveals for stats. No scattered hover effects elsewhere. `prefers-reduced-motion` respected everywhere, especially the Lightfall hero.
- **Layout**: capped content width (~75ch) for reading contexts, hairline dividers preferred over boxed cards, generous vertical whitespace between sections.
- **Rule for every future page**: if a component reads as a generic dashboard/SaaS default (numbered step markers, boxed stat cards with icon-in-circle, etc.), revise it against this token system before building — restraint and the mono-citation device are what carry "premium," not added decoration.

### Motion component decisions (locked — do not re-add rejected items mid-build)

| Component | Decision | Where / why |
|---|---|---|
| Lightfall (hero) | ✅ Use | Tuned to Ink/Brass/Forest palette (config below), gated by IntersectionObserver + `prefers-reduced-motion` via `paused` prop |
| Scroll Reveal | ✅ Use | Stats strip, section entrances |
| Gradual Blur | ✅ Use | Hero → content transition only |
| Magnetism | ✅ Use, subtle only | Primary CTA buttons, few px of cursor-follow max |
| Staggered Menu | ✅ Use | Mobile nav open-state only |
| Backdrop blur (glass, no distortion) | ✅ Use | Sticky nav background only |
| Border Glow | ⚠️ Limited | Primary CTA hover only, brass-tinted, very subtle. Not on cards |
| Magic Bento | ❌ Reject | Decorative grid dressing fights scannability on `/subjects`, `/resources` |
| Spotlight | ❌ Reject | Same reason — distracting on study-resource browse pages |
| Grid Scan | ❌ Reject | Cyber/data aesthetic — contradicts premium-law brief outright |
| Pill Nav | ❌ Reject | Reads as AI-startup SaaS nav, wrong brand register. Use wordmark + thin underline active-state instead |
| FlowingMenu | ❌ Reject | Built for portfolio/agency image showcases, no mapping to this content |
| Antigravity (floating element) | ❌ Reject | Redundant with Lightfall's job, risks competing signature elements |
| Scroll Stack | ❌ Reject | Same reason — one signature motion idea, not several |

**Lightfall production config:**
```jsx
<Lightfall
  colors={['#B8975A', '#F6F3EC', '#3A5C50']}
  backgroundColor="#1F1A12"
  speed={0.35}
  streakCount={4}
  streakWidth={0.8}
  streakLength={1.4}
  glow={0.7}
  density={0.4}
  twinkle={0.4}
  zoom={2.5}
  backgroundGlow={0.5}
  opacity={0.85}
  mouseInteraction={true}
  mouseStrength={0.3}
  mouseRadius={0.5}
  mouseDampening={0.25}
  paused={!inView || reducedMotion}
/>
```

---

## 7. Build Order Recommendation

1. Supabase schema + RLS (subjects, resources, tags, profiles, bookmarks, comments, progress, blog_posts, blog_tags)
2. Auth flow (login/signup/reset) + protected route wrapper
3. Subjects → Subject Detail → Resources → Resource Detail (core library, this is the spine)
4. Search (once enough resources exist to test against)
5. Dashboard (bookmarks/progress/comments surface)
6. Blog (index, detail, editor) — separable, can run in parallel once schema's in
7. Admin panel — last, since it's internal tooling, not user-facing polish
8. Home hero + About/Contact — final polish pass once content exists to showcase

---

## 8. Pre-Build Checklist (decide these now, not mid-build)

**Legal pages — genuinely missing from the site map, and notably ironic to skip on a law platform**
- `/privacy` and `/terms` — required the moment you have user accounts/auth, doubly so under India's DPDP Act 2023. Doesn't need to be elaborate at launch, but must exist and be linked from the footer + signup flow.
- A line in `/admin` upload flow reminding her: only upload content she has rights to or that's public domain (Indian court judgments/bare acts are public domain; third-party notes/articles are not — flag this before she or contributors bulk-upload borrowed material).

**Content seeding — how does the first batch of resources actually get in?**
- One-by-one admin form entry is fine for early days but painful past ~50 resources. Worth a CSV bulk-import path in `/admin` (subject, semester, unit, type, title, file URL columns) for the initial content dump, even if the polished single-resource form is the long-term path.

**Abuse/spam protection — needed before public launch, not after**
- Contact form + comments: honeypot field or a free tier of hCaptcha/Cloudflare Turnstile — comment sections on public sites get spam-bot'd fast once indexed
- Signup: Supabase has basic rate-limiting built in, but confirm email verification is on before allowing comment posting

**Analytics — separate from SEO, but you'll want it from day one**
- Plausible or GA4 wired in from launch, not retrofitted — you want a baseline before the SEO work starts paying off, otherwise you can't tell what's working

**Asset checklist (easy to forget, blocks launch if missing)**
- Favicon set, OG/social preview image (used by the per-page SEO meta tags already spec'd), logo in both light/dark variants for the nav

**Environment/config — hand this list to Antigravity explicitly so it doesn't guess**
- Supabase URL + anon key, Resend/SendGrid API key (contact form), YouTube/Bunny config (video layer), analytics ID — keep these as `.env` placeholders the agent scaffolds for, not hardcoded

**How to actually hand this to Antigravity**
Don't paste the whole doc as one giant prompt — follow the Build Order in Section 7 as your prompt sequence instead. Step 1 prompt: "Set up the Supabase schema and RLS policies from Section 3/4 of this spec." Once that's confirmed working, move to auth, then the core library pages, etc. Feeding it one build-order step at a time gives you a working checkpoint to test before the next layer goes on top — much easier to catch a wrong assumption early than after 8 pages are built on a bad schema.
