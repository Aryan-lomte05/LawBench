# Designer Document — Law EdTech Platform
## Premium Visual System & Page-by-Page Implementation Guide
### Reference tier: Quinn Emanuel (Interactive Media Awards Best-in-Class, 496/500), Bick Law (Webby Award nominee), Allen & Overy, Baker McKenzie, MasterClass, Brilliant.org

---

## 0. North Star Design Principle

The single sentence that governs every decision in this document:

> **This is the library of a serious lawyer — not a classroom, not a dashboard, not a SaaS product.**

Every time a component feels generic, ask: does this belong in a serious lawyer's private library, or in a software product? The answer determines everything. Premium here is not about decoration. It is about the *confidence* of not needing decoration.

Reference feel: Quinn Emanuel's website reads like a firm that has never lost a case and knows it. MasterClass reads like a film, not an app. Allen & Overy's thought-leadership hub reads like a journal, not a blog. We are building the intersection of all three — for students who want to feel like they are training to join that world.

---

## 1. Color System

### Base Palette (locked — do not add or substitute)

| Token Name | Hex | Usage Rule |
|---|---|---|
| `--ink` | `#14171F` | Primary dark background: hero, navbar, footers, dark-mode surfaces |
| `--ink-soft` | `#1C2029` | Elevated dark surface: cards on dark bg, sidebars, code blocks |
| `--ink-border` | `#2A2E3A` | Hairline borders on dark surfaces |
| `--parchment` | `#F6F3EC` | Primary light background: reading contexts, blog, resource detail |
| `--parchment-warm` | `#EDE8DD` | Slightly deeper warm: section dividers on light pages, hover states |
| `--parchment-border` | `#DDD7C9` | Hairline borders on light surfaces |
| `--brass` | `#B8975A` | THE single accent: active states, primary CTA, Lightfall glow config, citation mono styling, one decorative device per page maximum |
| `--brass-muted` | `#9A7D47` | Brass at lower luminosity: used for hover states on brass elements only |
| `--forest` | `#1F3A33` | Secondary: content-type badges, subject tags, category chips |
| `--forest-light` | `#2D5246` | Forest hover state |
| `--slate` | `#5B6470` | Body text on light backgrounds, meta text, timestamps, captions |
| `--slate-light` | `#8A949E` | Placeholder text, disabled states, very secondary labels |
| `--chalk` | `#F9F8F5` | Pure near-white: used only for text on dark backgrounds, never as a background itself |

### Color Application Rules (non-negotiable)

1. Brass is used ONCE per page as the primary accent. If it appears in the nav active state, it does not also appear in a CTA button AND a border AND a tag. Pick the hierarchy. The CTA wins, everything else defers.
2. Never use pure `#000000` or pure `#FFFFFF` anywhere. `--ink` is black. `--chalk` is white. This prevents the harsh, cheap look that makes sites feel mass-produced.
3. Dark-on-parchment is the reading default. Every resource detail page, every blog post, every note content view renders on `--parchment` with `--ink` text. Dark mode is the homepage and marketing shell only. This is the MasterClass move — cinematic dark shell, editorial warm interior.
4. Forest tags do not appear on dark (`--ink`) backgrounds. Use a semi-transparent `--chalk` at `0.08` opacity as the chip background instead, forest text on parchment only.
5. No gradients except inside the Lightfall canvas. Gradients are the first signal of a non-premium interface.

---

## 2. Typography System

### Typeface Stack

```css
/* Display — headlines, hero, section titles, blog post titles */
font-family: 'Fraunces', Georgia, serif;
/* Fraunces is a variable optical-size serif with genuine personality —
   not Playfair (overused), not Garamond (too classic), not Merriweather (too editorial-bland).
   It has the weight of legal authority without the staleness of traditional law typography. */

/* Body — everything the user reads at length */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
/* Inter at carefully tuned settings — see scale below.
   Do NOT use the browser default Inter sizing. Use the optical size settings below. */

/* Citation / Metadata — the signature device */
font-family: 'IBM Plex Mono', 'Courier New', monospace;
/* Used ONLY for: breadcrumbs, subject/unit/semester labels, resource type badges,
   content type tags, case citation references, timestamps.
   This is the one design move that makes the platform feel made for law —
   legal references look like legal references, not generic chips. */
```

