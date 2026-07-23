# FutureTech — Design & UX Structure

Research-grounded design direction. This is the pre-code spec; once Phase 1 of `REBUILD_PLAN.md` starts, `globals.css` becomes the living source of truth and this file freezes as the rationale record.

**Correction (this revision):** an earlier pass over-fit to reddit.com specifically — lifting its literal hex tokens, vote-pill shape, sidebar chrome, and even its "Best/Hot/New/Top/Rising" tab labels in place of the spec's own "For You/Trending/Recent" naming. That's cloning, not synthesis, and it directly contradicted the brief (which pins down its own feed names). Research below is kept only where it produced a *transferable principle*, not a literal skin to paste in. Anything that was a straight lift has been removed and rebuilt as FutureTech's own choice.

---

## 1. Research: what was actually studied

Not vibes — specific products, their actual tokens, and what their own teams said about *why*.

| Reference | What was taken from it |
|---|---|
| **Medium** (`GT Super` 120px serif hero, cream `#f7f4ed` canvas, one CTA pill) | Committing an entire reading view to one typographic gesture; "the page ends where it begins" restraint |
| **The Atlantic** (`AGaramondPro` article serif, `Atlantic Serif` UPPERCASE section labels, Logic Monospace metadata) | Two-register typography: one face for the words you write, a different one for the *numbers/metadata* around them |
| **Vox** (single hazard-yellow `#fff200` used in ~14 paint events, never as body text; Roboto Mono UPPERCASE eyebrows) | "Spend your boldness in one place" — an accent restricted to one job, not brand wallpaper |
| **MIT Technology Review** / **TechCrunch** (`DESIGN.md` breakdowns) | Color used as a *section classifier* (each content category gets a small, consistent hue) rather than as brand decoration |
| **Linear** (`#0F0F11` bg / `#17171A` surface, `rgba(255,255,255,0.06)` hairlines, 13–14px base type, no display face) | Precision over decoration: borders barely visible, type dense, structure felt rather than seen |
| **Stripe / Linear / Vercel** (via Geist docs + "four principles" analysis) | High contrast, generous whitespace, monochrome base + one accent, sharp geometric type — and *why* it holds together (each choice reinforces the others) |
| **Stack Overflow's own 2025–26 redesign notes** (`meta.stackexchange.com`) | Real user research conclusion: too many blue interactive elements hurt readability; color should mark *state*, not *decoration*. Also: users explicitly asked for a **wider layout** on modern monitors |
| **Reddit, old and new, as a UX case study (not a visual reference)** | Two transferable principles only, stripped of Reddit's own skin: (1) a documented, *repeated* pattern (2024 and again Feb 2026) of users preferring denser, text-first list views over enlarged photo-card feeds when the content is scan-heavy — informs FutureTech defaulting to a dense list, on its own terms, for text content; (2) shipped voting UIs generally avoid reusing their "error/destructive" color for a downvote state, since voting down isn't a destructive action — informs keeping FutureTech's own downvote color out of its own `--danger` slot. Reddit's specific hex values, pill shapes, sidebar chrome, and tab labels are **not used** — see the correction note above |
| **Quora UX case studies** (Prototypr, UX Planet) | Quora's own known weakness: cluttered feed density hurts reading pace versus Medium/Zhihu's cleaner card separation — a warning about what *not* to copy from Quora, even though Quora is a named inspiration |
| **Hashnode's 2026 rebuild** (their own changelog) + **Refero design tokens** | Editorial-newsroom-on-gray-monochrome with one electric accent; Suisse Intl throughout; flat hairline cards, no shadows |
| **ADPList case studies** (Orbix Studio, Esther Kim/Nehal Sharma) | A cautionary example: ADPList's own designers found *16 button styles and 18 card styles* had crept in from not having one system — the exact failure mode this rebuild's `ui/button`, `ui/card` consolidation (already planned in `REBUILD_PLAN.md` §5) is meant to prevent |
| **"Airwave" / "PodWave" audio design systems** | Warm charcoal + amber-for-waveform is a real, common, justified pattern for audio products — validates keeping the existing amber accent for the Podcasts section specifically |
| **Brutalist web / SiteInspire showcases** | Used as a *counter-check*, not a source: confirmed that raw/rugged brutalism is a stance for portfolio/art sites, not for a product people need to read comfortably for ten minutes at a time. Rejected as the base language for that reason |

