# Buuk — Style Reference
> warm coral spotlight on a quiet paper canvas.

**Theme:** light (dashboard + help center also support dark)

Source measurements are normalized; roles and recommendations are interpreted. HTML examples are reconstructions, not source components. Buuk ships three coordinated surfaces — **Dashboard** (`cu-*`), **Help Center** (`hc-*`), and **Marketing** (`v3-*`) — sharing one coral brand.

---

## Overview

Buuk is a documentation product whose UI stays quiet so the work (diffs, docs, signals) can speak. The dashboard is a neutral zinc/coral workspace with light + dark themes; the help center is a clean docs surface with per-workspace accent; marketing is a flat editorial canvas (Aside-inspired) in coral on paper. Color appears as functional punctuation (brand CTA, green for publish/success, amber for attention); the rest is achromatic neutrals. Elevation is whisper shadows in the dashboard, flat borders in marketing, soft shadows in the help center. Rhythm alternates generous whitespace with dense card grids.

---

## Tokens — Colors

### Dashboard `cu-*` (light)

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas | `#fafafa` | `--cu-canvas` | Page background |
| Sidebar | `#f4f4f5` | `--cu-sidebar` | Sidebar background |
| Surface | `#ffffff` | `--cu-surface` | Cards, panels |
| Panel | `#f4f4f5` | `--cu-panel` | Nested panels |
| Border | `#e4e4e7` | `--cu-border` | Hairlines |
| Border Strong | `#d4d4d8` | `--cu-border-strong` | Emphasis borders |
| Text | `#18181b` | `--cu-text` | Titles (pure black in dashboard scope) |
| Text Secondary | `#52525b` | `--cu-text-secondary` | Body, labels |
| Text Muted | `#71717a` | `--cu-text-muted` | Captions, meta |
| Ink | `#18181b` | `--cu-ink` | Ink |
| Brand | `#c24e2a` | `--cu-brand` | Primary CTA (coral) |
| Brand Hover | `#aa3c1c` | `--cu-brand-hover` | CTA hover |
| Brand Soft | `#fdefe8` | `--cu-brand-soft` | Brand wash |
| Accent (publish/live) | `#15a056` | `--cu-accent` | Publish / live / success only |
| Accent Text | `#047857` | `--cu-accent-text` | AA text on accent-soft |
| Accent Soft | `#e8f7ee` | `--cu-accent-soft` | Success wash |
| Warn | `#b45309` | `--cu-warn` | Attention |
| Warn Soft | `#fdf4e7` | `--cu-warn-soft` | Warn wash |

### Dashboard `cu-*` (dark, `.dark`)

| Name | Value | Token |
|------|-------|-------|
| Canvas | `#09090b` | `--cu-canvas` |
| Surface | `#111113` | `--cu-surface` |
| Panel | `#131316` | `--cu-panel` |
| Border | `#18181b` | `--cu-border` |
| Border Strong | `#27272a` | `--cu-border-strong` |
| Text | `#d4d4d8` | `--cu-text` |
| Text Secondary | `#a1a1a1` | `--cu-text-secondary` |
| Text Muted | `#71717a` | `--cu-text-muted` |
| Brand | `#d85a32` | `--cu-brand` |
| Accent | `#1cb860` | `--cu-accent` |
| Warn | `#fcd34d` | `--cu-warn` |

### Help Center `hc-*`

Light: page `#ffffff`, surface `#ffffff`, surface-muted `#fbfbfa`,
surface-subtle `#f7f7f6`, border `#efefed`, border-strong `#e4e4e7`,
text `#18181b`, text-secondary `#3f3f46`, text-muted `#52525b`,
accent defaults `#18181b` (overridden per workspace).

Dark (`data-theme="dark"`): page `#09090b`, surface `#111113`,
surface-muted `#0c0c0e`, surface-subtle `#18181b`, border `#1a1a1c`,
border-strong `#2a2a2e`, text `#d4d4d8`, text-secondary `#a1a1aa`,
text-muted `#85858f` (AA on dark surfaces), accent `#fafafa`.