### Type Scale

```css
/* DISPLAY */
--text-display-xl: clamp(52px, 7vw, 96px);   /* Hero headline only */
--text-display-lg: clamp(38px, 5vw, 64px);   /* Page-level section heroes */
--text-display-md: clamp(28px, 3.5vw, 44px); /* Section titles, blog post headings */
--text-display-sm: clamp(22px, 2.5vw, 32px); /* Card titles, subsection heads */

/* BODY */
--text-body-xl: 20px;  /* Blog post lead paragraph, intro copy */
--text-body-lg: 17px;  /* Primary body, notes content, resource descriptions */
--text-body-md: 15px;  /* Secondary body, card descriptions, form labels */
--text-body-sm: 13px;  /* Captions, helper text, footnotes */

/* MONO (IBM Plex Mono) */
--text-mono-md: 12px;  /* Breadcrumbs, badges, type labels */
--text-mono-sm: 11px;  /* Timestamp, reading time, very fine metadata */

/* All mono text: letter-spacing: 0.06em; text-transform: uppercase; */
```

### Line Height & Measure

```css
/* Reading contexts (blog body, notes content) */
line-height: 1.75;
max-width: 68ch; /* This is non-negotiable. Lines longer than 75ch cause eye fatigue.
                    Allen & Overy's thought-leadership articles and MasterClass lesson
                    transcripts both constrain to this range. */

/* Display/headline */
line-height: 1.1;
letter-spacing: -0.02em; /* Tight tracking on large display type — industry standard for premium */

/* Body (non-reading context: cards, nav, labels) */
line-height: 1.5;

/* Mono metadata */
line-height: 1.4;
letter-spacing: 0.06em;
```

### Font Weight Usage

```
Fraunces: 300 (light, used for large decorative display only), 400 (body in serif contexts), 600 (section titles), 700 (hero headline)
Inter: 400 (body), 500 (labels, nav items, card titles), 600 (CTA buttons, strong emphasis), 700 (NEVER — too heavy for body contexts)
IBM Plex Mono: 400 (all metadata uses), 500 (active badge only)
```

---

## 3. Spacing System

Based on a 4px base unit. Every spacing value in the entire UI is a multiple of 4.

```css
--space-1:  4px;   /* Icon padding, tight internal gaps */
--space-2:  8px;   /* Inline element spacing, chip padding */
--space-3:  12px;  /* Small internal card padding */
--space-4:  16px;  /* Standard element gap, input padding */
--space-5:  20px;  /* Medium gap */
--space-6:  24px;  /* Card padding, section sub-element gap */
--space-8:  32px;  /* Card-to-card gap, form group spacing */
--space-10: 40px;  /* Section component vertical spacing */
--space-12: 48px;  /* Large component spacing */
--space-16: 64px;  /* Section padding top/bottom (mobile) */
--space-20: 80px;  /* Section padding top/bottom (desktop) */
--space-24: 96px;  /* Hero section padding */
--space-32: 128px; /* Generous hero breathing room */
```

### The Premium Whitespace Rule

If a section feels cramped, the answer is always more vertical space, never smaller text. Baker McKenzie and Allen & Overy both use aggressive vertical spacing (80–120px between sections) that reads as confidence. Cheap sites compress sections because they are afraid users will scroll away. Premium sites trust the content.

---

## 4. Surface & Elevation System

No shadows except as listed. Box shadows signal SaaS/dashboard aesthetic. Premium law sites use borders and background shifts for elevation, not drop shadows.

```css
/* Level 0 — Base surface */
background: var(--ink) OR var(--parchment); /* depending on context */
border: none;

/* Level 1 — Subtle card on matching background */
background: var(--ink-soft) OR var(--parchment-warm);
border: 1px solid var(--ink-border) OR var(--parchment-border);
border-radius: 4px; /* NOT 8px, NOT 12px. 4px is architectural, not bubbly */

/* Level 2 — Overlay (modal, dropdown, tooltip) */
background: var(--ink-soft) OR var(--parchment);
border: 1px solid var(--ink-border);
border-radius: 4px;
box-shadow: 0 8px 32px rgba(0,0,0,0.24); /* ONLY shadows on floating elements */

/* RULE: border-radius max is 4px for content surfaces.
   Exception: pill buttons (CTAs) use 2px, never full pill/rounded-full.
   Full rounded corners are the SaaS/startup signal we are explicitly avoiding. */
```

