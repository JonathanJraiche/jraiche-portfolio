# Sentinel components used by the prototype

All values reference `tokens.css`. Sizes are in px. Source of truth for the system: the Sentinel Operator Console design system (Night Ops).

## Button

| Variant | Fill | Border | Label | Use |
|---|---|---|---|---|
| Primary | `accent-default` | none | `text-inverse` | The one expected action in a region (Save, New configuration) |
| Secondary | `surface-overlay` | 1px `border-default` | `text-primary` | Alternatives (Add widget, Run self-test, Cancel in dialogs) |
| Ghost | transparent | none | `text-secondary` | Low-emphasis or dismissive (Cancel in the edit bar) |
| Danger | `status-critical` | none | `text-inverse` | Destructive or emergency (STOP, Discard) |

* Height 32, padding 0 16, radius `radius-md`, `label-m` (Inter 500 13/16, tracking 0.1). Icon 16px, gap 8.
* Hover: border becomes `border-strong` (Ghost also gets `surface-overlay` fill).
* Focus: 2px `focus-ring` outline, 2px offset.
* Pressed or expanded (Add widget with picker open): border `accent-default`.
* Disabled: 40% opacity, `not-allowed` cursor.

## Icon button

32×32 (28×28 in widget headers), transparent, radius `radius-md`, 16px stroke icon in `text-secondary` (1.75 stroke, round caps). Hover and focus as Ghost. Always has `aria-label`.

## Status Chip

Outlined pill: 1px border and text in the status color, 6px dot, `label-s` uppercase, padding 2 8, `radius-pill`. Statuses: nominal, caution, critical, info, unknown, priority. The word is always present.

## System status (top bar)

Not a chip. A 14px solid circle in the status color, gap 8, then the label in `label-s` uppercase `text-primary`. No border.

## Panel and Widget

* Container: `surface-raised`, 1px `border-default`, radius `radius-lg`.
* Header: `surface-overlay`, 1px bottom `border-subtle`, padding 6 6 6 16, gap 8. Contents: 6px status dot, title in `label-s` uppercase `text-secondary`, flexible spacer, optional count in mono 12 `text-tertiary`, options icon button (28px).
* Body: fills the remaining height; content centered until the content pass.
* Selected (edit mode): border and 1px outer ring in `accent-default`, a 16px grip icon in `text-tertiary` before the status dot, and a 10×10 resize handle at the bottom-right corner (`accent-default` fill, 2px `surface-base` border, radius 2).

## Placement footprint and previews

* Footprint (hover preview and move target): `accent-tint-08` fill, 1px dashed `accent-default`, radius `radius-lg`, padding 12. Tag: mono 12 `accent-default` on `surface-sunken`, 1px `accent-default`, radius `radius-md`, padding 4 8.
* Move origin: 1px dashed `border-strong`, no fill.
* Resize preview: `accent-tint-06` fill, 1px dashed `accent-default`, size tag in the bottom-right corner.

## Popover and menu

`surface-overlay`, 1px `border-strong`, radius `radius-lg`. Menu items 32 tall, padding 0 10, radius `radius-md`, icon 16 in `text-secondary`, label `label-m` `text-primary`. Hover or focus: `ink-700` fill. Destructive item: label and icon `status-critical`. Divider: 1px `border-default`, margin 6 4.

## Inputs

`surface-sunken` fill, 1px `border-default`, radius `radius-md`, height 36, padding 0 12, Inter 14/20 `text-primary`, placeholder `text-tertiary`. Focus: border `accent-default`. Labels above in `label-s` uppercase `text-secondary`, gap 6.

## Dialog

Max width 480, `surface-raised`, 1px `border-strong`, radius `radius-lg`. Header: title `heading-m` plus close icon button, padding 14 16, 1px bottom `border-default`. Body padding 16, gap 16. Footer: right-aligned buttons, gap 8, padding 12 16, 1px top `border-default`. Backdrop: `scrim`.

## Data table (maintainer page)

Header cells `label-s` uppercase `text-tertiary`, padding 10 16, 1px bottom `border-subtle`. Body: names in `label-m` `text-primary`; readings in mono 12 (`status-caution` when that row is caution, else `text-secondary`); times in mono 12 `text-tertiary`. Wrap the table in a horizontal scroll container.

## Contrast notes

`text-tertiary` passes 4.5:1 on `surface-base`, `surface-raised`, `surface-sunken`, and `surface-overlay`, but fails on `ink-700` (3.81:1). Never place tertiary text on a hovered menu or picker row; use `text-secondary` there.
