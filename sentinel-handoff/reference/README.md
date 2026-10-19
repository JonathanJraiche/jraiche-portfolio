# Reference screens

Open `screens/index.html`. Each file is a standalone HTML render of an approved screen from the design canvas. They load Inter and Roboto Mono from Google Fonts and need no build step.

Use them as the visual spec: layout, spacing, color, and type. They are static. Behavior lives in `../prototype/spec.md`.

| File | Screen |
|---|---|
| `Explored-Tabs.html` | Explored and rejected: tabbed views |
| `Explored-RoleLogin.html` | Explored and rejected: fixed layouts by sign-in role |
| `Main.html` | 1. Configuration library |
| `Picker.html` | 2. Edit mode, picker open |
| `Hover-Plot.html` | 3. Hover preview, 6×6 |
| `Hover-Log.html` | 4. Hover preview, 3×10 (Logs filter) |
| `Placed.html` | 5. Widget placed and selected |
| `Move.html` | 6. Move |
| `Resize.html` | 7. Resize |
| `Menu.html` | 8. Widget options |
| `Save.html` | 9. Save configuration |
| `Populated.html` | 10. Configuration in use |
| `Maintainer.html` | 11. Maintainer diagnostics |

Known differences to resolve in favor of the data files: library card thumbnails and widget counts in `Main.html` were drawn by hand. In the build, render thumbnails and counts from `../prototype/data/layouts.json` (Oversight has 6 widgets; My watch layout has 6, matching `Populated.html`).

The two "Explored" screens are case-study figures, not prototype states.