---

## 5. Component Library (Page-by-Page Implementation)

### 5.1 Navigation

**Desktop:**
- Full-width, position `sticky top-0`, `z-index: 50`
- Background: `--ink` at `backdrop-filter: blur(12px)` with `background: rgba(20,23,31,0.85)` — visible but not fully opaque, gives depth over the hero
- Left: wordmark in Fraunces 500 weight, `--chalk` colored, 18px
- Center: nav links in Inter 500, 14px, `--slate-light` default, `--chalk` on hover, `--brass` active state with a 1px underline at 2px below the baseline (not an underline on the text itself — a separate absolutely-positioned element so the underline is precisely controllable)
- Right: Search icon (expands inline to a 280px input on click), then Auth button — Inter 500, 13px, `--chalk` text, `1px solid var(--ink-border)` border, transparent background, 2px radius, `padding: 8px 20px`. On hover: border becomes `--brass`, text becomes `--brass`. No fill color on hover.
- Separator between search and auth: a 1px vertical `--ink-border` line, 16px tall
- No hamburger menu icon — on mobile, collapse nav links into a 40px circular icon-only button centered on the right

**Mobile popover:** Full-width panel below the navbar, `--ink-soft` bg, staggered entrance (each link fades+translates in with 50ms stagger), IBM Plex Mono labels, `--chalk` text

### 5.2 Hero (Home page)

This is the single most important surface on the platform. Do not add to it.

```
[Lightfall canvas — full viewport height, position absolute, z-index 0]
[Scrim overlay — position absolute, z-index 1, 
  background: linear-gradient(to bottom, 
    rgba(20,23,31,0.15) 0%, 
    rgba(20,23,31,0.55) 60%, 
    rgba(20,23,31,1) 100%)]
[Content container — position relative, z-index 2, 
  max-width: 820px, centered, padding-top: 180px, padding-bottom: 120px]
  
  [Eyebrow — IBM Plex Mono 11px, --brass, uppercase, letter-spacing 0.12em]
  "INDIA'S PREMIER LEGAL KNOWLEDGE PLATFORM"
  
  [Headline — Fraunces 700, clamp(48px, 6vw, 84px), --chalk, line-height 1.08, 
   letter-spacing -0.025em, max-width: 14ch]
  Two lines. Not three. Example: "Study Law. Think Deeper."
  
  [Subhead — Inter 400, 19px, --slate-light, max-width: 52ch, margin-top: 24px]
  One sentence. Not a paragraph.
  
  [CTA row — margin-top: 40px, display flex, gap: 16px, align-items center]
    [Primary CTA — Inter 600, 15px, background --brass, color --ink, 
     padding 14px 32px, border-radius 2px, no border]
    [Secondary CTA — Inter 500, 15px, color --chalk, border 1px solid --ink-border, 
     padding 14px 32px, border-radius 2px, background transparent]
```

Entrance animation sequence (one-time, on mount):
1. 0ms: Lightfall starts rendering
2. 300ms: eyebrow fades in (opacity 0→1, translateY 8px→0, duration 500ms)
3. 500ms: headline fades in (opacity 0→1, translateY 12px→0, duration 600ms)
4. 750ms: subhead fades in (same pattern, duration 500ms)
5. 950ms: CTA row fades in (opacity 0→1, duration 400ms)
Nothing else animates on this page until scroll.

### 5.3 Stats Strip (Home page, below hero)

- Dark background (`--ink`), full width, `padding: 64px 0`
- Three stats in a row, separated by `1px solid --ink-border` vertical dividers
- Each stat: number in Fraunces 600 at `clamp(40px, 5vw, 64px)` `--chalk`, label below in IBM Plex Mono 11px `--slate-light` uppercase
- Numbers count up when scrolled into view (vanilla countUp, no library needed — simple `requestAnimationFrame` loop over 1200ms with easeOutCubic)
- Stats are LIVE from DB, not hardcoded (Supabase count queries on page load)