---

## 2. What this explicitly is not

Four defaults, not three — a fourth one emerged after the first draft of this document and had to be added:

1. Warm cream + high-contrast serif + terracotta accent — not this.
2. Near-black + one bright acid accent, applied regardless of subject — not this either.
3. Zero-radius broadsheet hairline grid — not this (radius is a deliberate small non-zero 3/6/10px, never 0, never a pill).
4. **"Dark background + a characterful serif for one display moment + warm amber/gold accent + a monospace webfont for labels"** — documented across multiple independent 2026 sources as the *current* AI-generated-site tell, the direct successor to the 2023 purple-gradient cliche now that models (and the humans copying their output) have moved on from that one. This document's first draft was exactly this: `#12100D` background, Fraunces headline, `#E8A33D` amber accent, JetBrains Mono for data. That's now corrected below — the register-switch idea (§3) survives because it isn't a skin choice, but every specific color and typeface in §4/§5 has been replaced.

No gradients. No glassmorphism. No floating pill navbars with drop shadows. No emoji as UI iconography. No numbered `01/02/03` markers unless the content is an actual sequence (onboarding steps qualify; feature lists do not). No loaded webfont doing a job the system font stack already does adequately (mono numerals, specifically).

---

## 3. The core thesis: two registers, not one theme

The product has two genuinely different jobs: **using a tool** (voting, browsing threads, managing sessions, posting jobs) and **reading** (a 2,000-word article). Research above shows these two jobs pull toward opposite conventions — developer tools (Linear, Stripe, Vercel) go dark, precise, dense; reading platforms (Medium, The Atlantic, Vox) go light, generous, serif. Most products force one choice onto both jobs. This one doesn't.

**Terminal** — dark, warm near-black, dense, monospace-numeric. Owns: feed, Q&A list + threads, comments, jobs board, mentor directory/dashboard, settings, admin, all navigation chrome.

**Page** — warm light paper, generous serif headline, minimal chrome. Owns exactly two views: the article reading page (`/blog/[slug]`) and a podcast's show-notes panel. Nothing else switches.

This is a fixed pairing of *content type → register*, not a user-facing light/dark toggle. No `next-themes`, no theme switcher UI, no per-user setting — the mode is a property of what you're looking at, the same way a Kindle doesn't ask if you want "reading mode," it just is one. This also resolves the earlier open question in `REBUILD_PLAN.md` §3 about dropping `next-themes`: still dropped. Two fixed palettes, selected by route, cost nothing extra to build (one new light surface, not a parallel dark/light system for the whole app).

A single deliberate cross-fade transition (200ms, background-color + opacity) plays when navigating from a Terminal list into a Page article — the one orchestrated motion moment, per the frontend-design skill's guidance to spend motion budget in one place rather than scattering it.

---

## 4. Terminal register — tokens

```css
--bg:            #12151A;   /* deep slate with a faint cool-green undertone — not warm brown-black (the "obsidian/amber" template look), not violet-black (Linear) */
--surface:       #1A1F25;
--surface-hover: #212730;
--surface-high:  #2B333D;   /* active/selected rows, persistent headers */

--ink:           #E7EAE6;   /* primary text — cool-neutral off-white */
--ink-muted:     #838E8A;   /* metadata, timestamps, secondary labels */
--ink-faint:     #4C5550;   /* disabled, placeholder */

--border:        rgba(231,234,230,0.08);  /* hairline */
--border-strong: rgba(231,234,230,0.14);

--accent:        #4C8C82;   /* muted teal — vote-up, karma, primary CTA, accepted-answer mark. Deliberately outside both the old blue/purple cliche and the newer warm-amber/gold cliche */
--accent-soft:   rgba(76,140,130,0.14);
--downvote:      #A15D63;   /* dusty rose-brick — downvote-active only, its own token, never --danger below: voting down isn't a destructive action and shouldn't share a color with bans/deletions. Warm where --accent is cool, preserving a clear polarity without either hue being a named cliche color */
--downvote-soft: rgba(161,93,99,0.14);
--danger:        #C24B3A;   /* bans, deletions ONLY */
--success:       #6B9E78;   /* rare: payment confirmed, published confirmation */

--radius-sm: 3px;  --radius-md: 6px;  --radius-lg: 10px;   /* no pills, no 0 */
--font-ui:   'Switzer', system-ui, sans-serif;                                        /* nav, forms, rows, labels */
--font-mono: ui-monospace, 'SF Mono', 'Cascadia Mono', 'Segoe UI Mono', Consolas, monospace;  /* every number, always — the system stack, no webfont loaded for this job. Numerals don't need a personality; they need to line up */

--text-xs: 11px;  --text-sm: 13px;  --text-md: 15px;  --text-lg: 18px;  --text-xl: 26px;
--line-tight: 1.35;  --line-body: 1.55;
```