### Marketing `v3-*` (light only)

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper | `#f6f7f9` | `--v3-paper` | Canvas |
| Elevated | `#ffffff` | `--v3-elevated` | Cards |
| Ink | `#0f1728` | `--v3-ink` | Text |
| Mute | `#5b6475` | `--v3-mute` | Body/meta |
| Line | `rgb(15 23 40 / 0.08)` | `--v3-line` | Hairlines |
| Signal | `#d85a32` | `--v3-signal` | CTA / eyebrow / metric |
| Teal | `#0f8a5f` | `--v3-teal` | Success |
| Stage | `#eef1f6` | `--v3-stage` | Placeholder fill |
| Hero Wash | `#e8edf7` | `--v3-hero-wash` | Hero gradient |

---

## Tokens — Typography

**Primary family:** Public Sans (`--font-sans`) — dashboard, help center,
marketing. **Editorial variant:** Public Sans + Hanken Grotesk
(`.font-editorial`). **Mono:** `ui-monospace, SFMono-Regular, Menlo, Monaco,
Consolas, monospace`.

Weights used: 400 (body), 500 (medium), 600 (semibold), 700 (bold display).

### Type scale (marketing, from DESIGN.md)

| Role | Size | Weight | Line Height | Tracking | Token |
|------|------|--------|-------------|----------|-------|
| Display | 44–78px | 700 | 1.05 | -0.045em | `.marketing-v3-display` |
| H1 | 44/56px | 700 | 1.05 | -0.045em | — |
| H2 | 32/40px | 700 | 1.1 | -0.04em | — |
| Eyebrow | 11px | 600 | 1.2 | 0.16em | uppercase, signal color |
| Body | 16–18px | 400 | 1.6 | -0.01em | muted |
| Small meta | 12.5–13.5px | 400 | 1.5 | 0 | muted |

### Dashboard / help center

| Role | Size | Weight | Color |
|------|------|--------|-------|
| Title | 1.125–1.5rem | 600 | `--cu-text` (pure black light) |
| Body | 0.875–1rem | 400 | `--cu-text-secondary` |
| Caption | 0.75–0.8125rem | 400 | `--cu-text-muted` |
| Mono | 0.8125rem | 400 | `--cu-text-muted` |

---

## Tokens — Spacing & Shapes

**Base unit:** 4px (Tailwind scale).

### Spacing scale
4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 60, 64, 80, 120, 180 (px).

### Border radius

| Element | Value | Notes |
|---------|-------|-------|
| Fine UI / badges / icons | 2px | `--radius-sm` |
| Ghost buttons, inputs (dashboard) | 8px | `rounded-lg` |
| Cards, panels (dashboard) | 12px | `rounded-xl` |
| Cards (help center) | 14px | `0.875rem` |
| Cards (marketing) | 24–28px | `rounded-[1.35rem]` |
| Placeholders (marketing) | 16px | inner |
| Primary buttons (marketing) | 50px (pill) | `rounded-full` |
| Tag chips | 50px (pill) | — |

### Shadows

| Name | Value | Use |
|------|-------|-----|
| `shadow-cu-xs` | whisper | icon buttons |
| `shadow-cu-sm` | whisper | secondary buttons |
| `shadow-cu-btn` | 0 1px 2px + inset ring | primary button |
| `shadow-cu-panel` | 0 1px 2px + ring | panels/cards |
| Marketing card | `0 1px 2px rgb(15 23 40 / 0.04)` | flat |
| Marketing panel | `0 24px 60px -36px` | elevated |
| Help center card | `0 8px 24px -16px` | hover lift |
| Hero floating (marketing) | `rgba(0,0,0,0.1) 0px 24px 70px` | floating card |

Shadows collapse to none in dark mode on dashboard.

### Layout

- Dashboard container: `max-w-6xl`, page padding `p-6 sm:p-8 lg:p-10`.
- Marketing container: max 1180px, `px-5 sm:px-8`.
- Help center: sidebar 300px, content max 72ch.
- Section padding: `py-16 sm:py-20 lg:py-24` (marketing 80–120px).
- Nav height: 64px (marketing), top chrome 6rem (dashboard).

---

## Motion