### 5.4 Resource Cards (used on /subjects/:slug, /resources, /latest, /search)

Two variants:

**Compact card (list/grid browse):**
```
background: --parchment-warm
border: 1px solid --parchment-border
border-radius: 4px
padding: 20px 24px

[Top row]
  [Type badge — IBM Plex Mono 11px, --chalk text, --forest background, 
   padding 3px 10px, border-radius 2px, uppercase]
  [Bookmark icon — right-aligned, --slate-light, fills --brass on active]

[Title — Fraunces 500, 19px, --ink, margin-top 12px, max 2 lines then ellipsis]
[Subject breadcrumb — IBM Plex Mono 11px, --slate, margin-top 8px]
  e.g.  CONSTITUTIONAL LAW · SEM 3 · UNIT 2
[Meta row — Inter 400, 13px, --slate-light, margin-top 16px]
  "Added 3 days ago  ·  PDF  ·  4 pages"

Hover state:
  border-color: --brass (transition 150ms)
  title color: --ink (stays the same — NO color change on title hover, that's cheap)
  cursor: pointer
```

**Featured card (homepage "New this week" section):**
Same as compact but wider, allows 3 lines on title, and shows a 2-line excerpt from the resource description in Inter 400 15px `--slate`.

### 5.5 Subject Cards (/subjects page)

```
background: --ink-soft (these live on a dark background section on the subjects page)
border: 1px solid --ink-border
border-radius: 4px
padding: 28px 28px 24px
aspect-ratio: close to square on desktop (use CSS grid auto-rows)

[Icon — 32px, SVG, --brass colored, not emoji, not FontAwesome — custom simple line icons]
[Subject name — Fraunces 600, 22px, --chalk, margin-top 16px]
[Resource count — IBM Plex Mono 11px, --slate-light, margin-top 8px]
  e.g.  42 RESOURCES

Hover:
  background: --ink (slightly lighter lift — subtract from dark rather than add shadow)
  border-color: --brass
  Subject name: --brass
  transition: all 150ms ease
```

### 5.6 Primary CTA Button (global)

```css
.btn-primary {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.02em;
  color: var(--ink);
  background: var(--brass);
  border: none;
  border-radius: 2px;
  padding: 12px 28px;
  cursor: pointer;
  transition: background 150ms ease, transform 80ms ease;
}
.btn-primary:hover { background: var(--brass-muted); }
.btn-primary:active { transform: scale(0.98); }
```

### 5.7 Secondary CTA Button

```css
.btn-secondary {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--chalk);
  background: transparent;
  border: 1px solid var(--ink-border);
  border-radius: 2px;
  padding: 12px 28px;
  cursor: pointer;
  transition: border-color 150ms ease, color 150ms ease;
}
.btn-secondary:hover {
  border-color: var(--brass);
  color: var(--brass);
}
```

### 5.8 Search Bar

```
Container: position relative, max-width 600px
Input: 
  background: --ink-soft (on dark) OR --parchment-warm (on light)
  border: 1px solid --ink-border OR --parchment-border
  border-radius: 2px
  padding: 12px 16px 12px 44px (left padding for icon)
  font-family: Inter
  font-size: 15px
  color: --chalk OR --ink
  outline: none
  :focus → border-color: --brass

Icon: magnifying glass, 18px, --slate, position absolute left 14px, vertically centered

Dropdown (instant results — fires on keystroke after 200ms debounce):
  background: --ink-soft
  border: 1px solid --ink-border
  border-radius: 0 0 4px 4px
  max-height: 360px, overflow-y scroll
  box-shadow: 0 8px 32px rgba(0,0,0,0.24)
  
  Each result row:
    padding: 12px 16px
    [Type badge] [Title in Inter 500 15px --chalk] 
    [Subject in IBM Plex Mono 11px --slate-light below]
    Highlight matched text in --brass
    hover: background --ink (1 step lighter)
  
  Bottom row: "See all X results for '[query]'" → links to /search
```

### 5.9 Resource Detail Page Layout

