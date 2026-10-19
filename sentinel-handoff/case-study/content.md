# Case study: Sentinel

Page structure and draft copy. Write the copy as given; keep every `[BRACKETED]` placeholder visible. Figures reference files in `../reference/screens/`. Section headings are suggestions; follow the portfolio's existing case-study template if it has one.

---

## Hero

**Title:** Sentinel: letting operators build their own console

**One-line summary:** Sentinel is a clean-room, sanitized system built for this case study. It reproduces a real design problem I encountered and my process, not any real program's screens or data.

**Meta row:** Role: Lead Designer and Researcher · Timeline: 6 months (3 research, 3 design iteration) · Team: Sole designer with 20+ developers · Tools: Figma

**Hero figure:** `Populated.html` (Configuration in use).

---

## The problem

I was charged with performing a 3-month research study to identify user needs for a console application that would combine existing tool capabilities across various domains. I found that the console would have to serve a much wider range of roles than the team initially expected. Their needs grouped into three personas that rarely overlapped:

* **Operators** do the hands-on work in the system and need their working tools in front of them at once.
* **Supervisors** need to see what operators are doing, along with high-level health and status.
* **Maintainers** need to drill into health and status for very specific information.

A single fixed layout either buried each group's essentials or crowded the screen with things only someone else needed.

**Figure:** three persona cards in a row, each with the persona name and the one-line need above. Build these with portfolio styling, not Sentinel styling.

---

## My role and the study

I was the only designer on a team of more than 20 developers and 2 project managers, and I led both design and research. I was given a three-month study to understand how each persona actually worked, followed by three months of design iteration and review with the team and stakeholders.

I had full ownership of how the research was run. The constraint was access: time with end users and stakeholders was limited, so every session had to earn its slot. I mixed methods to get the most out of it:

* **One-on-one interviews** to understand each persona's work in depth.
* **Group studies** to see where needs overlapped and where they conflicted.
* **Surveys** to reach more users than live sessions allowed.
* **A/B tests** comparing three approaches: tabbed views, building a dashboard by adding widgets, and loading a saved layout. The final design combines the last two.

The interviews drove the decision. They showed a much wider breadth of user roles than the team had planned for, wide enough that the solution the developers were already proposing would not hold up. At the end of the study I proposed the widget-based approach to stakeholders. It was approved, and design iteration began.

---

## What I tried first

### Tabbed views

Each tool got its own tab. It kept every view uncluttered, but only one view was visible at a time. Operators and supervisors both needed related widgets side by side to do their jobs, and tabs split that context apart.

**Figure:** `Explored-Tabs.html`, caption: `Tabbed views: clean, but one view at a time.`

### Fixed layouts by sign-in role

The console would load a layout for whoever signed in: operator, supervisor, or maintainer. It addressed the persona problem on paper, but it required role-aware sign-in and layout routing the platform did not have, and the result was still a fixed layout per role. Any engineering investment had to pay for itself, and that work bought less than the alternative: moving the console to a micro frontend architecture.

**Figure:** `Explored-RoleLogin.html`, caption: `Fixed layouts per role: right idea, wrong investment.`

---

## The decision

Let people build the console themselves. Every capability became a widget with a single purpose, and anyone can assemble the widgets they need on a 12-column grid. A layout library gives each persona a sensible starting point, so nobody begins from a blank canvas.

### Why micro frontends made this work

In a micro frontend architecture, the interface is split into independently built and deployed pieces that a host application, the shell, composes at runtime. That mapped directly onto the design:

* **The shell owns the frame.** Layout, the grid, saved configurations, and the global controls (STOP and system status) live in the shell. They behave the same no matter which widgets are on screen.
* **Widgets are the deployable units.** Most widgets were their own micro frontend. A few that shared the same data and always shipped together lived in one micro frontend that exposed several widgets. The boundary followed what belonged together, not one-widget-per-repo for its own sake.
* **New capability without a console release.** A new widget could ship on its own release cadence and appear in the picker without touching the shell.
* **Failure stays contained.** Because each widget loads independently, one failing widget should not take the console down with it. That made per-widget loading, empty, and error states part of the design, not an afterthought.
* **One design system across all of it.** Independently built pieces only feel like one product if they share tokens and components. The Sentinel system is what kept every widget consistent.

### Key interaction decisions

* **Preview before you place.** Hovering a widget in the picker shows its footprint on the grid at its default size. People see where it will land and how much room it takes before committing.
* **Nothing moves unless you move it.** Widgets never auto-rearrange. Operators build muscle memory around where things are, so the grid only snaps; it never reshuffles.
* **A shared starting point.** The layout library holds one preset per persona. Saved configurations stay on the console.
* **The global controls never move.** All header controls stay fixed in the top bar of every screen, regardless of layout.

---

## Try it

**Embed:** the clickable prototype, scenario "Build a dashboard". Above it, one line:

`Load a layout or start blank, add a few widgets, then move, resize, and save.`

Below 1024px wide, replace the embed with `Main.html`, `Hover-Plot.html`, `Move.html`, and `Populated.html` as a sequence of figures.

---

## How the builder works

A short walkthrough with one figure per step. Captions only, no extra body copy.

1. `Picker.html`: `Widgets are grouped by purpose and searchable.`
2. `Hover-Plot.html`: `Hovering previews the widget's size and position.`
3. `Hover-Log.html`: `Each widget has its own default footprint.`
4. `Move.html`: `Moves snap only to open cells.`
5. `Resize.html`: `Resizing stops at neighbors and minimum sizes.`
6. `Menu.html`: `Each widget carries its own options.`
7. `Save.html`: `Saved configurations stay on the console.`

---

## The exception: maintainers

Widgets worked for watching and acting. They did not work for diagnosis. Maintainers needed to move from a subsystem to its components to its fault history quickly, and a grid of independent widgets made that path longer, not shorter. So maintainers got their own page built around drilling down.

**Embed:** the prototype, scenario "Maintainer diagnostics". Fallback figure: `Maintainer.html`.

---

## The design system

Sentinel runs on a small system built for operator density: neutral ink surfaces, color reserved for status, monospaced numbers so columns hold still while values refresh, and every status paired with a word, never color alone.

**Figure:** a strip showing the five components (Button variants, Status Chips, Alert Banner, Track Row, Panel). Build it from `../design-system/components.md` using the Sentinel tokens.

---

## Outcome

Stakeholders approved the move to a micro frontend architecture where users build the dashboard they need, and end users responded well to it. It is in development now.

The bigger change was the direction. The team was heading toward a solution that fit the roles it assumed it had. Research showed the real range of roles, and the product changed course before that mismatch was built.
