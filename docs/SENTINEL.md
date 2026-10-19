# Sentinel case study

Implementation branch: `feature/sentinel-case-study` in the `portfolio-site` repository.

## Run locally

Use Node.js 24, the same version as the existing deployment workflow.

```sh
npm ci
npm run dev
```

Open `http://localhost:5173/#/work/sentinel`. The header's Work link and the home-page case-study link open the same page. The hash route works with the current GitHub Pages deployment without a server rewrite.

```sh
npm run build
npm test
npm run audit:sentinel
npm run audit:sentinel:states
```

The audit commands expect the development server at `http://127.0.0.1:5173` and a local Google Chrome installation. Override `SENTINEL_AUDIT_URL` for the page audit or `SENTINEL_AUDIT_ORIGIN` for the state fixtures. The state-fixture HTML entry is development-only and is absent from `dist`.

## How style isolation works

1. The original `sentinel-handoff/design-system/tokens.css` is left intact. `scripts/prepare-sentinel.mjs` parses that file and changes its `:root` selector to `.sentinel-scope`. Variables are declared only on the prototype and Sentinel figure wrappers. They inherit into each wrapper's descendants.
2. The same generator changes `.heading-l`, `.data-s`, and the other type utilities to `.sentinel-scope .heading-l`, `.sentinel-scope .data-s`, and so on. Those generic names cannot style portfolio elements outside the wrapper.
3. All console rules in `src/features/sentinel/sentinel.css` begin with `.sentinel-scope`. The small set of required grid-engine rules is implemented within that boundary, using the supplied tokens. The grid library's global stylesheet is not imported.
4. Portfolio rules can still inherit into a nested component. Sentinel explicitly resets headings, sections, controls, focus outlines, text selection, colors, and fonts inside its wrapper. This prevents the portfolio's global section padding, Archivo heading font, oxblood focus treatment, and IBM Plex Mono font from changing the console.
5. The case-study prose, scenario selector, and reset link use portfolio styling. Inter and Roboto Mono are self-hosted. Font-face definitions do not assign fonts to elements.
6. Geometry values not named individually in the token sheet are the supplied reference/component measurements expressed using existing spacing tokens and `calc()`. Grid dimensions are read from the computed grid tokens for the pointer, keyboard, and footprint calculations.

To refresh generated styles and figures after editing handoff assets:

```sh
npm run sentinel:prepare
```

Figures are self-contained SVG images with XHTML layout and embedded font files. Their content comes from the supplied HTML screens. Layout-library thumbnail positions and counts are replaced from `layouts.json`. The SVG's internal styles are isolated by the image boundary.

## Components and state

- `SentinelCaseStudy.jsx` reads the supplied Markdown copy directly and renders the portfolio narrative, figures, two embeds, and component examples.
- `SentinelPrototype.jsx` owns the console reducer, saved-configuration provider, scenario controls, dialogs, tooltip state, and timers.
- `Library.jsx`, `Picker.jsx`, `WidgetCanvas.jsx`, `Diagnostics.jsx`, and `Controls.jsx` render the console.
- `model.js` owns placement, collision validation, minimum sizes, cloning, persistence validation, and reducer transitions.
- Saved configurations use `sentinel.savedConfigs`. The two embeds share saved data. Scenario switches reset the active screen without deleting saved configurations. Reset restores the supplied seeds.
- The grid uses react-grid-layout 1.5.4 with the handoff's flat-prop configuration, 12 columns, 56px rows, 12px gaps, 16px padding, no compaction, collision prevention, and bounded dragging. It reserves space below occupied rows for downward movement.

## Acceptance criteria