```
Page background: --parchment (NOT dark — reading context)

Navbar switches to light mode: background rgba(246,243,236,0.9), backdrop-blur,
  nav links in --ink, active in --brass

[Header section: padding 64px 0 48px, max-width 860px, centered]
  [Breadcrumb — IBM Plex Mono 11px --slate, uppercase]
    CONSTITUTIONAL LAW  ›  SEM 3  ›  UNIT 2
  [Title — Fraunces 600, clamp(28px, 3.5vw, 44px), --ink, margin-top 16px, max-width 22ch]
  [Meta row — Inter 400 13px --slate, margin-top 12px, gap 20px]
    "Added 12 Jun 2026  ·  PDF  ·  8 pages  ·  Uploaded by Sanjukta Mitra"
  [Tags — IBM Plex Mono chips, --forest bg, --chalk text, 11px, padding 3px 10px, gap 8px]
  [Action row — margin-top 24px]
    [Bookmark button] [Share button]

[Divider — 1px --parchment-border, margin 0]

[Content area — two column layout on desktop: 70% content / 30% sticky sidebar]
  Left: PDF viewer (full width of column, no external chrome/chrome UI removed)
  Right sticky sidebar:
    "In this resource" — heading in IBM Plex Mono 11px --slate uppercase
    Table of contents if multi-page
    Related resources (3 cards, compact variant)

[Discussion section — below content, max-width 700px, centered]
  Section heading in IBM Plex Mono 11px --slate uppercase "DISCUSSION"
  Hairline divider
  Comment composer (auth-gated)
  Comments list
```

### 5.10 Blog Post Detail Layout

```
Page background: --parchment

[Cover image — full viewport width, height 480px, object-fit cover, 
 no border-radius, edge-to-edge]
 
[Content wrapper — max-width: 740px, margin: 0 auto, padding: 56px 24px]

  [Eyebrow row — IBM Plex Mono 11px --slate, uppercase, letter-spacing 0.08em]
    TAG NAME  ·  8 MIN READ  ·  23 JUN 2026
  
  [Title — Fraunces 700, clamp(32px, 4vw, 52px), --ink, line-height 1.1,
   letter-spacing -0.02em, margin-top 16px]
  
  [Byline — Inter 400 14px --slate, margin-top 20px]
    "By Sanjukta Mitra"
  
  [Divider — 1px --parchment-border, margin 32px 0]
  
  [Lead paragraph — Inter 400, 20px, --ink, line-height 1.7, 
   max-width 68ch — this is the only place 20px body text appears]
  
  [Body paragraphs — Inter 400, 17px, --ink, line-height 1.75, max-width 68ch]
  
  [h2 inside post — Fraunces 600, 26px, --ink, margin-top 48px, margin-bottom 16px]
  [h3 inside post — Fraunces 500, 21px, --ink, margin-top 36px, margin-bottom 12px]
  
  [Blockquote — border-left 3px solid --brass, padding-left 24px, 
   Fraunces 400 italic, 20px, --slate, margin 40px 0]
  
  [Inline case citations — IBM Plex Mono 12px, --forest, 
   background --parchment-warm, padding 2px 6px, border-radius 2px]
  Example: `AIR 1973 SC 1461` — this is the signature device in the blog context
```

### 5.11 Auth Pages (/auth/login, /auth/signup, /auth/reset)

```
Page: split layout
Left half: --ink background, centered Fraunces headline + brand copy + small logo
Right half: --parchment background, centered form

Form:
  max-width 380px
  Form title: Fraunces 600 28px --ink
  Subtitle: Inter 400 14px --slate
  
  Input fields:
    border: 1px solid --parchment-border
    border-radius: 2px
    padding: 12px 16px
    font: Inter 400 15px --ink
    background: #fff
    :focus → border-color --brass, no box-shadow
    Label above each field: Inter 500 13px --ink, margin-bottom 6px
  
  Google OAuth button:
    border: 1px solid --parchment-border
    background: #fff
    Inter 500 14px --ink
    Google icon left, text centered with icon
    Full width, border-radius 2px, padding 12px
  
  Divider between OAuth and email form:
    "or continue with email" — Inter 400 13px --slate, centered, 
    with 1px --parchment-border lines either side (classic OR divider)
  
  Submit button: full-width .btn-primary
  
  Footer link: Inter 400 13px --slate, brass link color for the action link
```

