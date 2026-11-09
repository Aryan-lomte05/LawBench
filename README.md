# LawBench

**A study resource platform for law students: subjects broken down by semester and unit, searchable resources
with in browser PDF reading, a discussion layer, and an admin CMS so the person who owns the content can
publish without touching code.**

[![Live](https://img.shields.io/badge/live-law--bench.vercel.app-4BC8C0?style=flat-square)](https://law-bench.vercel.app)
[![Stack](https://img.shields.io/badge/Next.js-Supabase%20·%20Postgres%20RLS-8B7CF6?style=flat-square)](#stack)
[![Editor](https://img.shields.io/badge/CMS-TipTap%20rich%20text-15181D?style=flat-square)](#the-admin-side)

Law students do not have a software problem, they have a findability problem. Notes, case briefs, bare acts and
past papers exist, scattered across drives and group chats, with no structure that matches how the subject is
actually taught.

LawBench organises the material the way the syllabus does, by **subject, then semester, then unit**, and makes
every resource readable in the browser rather than downloadable as a mystery file.

## What it does

| Route | Purpose |
|---|---|
| `/subjects` and `/subjects/[slug]` | Browse subjects, then their semester and unit breakdown |
| `/resources` and `/resources/[id]` | Filterable resource library, with preview, video and discussion per item |
| `/latest` | Feed of recent additions |
| `/search` | Typo tolerant search with an instant top 5 dropdown, full results on enter |
| `/blog` and `/blog/[slug]` | Long form posts, with voting and threaded comments |
| `/dashboard` | Bookmarks, reading progress, account |
| `/admin` | Role gated CMS for resources, subjects and blog posts |

### Search that tolerates how people actually type

Legal terminology is long, unfamiliar and easy to misspell, which makes exact match search useless here.
Search is built on Postgres `tsvector` full text indexing combined with `pg_trgm` trigram similarity, so
"kesavanada" still finds Kesavananda and "mens rea" still matches when typed as one word.

### Reading in place

Bare acts and judgments are long PDFs. `react-pdf` renders them inside the page with the surrounding
discussion thread, instead of handing the student a download and losing them. The repository ships sample
material for this: the Constitution, the Contracts Act, a Kesavananda summary, a Nanavati brief and mens rea
notes.

## The admin side

The point of the CMS is that the content owner is not an engineer. `/admin` is role gated and covers resources,
subjects and blog posts, with a **TipTap** rich text editor (images, links, underline) so posts are written
visually rather than in Markdown. Row level security in Postgres enforces the role boundary at the database,
not only in the interface, so a missing check in a React component cannot become a privilege escalation.

## Stack

Next.js App Router with server actions · Supabase for Postgres, auth, storage and row level security ·
TipTap editor · `react-pdf` · shadcn and Radix primitives · Tailwind with the typography plugin ·
GSAP, Lenis and OGL for motion · `next-themes` · Sonner for toasts.

Design and scope documents are committed alongside the code:
[`lawedtech-full-site-spec.md`](lawedtech-full-site-spec.md) holds the full site map, component inventory and
data model, and [`lawedtech-designer-document.md`](lawedtech-designer-document.md) the visual direction. The
spec was written before the build, and it names its own stack choice as Vite; the implementation moved to
Next.js for server actions and server side rendering.

## Repository map

| Path | Contents |
|---|---|
| `src/app/` | Routes, including `admin/`, `auth/`, `blog/`, `resources/`, `subjects/` |
| `src/app/api/` | PDF serving, comments and voting, seeding, admin promotion |
| `src/app/*/actions.ts` | Server actions for each area |
| `public/*.pdf` | Sample legal material |

## Running it

```bash
npm install
cp .env.example .env.local      # Supabase URL, anon key, service role key
npm run dev
```

Hit `/api/seed` once against a fresh database to populate subjects and sample resources.

## Limits

- Sample content only. The committed PDFs are illustrative, not a curated syllabus library.
- No access control on the resources themselves: anything published is public to signed in users.
- Search ranking is relevance from Postgres alone, with no learning from what users actually open.
- Not legal advice, and not a substitute for primary sources or a practitioner.
