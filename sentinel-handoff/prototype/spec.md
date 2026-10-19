# Prototype spec: Sentinel dashboard builder

The prototype demonstrates one decision: operators build their own dashboards from purpose-built widgets, or load a layout from a library. A second scenario shows the one exception, the maintainer's dedicated diagnostics page.

Visual reference for every state below lives in `../reference/screens/`. When this spec and a screen disagree on behavior, this spec wins. When they disagree on appearance, the screen wins.

## Scenarios

The case-study page wraps the prototype in a portfolio-level control (outside the console frame, styled by the portfolio, not by Sentinel):

| Scenario | Starts on | Purpose |
|---|---|---|
| Build a dashboard | Configuration library | The operator flow: pick, place, arrange, and save. |
| Maintainer diagnostics | Maintainer diagnostics page | The drill-down page maintainers get instead of widgets. |

Switching scenarios resets the console to that scenario's starting screen. Saved configurations persist across switches.

## Console shell (every screen)

Matches `Main.html` and every other screen.

* **Top bar** (`surface-sunken`, 1px bottom `border-subtle`, padding 10px 16px). Three groups that wrap on narrow widths:
  * Left: the word `SENTINEL`, 13px Inter 600, tracking 0.6px, `text-primary`. Nothing else.
  * Center: the **STOP** button (Danger variant, 24px horizontal padding, uppercase) and the system status: a 14px solid `status-nominal` circle followed by `SYSTEM NOMINAL` in `label-s`, `text-primary`. No outline.
  * Right, aligned end: the clock (`14:07:22Z`, Roboto Mono 14px, `text-secondary`), a 1×20px `border-default` divider, **Add widget** (Secondary, plus icon), a Save icon button, and a **Close console** icon button (X). The live playground uses Close console in place of the reference figures' Settings button.
* **STOP** is inert in the prototype. On click, show a small tooltip anchored to it: `Not active in this prototype`. It never navigates.
* **Close console** returns to the configuration library and is disabled when the library is already open. On the Maintainer page, it also switches the scenario to Build a dashboard. Unsaved changes open the existing `Discard changes?` dialog. **Keep editing** or Escape retains the draft and returns focus to Close console. **Discard** returns to the library without changing saved configurations. Focus moves to New configuration when the library opens.
* The **Save icon button** opens the Save dialog when in edit mode; in view mode it is disabled (40% opacity).
* **Add widget** from view mode enters edit mode on the current configuration and opens the picker. On the Maintainer page it is hidden.

## Screens and states

### 1. Configuration library (`Main.html`)

* Heading `Configurations` (`heading-l`) and a Primary **New configuration** button on the right.
* Section `LAYOUT LIBRARY` with count: one card per entry in `layouts.json` `library`. Each card shows a thumbnail (the layout drawn on a 12-column mini grid inside a `surface-sunken` well), the name, a persona tag in `label-s` `text-tertiary`, and meta in mono: `{n} widgets · 12×10`.
* Section `SAVED ON THIS CONSOLE` with count: a **Blank configuration** card first (dashed well with a plus icon, no meta), then one card per saved configuration with meta `{n} widgets · edited {time}`.
* Clicking a library or saved card loads it in **view mode** (screen 10).
* **New configuration** and **Blank configuration** open **edit mode** on an empty configuration named `New configuration`, with the picker open (screen 2).

### 2. Edit mode, picker open (`Picker.html`)

* An **edit bar** sits under the top bar (`surface-raised`, 1px bottom `border-default`): configuration name (`heading-m`), a flexible spacer, Ghost **Cancel**, Primary **Save configuration**. No chips, no helper text.
* The canvas shows a dot grid: 1px `border-strong` dots on a 24px pitch over `surface-base`. Dots appear only in edit mode.
* Empty canvas state: layout icon and `This configuration is empty` (`heading-m`), centered in the upper canvas. Nothing else.
* **Add widget** shows its pressed state (border `accent-default`, `aria-expanded="true"`).
* **Picker** is a 400px popover anchored under Add widget, right-aligned, `surface-overlay` with 1px `border-strong`, radius 8px:
  * Search field (`surface-sunken`, 36px tall). Focused on open. Filters by widget name, case-insensitive, as the user types.
  * Category filter: `All`, `Plots`, `Health`, `Scheduler`, `Logs`. Single select, `aria-pressed`. Selected pill: `surface-raised` fill, `accent-default` border, `text-primary`.
  * List grouped by category, each group headed by its name in `label-s` and a mono count. Each row: a 44×34 thumbnail glyph, the widget name (13px 500), and the default size in mono (`6×6`). No descriptions.
  * Footer: widget count in mono, right-aligned (`8 widgets`, updates with filters).
  * No results: `No widgets match` in `text-secondary`, centered in the list area.