### 5.12 Admin Panel (/admin)

```
Layout: sidebar nav (240px fixed) + content area

Sidebar: --ink background
  Logo/brand at top
  Nav sections: IBM Plex Mono 11px --slate uppercase as section labels
    CONTENT
      Resources
      Subjects
      E-Magazine
    PLATFORM
      Blog
      Messages
      Users
  Active item: --brass left border (3px), --chalk text
  Inactive: --slate-light text, hover --chalk

Content area: --parchment background

All admin tables: 
  header row: IBM Plex Mono 11px --slate uppercase, letter-spacing 0.06em
  rows: Inter 400 14px --ink, 1px --parchment-border dividers between rows
  row hover: --parchment-warm background
  action buttons in rows: text-only ("Edit" "Delete") in --brass, no button chrome

Upload/create forms: same field styling as auth pages
```

### 5.13 Dashboard (/dashboard)

```
Page background: --parchment
Header: Fraunces 600 32px --ink "Your Library" + Inter 400 15px --slate subtitle
Tab bar: IBM Plex Mono 12px uppercase for tab labels (Bookmarks / In Progress / Comments / Account)
Active tab: --brass bottom border (2px), --ink text
Inactive: --slate-light text

Content: resource cards in compact variant, same component as browse pages
Empty state (no bookmarks yet):
  Centered, --slate-light text, Fraunces 400 italic 22px message, 
  Inter 400 15px description, .btn-secondary CTA to browse
```

---

## 6. Page-by-Page Design Checklist

For every page built, verify:

- [ ] Font used is from the three-family stack only (Fraunces, Inter, IBM Plex Mono)
- [ ] Brass appears at most once as the primary accent per page
- [ ] No border-radius > 4px on any content surface (buttons are 2px)
- [ ] No box-shadow on any non-floating element
- [ ] No gradient except inside the Lightfall canvas
- [ ] Reading contexts (blog, resource detail) use `--parchment` background, not dark
- [ ] Metadata (breadcrumbs, badges, type labels, timestamps) uses IBM Plex Mono, uppercase, letter-spacing 0.06em
- [ ] Body text max-width 68ch on reading pages
- [ ] All spacing is a multiple of 4px
- [ ] No pure `#000` or pure `#FFF` anywhere

---

## 7. What Not To Do (Anti-Pattern List)

These are the specific patterns that make sites look AI-generated, template-based, or cheap. Every one of these has been considered and explicitly rejected.

| Anti-pattern | Why it kills premium feel | What to do instead |
|---|---|---|
| Icon-in-colored-circle stat cards | Standard dashboard/SaaS look, zero distinction | Number + IBM Plex Mono label, no icon, no circle |
| Full rounded corners (`border-radius: 9999px`) on content cards | Reads as consumer app / bubbly startup | `border-radius: 4px` max on surfaces |
| Gradient backgrounds (purple-to-blue, etc.) | Instantly reads as AI-generated landing page | Solid `--ink` or `--parchment`. No gradients. |
| Multiple accent colors (blue links, green badges, red alerts, purple CTAs all on one page) | Visual noise — no hierarchy | One accent: brass. Forest for tags. Slate for secondary. That's it. |
| Centered body text beyond the headline | Makes reading slow and feels cheap | Left-align all body text, center only display/hero headlines |
| Emoji in any UI context | Kills the serious/premium register immediately | Custom SVG icon set OR none |
| Stock photo of scales of justice, courthouse columns, legal books | Every law site does this, it's a brand null choice | Her actual content, editorial photography, or no imagery at all — negative space is premium |
| Animated number counters with no restraint (spin up and down repeatedly) | Gimmick — draws attention to the trick, not the number | Count up once, on first viewport entry, then stop |
| "Testimonials" in quote bubble cards with circular avatars | SaaS cliché | If testimonials exist: blockquote style, name + institution in IBM Plex Mono, no avatar, no star rating icons |
| Dropdown menus with rounded mega-panel and featured images | Agency portfolio move, wrong register | Clean flat list, `--ink-soft` bg, Inter 500 links, hairline dividers |
| Loading spinners (circle spinners) | Feels slow and outdated | Skeleton screens using the actual layout of the loading content |
| Toast notifications with colored left border AND icon AND background tint (three signals for one message) | Excessive — the "AI UI" tell | One signal: either background tint OR left border. Not both. |
| Hover effects that are too dramatic (scale 1.05 on cards, deep shadow lift) | Distracts from content, toy-like | 150ms border-color change only. No scale. No shadow on hover. |

