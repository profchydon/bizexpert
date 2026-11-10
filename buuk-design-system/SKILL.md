---
name: buuk-design-system
description: >-
  Buuk design system (dashboard cu tokens, help center hc tokens, marketing v3):
  colors, typography, spacing, radius, shadows, motion, component classes, and
  Tailwind recipes. Use when building or editing Buuk UI, styling components,
  choosing colors/type/spacing, reviewing frontend code for visual consistency,
  or exporting/applying the Buuk look in another project.
---

# Buuk Design System

Buuk has three coordinated surfaces. Pick the right token set for the surface
you touch; never mix palettes across surfaces.

| Surface | Tokens | Theme | Where |
|---|---|---|---|
| Dashboard / app | `cu-*` | light + dark | `apps/web` dashboard, admin |
| Help center | `hc-*` | light + dark | `apps/web` help center |
| Marketing | `v3-*` | light only | `apps/marketing`, marketing pages |

Source files: `packages/ui/src/tokens.css`, `packages/ui/src/marketing-v3.css`,
`apps/web/src/app/globals.css`, `DESIGN.md`. Full token tables + class
inventory: [reference.md](reference.md).

## Portability (giving this to someone)

Tokens are RGB channels (space-separated) so Tailwind can inject alpha:
`rgb(var(--cu-brand) / 0.5)`. To reuse in another project, copy the `:root`
blocks from `tokens.css` + the `.dark` / `.help-center[data-theme="dark"]`
overrides from `globals.css`, and the `.marketing-v3` block from
`marketing-v3.css`. The hex values in the tables below are enough to recreate
the palette without the repo.

## Color tokens

### Dashboard `cu-*` (light)
Neutrals: canvas `#fafafa` (250 250 250), sidebar `#f4f4f5`, surface `#fff`,
panel `#f4f4f5`, border `#e4e4e7`, border-strong `#d4d4d8`, text `#18181b`
(pure black in dashboard scope), text-secondary `#52525b`, text-muted `#71717a`,
ink `#18181b`.

Brand (coral): brand `#c24e2a` (194 78 42), hover `#aa3c1c` (170 60 28),
coral `#e8784a`, peach `#f5c4a0`, lavender `#a894c4`, violet `#7a6b96`,
rose `#d4a8b5`, glow `#fff6e8`, soft `#fdefe8`, muted `#f5eae4`.

Functional: accent `#15a056` (21 160 86) publish/live/success only;
accent-hover `#128a4a`, accent-text `#047857`, accent-soft `#e8f7ee`.
Warn `#b45309` (180 83 9), warn-soft `#fdf4e7`.

### Dashboard `cu-*` (dark, `.dark`)
Canvas `#09090b`, sidebar `#0c0c0e`, surface `#111113`, panel `#131316`,
border `#18181b`, border-strong `#27272a`, text `#d4d4d8`, text-secondary
`#a1a1a1`, text-muted `#71717a`, ink `#d4d4d8`. Brand keeps flame hue
`#d85a32` (216 90 50); accent `#1cb860`; warn `#fcd34d`.

### Help center `hc-*`
Light: page `#fff`, surface `#fff`, surface-muted `#fbfbfa`,
surface-subtle `#f7f7f6`, border `#efefed`, border-strong `#e4e4e7`,
text `#18181b`, text-secondary `#3f3f46`, text-muted `#52525b`, accent
defaults `#18181b` (overridden per workspace).

Dark (`data-theme="dark"`): page `#09090b`, surface `#111113`,
surface-muted `#0c0c0e`, surface-subtle `#18181b`, border `#1a1a1c`,
border-strong `#2a2a2e`, text `#d4d4d8`, text-secondary `#a1a1aa`,
text-muted `#85858f` (AA on dark), accent `#fafafa`.

### Marketing `v3-*` (light only)
Paper `#f6f7f9`, elevated `#fff`, ink `#0f1728`, mute `#5b6475`,
line `rgb(15 23 40 / 0.08)`, signal `#d85a32`, teal `#0f8a5f`,
stage `#eef1f6`, hero-wash `#e8edf7`.

## Token rules

1. Use tokens, never raw hex/rgb, when a token exists.
2. Brand (coral) is the default CTA. Accent (green) is reserved for
   publish/live/success states only — never general CTAs.
3. Warn (amber) for attention only.
4. Dashboard titles are pure black in light mode; keep muted captions grey.
5. Marketing is flat editorial: hairline borders, no heavy shadows, huge
   stacked display type, mono accents.
6. Help center uses `hc-*`, not `cu-*`; dark mode via `data-theme`, not
   `.dark`.
7. No second accent color for charts.

## Typography

Font: Public Sans (`--font-sans`). Editorial variant adds Hanken Grotesk
(`.font-editorial`).

Dashboard scale: titles black, body secondary, captions muted. Mono for code:
`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`.