1. **PASS:** The 11 prototype states are reachable: library, picker, two footprint previews, placed widget, move, resize, widget options, Save dialog, configuration in use, and maintainer diagnostics. Console renders were inspected at 1440px. The two explored concepts remain static figures, as agreed. Screens use the supplied palette, measurements, and typography. Library thumbnails and counts follow the JSON files.
2. **PASS:** Sentinel styles are scoped and token-based. Automated checks at 1440px, 1024px, and 390px confirm that `--surface-base` is absent on the portfolio body and that portfolio metadata keeps IBM Plex Mono while console data uses Roboto Mono.
3. **PASS:** Browser walkthrough: create, add three widgets, move, resize, rename, remove, undo, save, reload, and find the saved configuration in the library. Reducer tests also cover persistence, overwriting saved entries, saving library copies, invalid storage, and undo after an intervening placement.
4. **PASS:** The same browser flow completed with keyboard activation, arrow movement, Shift and arrow resizing, inline rename, Delete, Undo, and Save. Picker focus previews footprints. Dialog focus stays inside; Escape closes the picker or dialog. Moves and resizes announce through a polite live region. Widget DOM order follows row and column order.
5. **PASS:** Shared placement validation rejects collisions, negative positions, fractional cells, out-of-bounds columns, and dimensions below the catalog minimum. Pointer dragging and resizing were exercised in the browser. A mixed session of 200 widget placements passes without overlap.
6. **PASS:** Lighthouse desktop and mobile accessibility scores: **100**. Axe reports **zero violations** on the complete page at 1440px, 1024px, and 390px, and in 16 rendered console states, including dialogs, menus, inline rename, Undo, and unknown diagnostics. Reports are saved in this directory. Automated audits do not replace assistive-technology user testing.
7. **PASS:** No em dashes in rendered UI strings. Both source and rendered-page checks pass. Supplied prose is preserved, including its placeholders.

## Additional verification

- Production build passes.
- Nine model tests pass.
- No horizontal page overflow at 1440px, 1024px, or 390px.
- Below 1024px, both live consoles are unmounted. The builder shows four fallback figures, and diagnostics shows its fallback figure.
- Reduced motion produces zero transition durations inside the console.
- Pointer drag and resize, search and no-results, view-mode settings, cancel without changes, Keep editing, Discard, unknown subsystem details, and the two-second self-test were checked in the browser.

## Changes and limits

- Routing uses the existing React/Vite app and a hash URL for GitHub Pages. No framework migration was made.
- The two explored approaches are figures, not interactive prototype states.
- Static figures are generated SVG images rather than raster screenshots. This keeps the supplied HTML layout and embedded fonts self-contained and sharp when scaled.
- A small sticky top bar keeps global controls visible while taller console content scrolls vertically. The console frame retains the desktop 16:10 ratio.
- Widget bodies and widget settings retain the handoff placeholders. STOP and console settings show the specified inactive tooltip.
- Move and resize are transient pointer states. The state-audit fixtures check their committed geometry; manual pointer checks cover the live interactions. No automated pixel-diff baseline was generated from the original reference HTML.
- Backend micro frontends are described by the case-study copy; this is a local clickable prototype with localStorage, as specified.
- The requested visible widget placeholders are intentional prototype content. The release review below covers the local implementation before publication.


## Release review, October 19, 2026

| Dimension | Risk | Review result |
| --- | --- | --- |
| Security | Low | No release blockers found. React renders copy and user-entered names as text; saved data is validated before loading. The production dependency audit reports zero vulnerabilities. No credentials were found in application code. |
| Correctness | Low | All nine model tests pass. The production build passes with the same relative base used by GitHub Pages. Existing browser checks cover the builder, persistence, navigation, desktop, mobile, and reduced motion. |
| Performance | Low | The case study is loaded on demand. Fonts and figures are self-hosted. Work-card timers have cleanup, and motion respects reduced-motion settings. |
| Maintainability | Low | Content, state transitions, UI components, tokens, and asset preparation remain separate. The existing React/Vite framework and deployment workflow are retained. |

The GitHub Pages artifact contains `dist` only. Development audit fixtures, source handoff files, and local reports are excluded from that deployment artifact.