---

## 8. Motion & Animation (Full Rules)

### What runs
- **Lightfall hero** — ambient, continuous while in viewport, paused on scroll past
- **Hero content entrance** — one-time, on mount, staggered fade+translate sequence (see Section 5.2)
- **Scroll reveal** — sections, stat strip, feature descriptions: `opacity 0→1 + translateY 16px→0`, `duration 500ms`, `easing: cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quint), `threshold: 0.15` in IntersectionObserver
- **Stat countUp** — fires once on first viewport entry, 1200ms duration, easeOutCubic
- **Navigation hover** — `150ms ease` on color only
- **Card border hover** — `150ms ease` on border-color only
- **Button active** — `transform: scale(0.98)`, `80ms ease`
- **Search dropdown** — `opacity 0→1 + translateY -4px→0`, `100ms ease`
- **Auth form focus** — `border-color` transition `150ms ease` only
- **Blog page Gradual Blur** — hero blurs from `filter: blur(0)` to `filter: blur(6px)` as user scrolls past it, `will-change: filter`

### What does NOT run
- No page transition animations (slide/fade between routes — feels slow, not premium)
- No hover scale on any card
- No parallax outside the hero
- No GSAP FlowingMenu (rejected — see spec)
- No Magic Bento particles
- No Grid Scan lines
- No Antigravity floating elements
- No Lottie files or animated illustrations
- No looping background video other than Lightfall

### `prefers-reduced-motion` rule
Every animation above wraps in a `prefers-reduced-motion` check. If true:
- Lightfall: `paused={true}`
- All scroll reveals: rendered at final state (no transition)
- CountUp: render final number immediately
- Everything else: no transition, instant state

---

## 9. Iconography

Use a single consistent icon set. Recommended: **Phosphor Icons** (available as React component package `phosphor-react`). Reasons: clean thin-line style at 1.5px stroke weight, matches the Inter/Fraunces register, covers legal-relevant icons (scales, document, bookmark, gavel — use gavel sparingly, once, in the brand if at all).

Rules:
- Icon size: 18px in body/nav contexts, 24px in feature/card contexts, 32px for subject-category icons
- Icon color: always inherits from parent text color — do NOT hard-code icon colors separately
- No icon backgrounds (circles, squares behind icons) — icons stand alone
- Icons are supplementary. If the text label makes the icon redundant, remove the icon.

---

## 10. E-Magazine Specific Design

The e-magazine is a recurring publication, not a regular blog post. It should feel like a digital publication.

```
/magazine — Magazine index page:
  Dark (--ink) background
  Large typographic grid layout — issue number in Fraunces 700 at 120px+ as decorative element
  Each issue: full-bleed cover image (she supplies), issue number in IBM Plex Mono, 
    date, headline summary
  "Read Issue" CTA in brass

/magazine/:issue — Single issue reader:
  Fullscreen immersive reading experience
  Page background: --parchment
  Content constrained to 72ch, centered
  Issue number persistent in top-left in IBM Plex Mono --slate-light
  Fraunces for all headings inside, Inter for body
  Section breaks: a hairline --parchment-border rule with an IBM Plex Mono section label centered on it
    (classic editorial magazine device — "III" between sections, or "SECTION 2")
  
  The e-magazine is the one place where a full-bleed editorial image MID-article is permitted,
  handled as a figure with a figcaption in IBM Plex Mono 11px --slate-light below
```

---

## 11. Forms (General)

Applies to contact form, comment composer, admin upload forms.

```css
/* Field wrapper */
.field { display: flex; flex-direction: column; gap: var(--space-2); }