**The one non-negotiable typographic rule across the whole app: numbers are always mono, words never are.** Vote counts, karma, view counts, prices, durations, dates, hourly rates — the system mono stack, tabular figures. This single rule, applied everywhere, is what the Atlantic/Vox/MIT Tech Review references all independently converged on, and it's what makes a dense Q&A thread or a jobs list feel engineered rather than templated — it doesn't require a loaded webfont to work.

### Content-type classifiers (Terminal only)

Small, desaturated, dark-safe hues used as a 6px dot + label — never as a section background (that was MIT Tech Review's "color as classifier, not brand" move, adapted down for a dark UI where full-bleed pastel fills would fight the base):

| Content type | Hue | Where it appears |
|---|---|---|
| Articles | `#8FAF8A` sage | tag chip, feed row marker |
| Questions | `#7FA8C9` dusty sky | tag chip, feed row marker |
| Podcasts | `#C9954C` muted ochre | podcasts " own" the one warm classifier — it's an audio product, the one place a warm tone is used at all, and it's a duller ochre rather than the bright amber/gold specifically named in the 2026 cliche |
| Jobs | `#9C9587` stone | listing tag — deliberately the least decorated section; it's the most transactional |
| Mentorship | `#A990B8` muted lavender | mentor card tag |

---

## 5. Page register — tokens (article reading view + podcast show notes only)

```css
--page-bg:      #F6F1E8;   /* warm paper, not stark white — closer to Medium's cream than the Atlantic's pure white */
--page-surface: #FFFFFF;   /* code blocks, pull-quote panels */
--page-ink:     #211E19;
--page-muted:   #6B6459;
--page-border:  rgba(33,30,25,0.10);
--page-accent:  #A24B25;   /* muted clay/rust — darkened to ~5.1:1 contrast ratio against #F6F1E8 for WCAG AA compliance */

--font-display: 'Fraunces', Georgia, serif;   /* headline + deck only — see rationale below */
--font-read-body: 'Switzer', system-ui, sans-serif;  /* body copy stays the UI sans, tuned larger */
--page-text-title: 40px;
--page-text-deck:  18px;
--page-text-body:  17px;
--line-read:       1.7;

/* Optional dark reading variant for night viewing */
[data-reading-theme="dark"] {
  --page-bg:      #1B1815;
  --page-surface: #24201C;
  --page-ink:     #E6E1D8;
  --page-muted:   #9E968B;
  --page-border:  rgba(230,225,216,0.12);
  --page-accent:  #D97745;
}
```

**Why the body copy is not full serif, despite Medium/Atlantic both doing that:** those are light-background products where serif body text is safe. Since Terminal is dark and this app's reading view sits adjacent to it, light-on-dark thin serif strokes risk *halation* (glow/blur) if a reader flips between the two — a real accessibility concern, not a style nitpick. Resolution: `Fraunces` (a distinctive, characterful variable serif, not Georgia/Times) carries the **headline and deck only** — the single typographic gesture a reader sees once per article, à la Medium's "one sentence, whole viewport" restraint — while the paragraph body uses `Switzer` at reading-tuned size/measure (17px / 1.7 line-height / ~68 characters per line), which is both safer for legibility and still visibly distinct from the 13–15px/1.55 density used in Terminal. The *register change* is what a reader feels, not a full serif-body cosplay.

Article body layout: single column, `max-width: 700px`, generous top margin before the headline, cover image (if present) full-bleed above the fold, then the title in Fraunces at ~40px, deck in Switzer at 18px muted, then body. No sidebar, no related-articles rail interrupting the read — those move to the *end* of the article, after the comment section, matching Medium's rule of ending where it begins.

---

## 6. Layout system

Per Stack Overflow's own 2025 redesign notes, users explicitly asked for a wider layout on modern monitors — but "wider layout" and "narrow reading measure" aren't in conflict; they're solved at different levels:

- **Shell width** (Terminal: feed/Q&A/jobs/mentors list pages): `max-width: 1600px`, three-zone layout — left rail (nav, ~220px), center list (flexible, capped `~820px` so list *rows* stay scannable even on a wide monitor), right rail (contextual: trending tags, top mentors, active jobs — real queries only, nothing hardcoded).
- **Left nav structure**: a flat, three-group list — no collapse/expand behavior, because FutureTech has ~9 top-level destinations, not thousands of subscribed communities, so there's no density problem to solve with disclosure widgets. Groups separated by a hairline and a small muted 11px label (not small-caps, not uppercase — the app's own sentence-case rule from `globals.css` applies everywhere, nav included): `Discover` (Feed, Explore, Blog, Questions, Podcasts), `Yours` (Drafts, Bookmarks, Settings — logged-in only), `Community` (Mentors, Jobs). No recent-items list, no legal-link footer clutter in the primary nav — those live in the account menu and the real footer instead.
- **Header search**: same input styling as every other input in the app — hairline `--border` at rest, shifts to a solid 1px `--accent` border on focus with the background stepping from `--bg` to `--surface`. No glow, no gradient, no blur — one consistent focus treatment reused everywhere is more "FutureTech" than a one-off special effect on a single input. Wired to the real `search_content()` function from `REBUILD_PLAN.md` §4.4, no AI-assist layer (out of spec scope).
- **Reading measure** (Page register, and Terminal's own long-form surfaces like a question body): capped independently of shell width, ~65–75 characters per line, because line length — not viewport width — is what reading-comfort research actually depends on.
- **Q&A thread width**: slightly wider than the article column (`~760px`) since it needs to accommodate code blocks without wrapping awkwardly — a deliberate, content-driven exception, not an inconsistency.

```
Terminal shell (>1024px):
┌────────┬──────────────────────────────┬────────────┐
│  Nav   │        Center list           │  Context   │
│ 220px  │   capped ~820px, centered    │  rail      │
│        │   in remaining space          │  ~320px    │
└────────┴──────────────────────────────┴────────────┘

Page (article reading):
┌───────────────────────────────────────────────────┐
│                    (margin)                        │
│              ┌─────────────────┐                   │
│              │  700px column    │                   │
│              │  Fraunces title  │                   │
│              │  Switzer body    │                   │
│              └─────────────────┘                   │
│                    (margin)                        │
└───────────────────────────────────────────────────┘
```

---

## 7. The signature: two registers + one vote control, ours

The actual signature of this design isn't a component, it's the structural decision in §3: reading and browsing get different registers automatically, based on content type, with no user-facing toggle. That's the one thing this product does that none of the studied references do (each of them commits to a single register for everything).

The vote control is necessary infrastructure, not the flagship — so it gets one consistent, unglamorous shape everywhere, sized differently by context rather than reshaped:

```
▲ 42 ▼          ← dense list rows (feed, Q&A list, comments): vertical, left-anchored
                    — the natural shape for a control that has to sit flush
                    against a single line of text without adding a second row

▲ 42 ▼ · 4 replies · bookmark   ← detail views (article, question, answer): same
                    control, laid inline into the existing metadata line
                    already used for author · time · read time — reusing that
                    typographic system instead of inventing a separate pill/badge
```

One component (`ui/vote-control.tsx`), one shared `toggleVote` action (`REBUILD_PLAN.md` §5.2), one visual language reused everywhere — not two skins borrowed from two eras of somebody else's product. Optimistic update with rollback, per the existing (correctly-built) `ui/upvote-button.tsx` pattern from the old codebase.

Up fills `--accent` (muted teal). Down fills `--downvote` (dusty rose-brick) — its own token, never `--danger`, because voting something down isn't a destructive action and shouldn't share a color with bans or deletions. Down-voting is disabled on comments (up-only, matching the general low-stakes-content convention used across most Q&A/forum products) — articles, questions, and answers get the full control.

Nested comment indentation uses straight vertical bars, not curved connector lines — a plain legibility call (a straight rule is easier to trace by eye down a long thread than a curve), not a borrowed opinion.

---

## 8. Per-surface structure

### Feed (`/feed`, `/explore`, `/blog`, `/questions`)
Text-first, dense rows — one fixed density, not a toggle. Anatomy per row: vote control · content-type dot + tag · title (Switzer, 15px, medium) · one-line deck/excerpt (muted) · mono metadata line (author · time · comment count · read time). Cover images, when present, are a small fixed-aspect thumbnail at the row's right edge, never a full-bleed hero in the feed — hero treatment is reserved for the article's own page. Density is a considered default (text scans faster dense than as enlarged media cards), not a user setting — no view-density toggle is built, since FutureTech doesn't have the problem that control exists to solve elsewhere.

Sort tabs use the spec's own names — **For You · Trending · Recent** — as plain text links with an underline active-state, not pill buttons. For You (personalized, or a sensible default ranking when logged out) is the default tab.

### Article reading (`/blog/[slug]`)
Page register, as specified in §5. Vote control sits inline in the metadata line below the title (restyled for light background with `--page-accent` replacing teal), alongside bookmark and share — same component as everywhere else, just the detail-view sizing. Comments below stay Terminal-styled (comments are conversational/dense by nature even under a Page article — a deliberate small register mix, the same way The Atlantic's byline metadata stays monospace even in an otherwise serif article).

### Q&A thread (`/questions/[id]`)
Full Terminal. Question at top with its vote control; accepted answer distinguished by a thin `--accent` left border and a small mono `ACCEPTED` label — not a big colored banner (avoiding the decorative-badge cliche). Answers listed below, newest-vote-sorted with accepted pinned first, each with its own vote control. "Write an answer" is a real composer at the bottom, not a dead button.

### Podcasts (`/podcasts`, `/podcasts/[slug]`)
Terminal, but this is the one section allowed to use `--accent` liberally (waveform fill, play-state glow) per the Airwave/PodWave reference pattern — real `<audio>` element, real waveform or at minimum a real scrubber bound to `currentTime`, not a static progress div.

### Mentors (`/mentors`, `/mentors/[username]`)
Terminal, lavender classifier. More avatar-forward than Q&A rows (larger avatar, name, one-line expertise tag) but still one card component, no bespoke one-off styling — directly avoiding the ADPList case study's own documented failure (16 button styles, 18 card styles from lack of a system). Trust signals (`4.9 · 32 sessions`, response time) render as small mono stat chips, not star-icon walls.

### Jobs (`/jobs`)
Terminal, stone classifier, the least decorated surface in the app — dense list, mono salary range, filters as a simple inline bar (remote / employment type), no card imagery beyond a small company logo. This is deliberate: jobs are transactional, not editorial, and shouldn't visually compete with articles/questions for reading attention.

### Settings / Mentorship dashboard / Admin
Terminal, form- and table-dense. This is where `ui/tabs`, `ui/dialog`, `ui/dropdown-menu` (Radix-backed, per `REBUILD_PLAN.md` §5.2) do all the work — no bespoke neo-brutalist outliers like the old build's `border-4 shadow-xl` settings tabs. One visual language, applied consistently, all the way down.

---

## 9. Open decision for confirmation

This document keeps the Phase-0 decision to drop `next-themes` — but for a different reason than originally stated. It's not "dark-only, full stop"; it's "two *fixed* registers selected by content type, no user-facing toggle." If a manual light/dark preference for the Terminal register itself is wanted later (independent of the Page register), that's a real but separate scope addition — flagging it here rather than deciding it silently.