* Closing: Escape, clicking Add widget again, or clicking outside. Focus returns to Add widget.

### 3 and 4. Hover preview (`Hover-Plot.html`, `Hover-Log.html`)

* Hovering or keyboard-focusing a picker row highlights it (`ink-700` fill, `border-strong` outline) and draws its **footprint** on the canvas at the first open position for its default size (see Placement).
* Footprint: `accent-tint-08` fill, 1px dashed `accent-default` border, radius 8px, with a tag in the top-left corner reading `{Name} · {w}×{h}` (mono 12px, `accent-default` text on `surface-sunken`, 1px accent border).
* If no position fits, the row stays enabled but the footprint is not drawn and the row's size label turns `status-caution` with the text `No room`. Clicking it does nothing.

### 5. Widget placed (`Placed.html`)

* Clicking a row (or pressing Enter on it) places the widget at the previewed position, closes the picker, and selects the new widget.
* A selected widget has a 1px `accent-default` border plus a 1px outer accent ring, a drag grip at the start of its header, and a 10px square resize handle at the bottom-right corner.
* Clicking empty canvas clears the selection. Clicking a widget selects it.

### 6. Move (`Move.html`)

* Drag by the widget header (the grip and title area; not the options button).
* While dragging: the origin cells show a 1px dashed `border-strong` outline; the snapped drop target shows the footprint style with a tag `Col {x+1} · Row {y+1}`; the dragged widget follows the pointer at 92% opacity with an accent border.
* The drop target only snaps to positions where the widget fits without overlapping another widget. If the pointer is over an occupied area, the target stays at the last valid position.
* Other widgets never move or compact to make room.
* Releasing drops the widget at the target and keeps it selected.

### 7. Resize (`Resize.html`)

* Drag the bottom-right handle. The live preview is a dashed `accent-default` outline with `accent-tint-06` fill and a size tag in its bottom-right corner (`9×7`).
* Snaps to whole cells. Stops at neighboring widgets and the right edge. Never goes below the widget's `minSize` from `widgets.json`.

### 8. Widget options (`Menu.html`)

* Each widget header has a 28px X button (`aria-label="Close {Name} widget"`) in both view and edit modes. It removes that widget immediately and offers **Undo** for 8 seconds. The remaining widgets stay in place. Undo restores the widget's position and order when the space is still available.
* In edit mode, an additional options button (`aria-label="{Name} options"`) opens a 220px menu, `surface-overlay`, 1px `border-strong`, radius 8px:
  * **Rename**: replaces the header title with an inline text input, Enter or blur to commit, Escape to cancel. Max 32 characters.
  * **Duplicate**: adds a copy at the first open position for its current size. If none fits, the item is disabled.
  * A divider, then **Remove widget** in `status-critical`. Removes immediately and shows a toast at the bottom of the canvas: `{Name} removed` with an **Undo** button, for 8 seconds.
* Menu items are `role="menuitem"`, arrow keys move between them, Escape closes and returns focus to the options button.

### 9. Save configuration (`Save.html`)

* Opened by **Save configuration** in the edit bar or the Save icon in the top bar.
* Modal dialog, 480px max, `surface-raised`, 1px `border-strong`, radius 8px, over a `scrim` backdrop. Focus is trapped; Escape closes.
* Fields: **Name** (required, prefilled with the current name, focused) and **Description · optional** (textarea, empty).
* Footer: Secondary **Cancel**, Primary **Save**. Save is disabled while Name is empty.
* Saving writes to `Saved on this console` (overwrite if editing an existing saved configuration; library presets always save as a new saved configuration), sets `editedAt` to the current UTC time as `HH:MMZ`, exits edit mode, and shows view mode (screen 10).

### Cancel

* **Cancel** in the edit bar with no changes exits to view mode (or the library, for a new configuration). With unsaved changes it opens a dialog: `Discard changes?`, Secondary **Keep editing**, Danger **Discard**.

### 10. Configuration in use (`Populated.html`)

* View mode: no edit bar, no dot grid, no selection, no drag or resize. Widgets render as Panels with a status dot, uppercase title, optional mono count, and an X button to close the widget. The live playground has no Widget settings menu or dialog.
* Closing a widget from view mode enters edit mode with an undoable draft. Saved configurations and library presets remain unchanged until Save. Saving a library preset creates a copy; saving an existing saved configuration overwrites that configuration.
* **Add widget** enters edit mode on this configuration with the picker open.