Marketing scale (from DESIGN.md):
- Display: Public Sans 700, -0.045em tracking, 1.05 leading, text-balance.
- H1: 44/56px, H2: 32/40px.
- Eyebrow: 11px / 600 / 0.16em uppercase, signal color.
- Body: 16-18px muted, 1.6 leading. Small meta: 12.5-13.5px muted.

## Spacing, radius, shadows

- Base spacing 4px (Tailwind scale). Container max 1180px, px-5 sm:px-8.
- Section padding py-16 sm:py-20 lg:py-24.
- Dashboard radius: buttons rounded-lg, cards/panels rounded-xl.
- Marketing radius: buttons pill (999px), cards 24-28px, placeholders 16px.
- Help center radius: cards 0.875rem, inputs 0.65rem.
- Shadows: dashboard whisper (`shadow-cu-xs/sm/panel`); marketing flat
  (0 1px 2px max); help center `0 8px 24px -16px`.

## Motion

- Easings: `--cu-ease-out` cubic-bezier(0.23,1,0.32,1),
  `--cu-ease-in-out` cubic-bezier(0.77,0,0.175,1),
  `--cu-ease-drawer` cubic-bezier(0.32,0.72,0,1).
- Durations: fast 150ms, ui 200ms.
- Always respect `prefers-reduced-motion`.

## Tailwind recipes

### Buttons (dashboard)
```html
<!-- primary (brand) -->
<button class="cu-btn-primary">Save changes</button>
<!-- secondary -->
<button class="cu-btn-secondary">Cancel</button>
<!-- ghost -->
<button class="cu-btn-ghost">Edit</button>
<!-- accent (publish/live/success only) -->
<button class="cu-btn-accent">Publish</button>
<!-- icon -->
<button class="cu-icon-btn" aria-label="Settings">…</button>
```

### Surfaces (dashboard)
```html
<section class="cu-page-shell">
  <div class="cu-page-container">
    <div class="cu-panel">
      <div class="cu-panel-header">Title</div>
      <div class="cu-page-section">…</div>
    </div>
  </div>
</section>
```

### Inputs (dashboard)
```html
<div class="cu-input">  <!-- wrapper -->
  <input class="cu-input__control" />
</div>
<textarea class="cu-textarea"></textarea>
<select class="cu-select"></select>
```

### Marketing hero (editorial)
```html
<section class="marketing-v3 marketing-v3-hero">
  <h1 class="marketing-v3-display">Your product ships weekly.</h1>
  <p class="text-[var(--v3-mute)]">…</p>
  <a class="marketing-v3-btn marketing-v3-btn-primary">Join early access</a>
  <a class="marketing-v3-btn marketing-v3-btn-ghost">See a live help center</a>
</section>
```

### Help center card
```html
<article class="hc-card">
  <h2 class="hc-page-title">Title</h2>
  <p class="hc-page-lead">…</p>
</article>
```

## Dark mode checklist

- Dashboard: toggle `.dark` on `<html>`; tokens swap via `.dark` block.
- Help center: set `data-theme="dark"` on `.help-center`; never use `.dark`.
- Marketing: no dark mode — do not add.
- Shadows collapse to none in dark (`shadow-cu-*` → none).
- Inputs get inset ring in dark via globals.css.
- Test contrast: text-muted must stay AA on dark surfaces.

## Voice & content

Editorial, calm, declarative. CTA labels: "Join early access" (primary),
"See a live help center" (secondary). Metrics plain language + citation
("Feeds from 27+ tools", "Nothing publishes without review"). Eyebrows 1-2
words uppercase, tracking wide, signal color. Errors explain what happened
and how to fix; never vague.

## Do / don't

Do:
- Import `tokens.css` + `marketing-v3.css` first, then app globals.
- Use `rgb(var(--cu-x) / <alpha>)` for alpha.
- Reuse existing classes before creating new ones.

Don't:
- Hardcode hex/rgb when a token exists.
- Use accent (green) for general CTAs.
- Use `.dark` for help center or marketing.
- Add new palette colors or a second chart accent.
- Add shadows in marketing beyond 0 1px 2px.

## Accessibility

- Focus rings: brand-tinted (`ring-cu-brand/30`–`/40`) on dashboard; accent
  on help center.
- Keyboard focus visible on all interactive elements.
- Reduced motion respected.
- Touch targets ≥ 44px where possible.
- Text contrast AA minimum (muted tokens tuned for this).

## When adding new UI

1. Check `globals.css` class inventory (see [reference.md](reference.md))
   before creating new classes.
2. Match radius/shadow to surface conventions.
3. Add dark overrides if dashboard/help-center.
4. Verify build: `pnpm --filter @buuk/web build` / `@buuk/marketing build`.

## Additional resources

- Full token + class reference: [reference.md](reference.md)
- Marketing editorial spec: `DESIGN.md`
- Source: `packages/ui/src/tokens.css`, `packages/ui/src/marketing-v3.css`,
  `apps/web/src/app/globals.css`
