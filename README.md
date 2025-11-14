# ButterflyOS Docs

Static knowledge base for ButterflyOS based on Next.js 16, Tailwind CSS 4 and
Shadcn UI primitives.

## Development

```bash
pnpm install
pnpm dev
```

The site is fully static: every article is loaded at build time from Markdown
files, so no API routes or server functions are required.

## Editing articles

All the content lives inside `content/docs`. Each article/translation pair is a
plain Markdown file named with the pattern `<slug>_<LANG>.md`, for example:

- `introduzione_IT.md`
- `introduzione_EN.md`

### Front matter

Every file needs a front-matter block so the navigation sidebar can be built:

```yaml
---
slug: contatti            # URL segment /guide/{lang}/contatti
lang: it                  # Lowercase language code shown in the toggle
title: Contatta l'assistenza
description: Tutte le modalità di supporto
icon: headset             # One of the keys exported by config/docs.ts
hero: /images/banner.png  # Optional header image displayed above the tag
section: Contatti         # Group title in the navigation
sectionOrder: 2           # Position of the group (lower = before)
order: 2                  # Position of the page within the group
tag: support              # Optional badge key (see config/doc-tags.ts)
---
```

Add as many sections or pages as you like—just keep the `slug` identical between
languages so the toggle knows how to switch.

### Markdown formatting

The body accepts regular Markdown plus GitHub-flavoured Markdown (tables,
auto-links, task lists, etc.). A few conventions keep the UI consistent:

- Blockquotes become callouts. Use `**Title**` on the first line to set the
  callout preset, for example `**Suggerimento**` or `**Warning**`. Colors,
  icons and translations are editable in `config/callouts.ts`.
- Aggiungi un `-` subito dopo il selettore per trasformare callout e sezioni in
  elementi collassabili (chiusi di default):
  - `>-**Tip**` per un callout richiudibile.
  - `###- Sezione avanzata` per comprimere tutto il contenuto fino al prossimo
    heading della stessa profondità.
- To display a hero/banner inside the header card, set `hero` to any public
  image path (ideally a wide, short PNG/SVG/JPG). The image renders above the
  tag and resizes automatically across light/dark modes.
- Inline icone Lucide: scrivi `::Sun::`, `::ShieldCheck::`, ecc. ovunque nel
  testo e il renderer li trasformerà automaticamente nell'icona corrispondente.
- Images use standard Markdown syntax. Place the assets in `public/` (e.g.
  `![Support team](/logo.png)`).
- Lists, headings, inline code and fenced code blocks are automatically styled
  with the Shadcn theme, so no extra wrappers are necessary.

### Translations & language toggle

Create one file per language for the same `slug`. The navbar button cycles
through the available languages for the current page (it disables itself if a
slug only has one translation). Routes follow the pattern
`/guide/{lang}/{slug}`, meaning `/guide/en/contatti` and `/guide/it/contatti`
are built from the files displayed above.

### Tag & colors

Badges shown above each article title are driven by the `tag` field. Customize
their label translations and light/dark colors by editing
`config/doc-tags.ts`. Every entry exposes:

- `translations`: map of language code → label (fallbacks to `it`).
- `colors`: Tailwind classes for background/text/ring in light & dark themes.