### 11. Maintainer diagnostics (`Maintainer.html`)

* Top bar without Add widget. Sub-bar (`surface-raised`): a **Dashboard** link (returns to the library), a chevron, `Diagnostics` (`heading-m`), a spacer, `Refreshed 14:07:22Z` in mono, and Secondary **Run self-test**.
* Left: `SUBSYSTEMS` panel listing all 10 subsystems from `maintainer.json`, each with a status dot, name, and Status Chip. The selected row gets `surface-overlay` and a 2px `accent-default` left rule, and `aria-current="true"`. Secondary sensor is selected on load.
* Right, for the selected subsystem: name (`heading-l`), Status Chip, and ID in mono; a row of four KPI panels (value in `data-xl`, colored by its status when it has one, unit and note in mono); a `{metric} · 6h` trend panel; then `COMPONENTS` (table) beside `FAULT LOG` (list, newest first).
* Trend chart: SVG, `accent-default` 2px line, dashed `status-caution` threshold line labeled `THRESHOLD {n}`, gridlines in `border-subtle`, mono axis labels in `text-tertiary`. Give it `role="img"` and an `aria-label` that states the trend and its relation to the threshold. When `trend` is null, show `No data` centered in `text-secondary`.
* **Run self-test**: button shows `Running…` disabled for 2 seconds, then appends `Self-test passed` (info) to the top of the selected subsystem's fault log with the current time, and updates `Refreshed` to that time.
* Clicking a subsystem swaps the detail area. No route change needed.

## Placement

* Grid: 12 columns, 56px rows, 12px gaps, 16px padding. Columns are fluid; rows are fixed height. The canvas grows downward; it never scrolls horizontally.
* First open position: scan rows from the top, and within each row scan columns left to right; the first (x, y) where a `w×h` box fits inside 12 columns without overlapping any widget wins. Search down to the lowest occupied row plus `h`, so a position always exists below everything unless the widget is wider than 12.
* Widgets never overlap and never auto-compact.

## Keyboard

| Context | Keys | Action |
|---|---|---|
| Picker list | Up / Down | Move focus between rows (focus also shows the footprint) |
| Picker list | Enter | Place the focused widget |
| Picker | Escape | Close picker |
| Selected widget | Arrow keys | Move one cell if the target is open |
| Selected widget | Shift + arrow keys | Resize one cell, within min size and neighbors |
| Selected widget | Delete or Backspace | Remove, with the same Undo toast |
| Selected widget | Escape | Clear selection |
| Canvas | Tab | Moves through widgets in reading order (top to bottom, left to right) |

Announce moves and resizes through a polite live region: `Situation Plot moved to column 4, row 1`, `Situation Plot resized to 9 by 7`.

## State model

```ts
type Widget = { i: string; type: WidgetType; x: number; y: number; w: number; h: number;
                title?: string; status: 'nominal'|'caution'|'critical'|'info'|'unknown'; count?: number };
type Config = { id: string; name: string; description: string; source: 'library'|'saved'|'new';
                editedAt?: string; widgets: Widget[] };

type ConsoleState = {
  scenario: 'build' | 'maintainer';
  screen: 'library' | 'console' | 'maintainer';
  mode: 'view' | 'edit';
  config: Config | null;        // what is on screen
  draft: Config | null;         // edit-mode working copy; committed on Save
  picker: { open: boolean; query: string; category: 'All'|'Plots'|'Health'|'Scheduler'|'Logs'; preview: WidgetType | null };
  selectedId: string | null;
  menuFor: string | null;
  renamingId: string | null;
  dialog: null | 'save' | 'discard' | 'exit';
  toast: null | { text: string; undo: Widget };
  saved: Config[];               // persisted to localStorage 'sentinel.savedConfigs'
  maintainer: { selectedId: string; refreshedAt: string };
};
```

New widgets get `status: 'nominal'` and no count.

## Acceptance criteria

1. Every screen in `reference/screens/` can be reached by clicking through the prototype and matches it visually at 1440px wide.
2. All colors, type, spacing, and radii come from `design-system/tokens.css`.
3. A user can complete: New configuration, add three widgets, move one, resize one, rename one, remove and undo one, save, and see it under Saved on this console after a page reload.
4. The same flow works with keyboard only.
5. No widget can overlap another, extend past column 12, or shrink below its minimum size.
6. Lighthouse accessibility score of 100 on the case-study page; axe reports no violations inside the prototype.
7. No em dashes in any UI string.
