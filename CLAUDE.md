# Goliath Investment Group — Project Context

## What This Is
A minimal institutional financial research website built with Next.js 16, Tailwind CSS v4, and MDX. Inspired by HOF Capital's aesthetic. Live at Vercel (deployed via GitHub).

## Tech Stack
- **Framework**: Next.js 16 App Router, `output: "export"` (static site)
- **Styling**: Tailwind CSS v4 — uses `@import "tailwindcss"` in globals.css, NO tailwind.config.js
- **Content**: MDX files with gray-matter frontmatter, rendered via `next-mdx-remote/rsc`
- **Deployment**: Vercel auto-deploys on every `git push` to main

## Design System
- **Background**: `#faf8f5` (cream) — used everywhere, hardcoded
- **Primary text**: `#1a1a2e` (dark navy) for UI elements
- **Body text in posts**: `#444444` (dark grey), headings `#1a1a1a`
- **Accent/gold**: `#c9a96e`
- **Borders**: `#d4cfc8` (toolbar), `#e8e4de` (grid/cards)
- **Font**: Inter (sans), Google Fonts serif for headings
- **No dark mode** — all `dark:` classes have been removed from MDXComponents

## File Structure
```
meridian-research/
├── posts/
│   ├── equity-research/     ← MDX posts for equity research
│   ├── blog/                ← MDX posts for blog
│   └── market-intelligence/ ← MDX posts for market intelligence
├── public/
│   └── images/              ← Drop stock/post images here
├── src/
│   ├── app/
│   │   ├── page.tsx                          ← Homepage
│   │   ├── layout.tsx                        ← Root layout (Header only, no SearchWrapper)
│   │   ├── equity-research/
│   │   │   ├── page.tsx
│   │   │   ├── EquityResearchClient.tsx      ← Grid + Sort/Focus/Search toolbar
│   │   │   └── [slug]/page.tsx
│   │   ├── blog/[slug]/page.tsx
│   │   ├── market-intelligence/[slug]/page.tsx
│   │   └── about/
│   │       ├── page.tsx                      ← Team page
│   │       └── TeamCard.tsx                  ← Jonathan's expandable bio card
│   ├── components/
│   │   ├── Header.tsx        ← Fixed, hides on scroll (mobile: only shows at top)
│   │   ├── NavOverlay.tsx    ← Full-screen black nav overlay
│   │   ├── PostListPage.tsx  ← HOF-style listing for Blog/Market Intel
│   │   └── MDXComponents.tsx ← Custom MDX renderers, NO dark mode classes
│   └── lib/
│       ├── posts.ts          ← getAllPosts(), getPostBySlug()
│       └── constants.ts      ← SUBSTACK_URL = 'https://goliathig.substack.com'
```

## MDX Frontmatter Format

### Equity Research:
```yaml
---
title: "Company: Subtitle"
author: "Jonathan Cao"
date: "2026-01-15"
category: "equity-research"
tags: ["TICK", "focus area", "another tag"]
excerpt: "Short description shown in grid."
readTime: "10 min read"
featured: false
image: "/images/FILENAME.jpg"
substackUrl: "https://goliathig.substack.com/p/post-slug"
---
```

### Blog / Market Intelligence:
```yaml
---
title: "Post Title"
author: "Jonathan Cao"
date: "2026-01-15"
category: "blog"
tags: ["tag1", "tag2"]
excerpt: "Short description."
readTime: "5 min read"
image: "/images/FILENAME.jpg"
substackUrl: "https://goliathig.substack.com/p/post-slug"
---
```

**Tag rules for Equity Research:**
- ALL-CAPS 1-5 letter tags = ticker symbol (e.g. `"MSFT"`) — shown as letter placeholder in grid if no image
- Lowercase tags = focus areas — populate the Focus Area filter dropdown
- `substackUrl` = links card to Substack instead of local page

## How to Add a New Post
1. Create `.mdx` file in the correct `posts/` subfolder
2. Add frontmatter (see above)
3. For image: drop file into `public/images/`, reference as `image: "/images/FILENAME.jpg"`
   - Always forward slashes, never backslashes
   - Never include "public" in the path
4. Deploy: `git add . && git commit -m "message" && git push`

## Key Design Decisions Made

### Header
- Fixed, hides on scroll down
- Mobile: only visible when `scrollY < 10` (at very top only)
- Desktop: reappears when scrolling back up
- No SearchWrapper — the floating search button was removed entirely

### Equity Research Grid
- Toolbar is mobile-responsive: Sort + Focus Area side by side on mobile, Search full-width below
- Grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
- Flush card borders: `border-l border-t` on container, `border-r border-b` on each card, `h-full` on link wrappers

### Post Pages
- NO `prose` class — it was overriding text colors with light grey
- MDXComponents handle all styling
- Headings: `#1a1a1a`, body text: `#444444`
- All `dark:` Tailwind variants removed (caused white text on cream bg in dark mode)

### Substack
- All blog/market intel posts link to `https://goliathig.substack.com`
- Set `substackUrl` in frontmatter to link a specific post to its Substack URL

## Deployment Workflow
```bash
git add .
git commit -m "describe change"
git push
```
Vercel auto-redeploys in ~1-2 min. Always run `git add .` first to stage all files including images.

## Known Gotchas
- **Image paths**: Forward slashes only (`/images/FILE.jpg`). Never backslashes, never "public/" prefix.
- **params**: Dynamic routes use `params: Promise<{slug: string}>` and must `await params` (Next.js 16)
- **Tailwind v4**: No `tailwind.config.js` — configured via CSS only
- **Dark mode**: Do NOT add `dark:` variants to MDXComponents — causes invisible text on cream background
- **Terminal on Windows**: Use Command Prompt, not PowerShell (avoids npm permission errors)
- **Two-step image deploy**: Both the image file AND the MDX file with `image:` field must be committed

## Jonathan's Info
- LinkedIn: www.linkedin.com/in/jonathanucao
- Email: jucao@usc.edu
- Background: Miami, military service, USC Finance + AI minor, Moelis & Company LA
- Substack: https://goliathig.substack.com
