# Sentinel case study: Codex handoff

Build a case study page in the portfolio for **Sentinel**, a fictional operator console, with a clickable prototype of the dashboard builder embedded in it. Everything in this folder is the source of truth. Read this file first, then the files it points to.

## Prompt to start Codex

> Read `sentinel-handoff/CODEX_HANDOFF.md` and every file it references. Build the Sentinel case study page and its embedded prototype in this repo, following the existing routing, layout, and content conventions. Use `design-system/tokens.css` for every color, type, spacing, and radius value inside the prototype; do not invent values. Match the screens in `reference/screens/` exactly. Implement the behavior in `prototype/spec.md` and load data from `prototype/data/`. Write the page copy from `case-study/content.md`, leaving every `[BRACKETED]` placeholder visible for me to fill in. When done, list anything in the spec you could not implement and why.

## What is in this folder

| Path | What it is |
|---|---|
| `case-study/content.md` | Page structure and draft copy, section by section, with where each screen or the prototype goes. |
| `prototype/spec.md` | The prototype: screens, state model, every interaction, grid rules, keyboard support, and acceptance criteria. |
| `prototype/data/widgets.json` | The 8-widget catalog with categories, default sizes, and minimum sizes. |
| `prototype/data/layouts.json` | The 3 library presets (one per persona) and 2 seeded saved configurations. |
| `prototype/data/maintainer.json` | Data for the maintainer diagnostics page, all 10 subsystems. |
| `design-system/tokens.css` | CSS variables for the Sentinel system plus the builder grid. Import once, scoped to the prototype. |
| `design-system/tokens.json` | The same tokens as data, with usage notes. |
| `design-system/components.md` | Specs for every component the prototype uses. |
| `design-system/reference-components.css` | Working CSS for Button, Status Chip, Alert Banner, Track Row, and Panel. Reference, not required. |
| `reference/screens/*.html` | The 13 approved screens as standalone HTML. Open `index.html`. These are the visual spec. |

## Hard rules

1. **Night Ops only.** There is no light theme for the prototype. The prototype keeps its dark palette even if the portfolio page around it is light.
2. **Scope the styles.** Sentinel tokens apply inside the prototype and the case-study screen figures only. Do not let them leak into the portfolio's global styles.
3. **No em dashes** anywhere in copy or UI strings. Use the Oxford comma.
4. **Fictional and sanitized.** Sentinel is not derived from any real program. Do not add realistic military, sensor, or mission language beyond what the data files contain.
5. **Placeholders stay visible.** Widget bodies show `[WIDGET NAME CONTENT]` until a later content pass. Case-study placeholders like `[TIMELINE]` stay in brackets.
6. **Real controls.** Every interactive element is a real `button`, `a`, `input`, or `select`. Icon-only buttons get `aria-label`. Dragging always has a keyboard alternative (WCAG 2.2, 2.5.7).
7. **Fonts.** Inter for interface text, Roboto Mono for every number, ID, and timestamp.

## Recommended implementation

* **Grid engine:** `react-grid-layout` with `cols=12`, `rowHeight=56`, `margin=[12,12]`, `containerPadding=[16,16]`, `compactType={null}`, `preventCollision={true}`, `isBounded={true}`, and a custom `draggableHandle` on the widget header. It matches the spec's rules (no auto-compaction, no overlap, snap to cells) with the least custom code. Add the keyboard move and resize handlers yourself.
* **State:** a single reducer for the console (see the state model in `prototype/spec.md`). Persist saved configurations to `localStorage` under `sentinel.savedConfigs`, falling back to `layouts.json` seeds. Add a "Reset prototype" link outside the console frame.
* **Embedding:** render the prototype in a framed region on the case-study page with a 16:10 aspect ratio at desktop widths, min width 1024px. Below 1024px, show the static screens from `reference/screens/` as images with a one-line note that the prototype runs on wider screens.
* **Motion:** keep transitions under 150ms and disable them under `prefers-reduced-motion`.

## Before publishing

* Run the page past the security review you already confirmed covers this workflow.
* Fill every `[BRACKETED]` placeholder in the case study.
* Second design pass: widget body content. The spec marks where it plugs in.