/* Label */
.label {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--ink); /* or --chalk on dark bg */
}

/* Input / Textarea / Select */
.input {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: var(--ink);
  background: #fff; /* or --ink-soft on dark forms */
  border: 1px solid var(--parchment-border);
  border-radius: 2px;
  padding: 11px 14px;
  transition: border-color 150ms ease;
  outline: none;
}
.input:focus { border-color: var(--brass); }
.input::placeholder { color: var(--slate-light); }

/* Error state */
.input.error { border-color: #C0392B; } /* one-off red — not in the palette, only for errors */
.error-message { font-size: 12px; color: #C0392B; margin-top: var(--space-1); }

/* Textarea: min-height 120px, resize: vertical only */
/* Select: custom chevron in --slate-light, no browser default arrow */
```

---

## 12. Loading & Empty States

### Skeleton screens (not spinners)
Every data-dependent surface renders a skeleton while loading — a layout-accurate wireframe of the final content, using `--parchment-warm` base and a shimmer animation:

```css
@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
.skeleton {
  background: linear-gradient(90deg, var(--parchment-warm) 25%, var(--parchment-border) 50%, var(--parchment-warm) 75%);
  background-size: 800px 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 2px;
}
```

### Empty states
- No sad-face illustrations
- Fraunces 400 italic 22px `--slate` message
- Inter 400 15px `--slate-light` description below
- One `.btn-secondary` CTA
- That's it. No other decoration.

---

## 13. Tiptap Blog Editor (Admin) Styling

The blog editor should feel like writing in a premium editorial environment, not like a CMS form.

```
Editor container: --parchment background, no border, max-width 740px, centered
Title input: Fraunces 700 at 40px, --ink, no border, no background, placeholder "--slate-light"
  Placeholder text: "Title"
Divider: 1px --parchment-border
Body editor: Inter 400 17px --ink, line-height 1.75, no border
  Tiptap toolbar: sticky top at navbar height, --parchment background,
  IBM Plex Mono 12px labels, minimal icon set — Bold/Italic/H2/H3/Quote/Link/Mono only
  
The editor IS the page. No sidebar. No panels. Just the writing surface.
Publish/Save Draft: fixed bottom-right corner, .btn-primary and .btn-secondary pair
```

---

## 14. Responsive Breakpoints

```css
/* Mobile first */
--bp-sm: 640px;   /* Landscape phone */
--bp-md: 768px;   /* Tablet portrait */
--bp-lg: 1024px;  /* Tablet landscape / small laptop */
--bp-xl: 1280px;  /* Desktop */
--bp-2xl: 1536px; /* Wide desktop */

/* Content max-widths */
--content-max: 1200px;  /* Main site container */
--content-reading: 740px; /* Blog/resource reading width */
--content-narrow: 480px; /* Forms, auth */
```

Mobile-specific overrides:
- Nav collapses at `--bp-md`
- Hero headline drops to 38px floor in `clamp`
- Resource cards go single-column below `--bp-sm`
- Resource detail: sidebar disappears, moves below content
- Blog: cover image drops to 280px height
- Admin: sidebar becomes a bottom tab bar

---

## 15. Reference Sites Summary

| Reference | What to take from it |
|---|---|
| Quinn Emanuel | Information architecture that never wastes a word; bold typographic hierarchy that signals authority; stats displayed as hard evidence not decoration |
| Bick Law (Webby nominee) | Proving that niche design identity and creative direction beat generic legal templates; the value of a single strong visual idea per page |
| Allen & Overy | Thought-leadership hub treated as a genuine journal, not a blog; dense content made readable through typography discipline and spacing |
| Baker McKenzie | Modular design system applied consistently across hundreds of pages — the same component, never breaking, is premium in itself |
| MasterClass | Dark cinematic shell wrapping warm editorial reading interior; production quality as a UX signal; instructor/author credibility surfaced visually |
| Brilliant.org | Clean, high-contrast surfaces; mathematics/logic content made beautiful through restraint; no gratuitous illustration; progress shown structurally |
| SCC Online (her stated blog reference) | The standard of legal content presentation students already trust; we beat it on visual quality while matching its content authority |