- `--cu-ease-out`: `cubic-bezier(0.23, 1, 0.32, 1)` (strong ease-out).
- `--cu-ease-in-out`: `cubic-bezier(0.77, 0, 0.175, 1)`.
- `--cu-ease-drawer`: `cubic-bezier(0.32, 0.72, 0, 1)` (iOS sheet).
- Durations: fast 150ms, ui 200ms.
- Respect `prefers-reduced-motion` (disable transforms/animations).
- Hover lift on buttons: `translateY(-1px)` (marketing, reduced-motion gated).
- Active press: `scale(0.96)`.

---

## Components

### Primary CTA Button (dashboard)
Brand coral fill `#c24e2a`, white text, `rounded-lg`, `px-3 py-1.5`, semibold
14px, `shadow-cu-btn` + inset ring. Hover darkens to `#aa3c1c`. The default
action color across the app.

### Primary CTA Button (marketing)
Signal `#d85a32`? No — marketing primary is ink `#0f1728` pill
(`marketing-v3-btn-primary`), white text, 50px radius, whisper shadow. Signal
color is for eyebrows/metrics/links, not the main button.

### Ghost Button
Transparent/white fill, 1px `--v3-line` or `--cu-border`, ink text, 8px
radius (dashboard) / pill (marketing ghost). Quiet alternative.

### Accent Button (publish/live)
Green `#15a056` fill, white text — reserved for publish/live/success only.

### Card (dashboard)
`.cu-panel` / `.cu-card`: white surface, `rounded-xl`, `ring-1
ring-zinc-950/[0.05]`, whisper shadow. Header via `.cu-panel-header`
(border-bottom, px-4 py-3).

### Card (marketing)
`.marketing-v3-card`: `rounded-[1.35rem]`, 1px `--v3-line` border, white
surface, soft shadow `0 1px 2px … 0 18px 40px -28px`.

### Card (help center)
`.hc-card`: `0.875rem` radius, 1px border, white surface, hover lifts
shadow.

### Input (dashboard)
`.cu-input` wrapper + `.cu-input__control`; composite field. Dark mode adds
inset ring via globals.css.

### Nav (marketing)
Sticky translucent `rgb(246 247 249 / 0.86)` + backdrop-blur, 1px line below,
wordmark left, center links, right Sign in (text) + Join early access (ink
pill). Mobile: hamburger → stacked.

### Hero (marketing)
Two-col grid `lg:grid-cols-[1.05fr_0.95fr]`, left text (chip → H1 → sub →
CTA row → trust line), right placeholder card with browser chrome. Flat white
wash, optional 6% peach radial.

### Help center sidebar
300px sticky, section labels uppercase 0.75rem, nav items 0.875rem, active
item medium weight + subtle bg.

---

## Surfaces (elevation)

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#fafafa` / `#f6f7f9` (marketing) / `#ffffff` (hc) | Page background |
| 1 | Surface | `#ffffff` | Cards, panels |
| 2 | Panel | `#f4f4f5` / `#f7f7f6` | Nested blocks |
| 3 | Soft Panel | `#e2e2e2`-ish stage `#eef1f6` | Placeholder fills |

---

## Do's and Don'ts

### Do
- Use tokens, never raw hex/rgb, when a token exists.
- Use brand (coral) as the default CTA; accent (green) only for
  publish/live/success.
- Keep marketing flat editorial: hairlines, no heavy shadows, huge display
  type, mono accents.
- Use `hc-*` for help center; dark mode via `data-theme`, not `.dark`.
- Respect `prefers-reduced-motion`.
- Pair black text on white for max contrast; graphite/muted only for meta.

### Don't
- Don't use accent (green) for general CTAs.
- Don't use `.dark` for help center or marketing.
- Don't add shadows in marketing beyond `0 1px 2px`.
- Don't introduce a second accent color for charts.
- Don't hardcode hex/rgb when a token exists.
- Don't use 50px radius on cards or inputs (pill is button/chip only).
- Don't set body text below 16px (mono 12px is annotation-only).

---

## Color discipline

The UI is near-monochrome with one coral brand. Every other color in the token
set is either: (1) a functional state (green publish, amber warn), (2) a
marketing decorative fill (stage, hero wash, signal-soft), or (3) a help-center
accent override. Do not introduce new chromatic colors into UI components.
Decorative pastels (lavender, peach, lilac, blush, aqua) are for marketing
illustrations only.

---

## Imagery

Marketing: product-faithful primitives (diff card, queue console, signal
ledger) are code-native; illustration slots are `.buuk-figma-frame`
placeholders replaced by Figma exports (webp/png @2×). Dashboard: no
lifestyle imagery; data, diffs, and docs are the visuals. Help center: article
media + changelog featured cards.

---

## Layout

Alternates generous whitespace bands (80–120px) with dense grids (4-col
community, 3-up trust). Left-aligned display headlines; reading line max 2xl
for standalone headings. Responsive: hero stacks, tables stack below copy,
3-up collapses 2→1, placeholders keep aspect ratios.

---

## Agent Prompt Guide

Quick color reference:
- background (dashboard): `#fafafa` (light) / `#09090b` (dark)
- text: `#18181b` (light) / `#d4d4d8` (dark)
- border: `#e4e4e7` (light) / `#18181b` (dark)
- muted text: `#71717a`
- brand/accent CTA: `#c24e2a` (dashboard) / `#d85a32` (marketing signal)
- publish/success: `#15a056`
- marketing paper: `#f6f7f9`, ink `#0f1728`

Example component prompts:

1. Dashboard primary button: `bg-cu-brand text-white rounded-lg px-3 py-1.5
   text-sm font-semibold shadow-cu-btn`, hover `bg-cu-brand-hover`.

2. Marketing hero headline: `marketing-v3-display` at 44/56px, ink
   `#0f1728`, -0.045em tracking, text-balance; eyebrow 11px uppercase signal
   `#d85a32`.

3. Help-center card: `hc-card` with `hc-page-title` (1.75–2.25rem, 600) and
   `hc-page-lead` muted.

4. Empty state: muted caption + single primary CTA, no illustration.

---

## Radius system

Four tiers: 2px (fine UI/badges/icons), 8px (ghost buttons, inputs,
dashboard cards' inner), 12–16px (cards), 50px (pill: primary marketing
buttons + chips). Never mix tiers within a component. Pill is action/chip
exclusive.

---

## Similar brands / references

- **Aside** — marketing editorial reference (flat, hairlines, huge display
  type, mono accents, censored-word gag, benchmark proof).
- **Toggl Track Reports** — Doc health overview pattern (KPI strip, 2
  charts, breakdown table).
- **Amplitude** — other reporting dashboards (selectable KPIs, gauge).
- **MasterClass/Spotify/Better Stack** — help center dark docs aesthetic.

---

## Quick start

### CSS custom properties (dashboard, light)

```css
:root {
  --cu-canvas: 250 250 250;
  --cu-surface: 255 255 255;
  --cu-border: 228 228 231;
  --cu-text: 24 24 27;
  --cu-text-secondary: 82 82 91;
  --cu-text-muted: 113 113 122;
  --cu-brand: 194 78 42;
  --cu-brand-hover: 170 60 28;
  --cu-accent: 21 160 86;
  --cu-accent-soft: 232 247 238;
  --cu-warn: 180 83 9;
  --cu-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --cu-duration-fast: 150ms;
  --cu-duration-ui: 200ms;
}
```

### Tailwind (v4) — marketing

```css
@theme {
  --color-v3-paper: #f6f7f9;
  --color-v3-elevated: #ffffff;
  --color-v3-ink: #0f1728;
  --color-v3-mute: #5b6475;
  --color-v3-signal: #d85a32;
  --color-v3-teal: #0f8a5f;
  --color-v3-stage: #eef1f6;
  --radius-pill: 50px;
  --radius-card: 24px;
  --shadow-flat: 0 1px 2px rgb(15 23 40 / 0.04);
}
```

### Import order

```css
@import "packages/ui/src/tokens.css";
@import "packages/ui/src/marketing-v3.css";
@import "app/globals.css";
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Source files

- `packages/ui/src/tokens.css` — core `cu-*` tokens.
- `packages/ui/src/marketing-v3.css` — marketing `v3-*` tokens + classes.
- `apps/web/src/app/globals.css` — dark overrides, `hc-*`, component classes.
- `DESIGN.md` — marketing editorial spec.
- `.agents/skills/buuk-design-system/SKILL.md` — concise skill (rules + recipes).
