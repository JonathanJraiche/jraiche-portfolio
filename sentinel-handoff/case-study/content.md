# Case study: Sentinel

Page structure and draft copy. Write the copy as given; keep every `[BRACKETED]` placeholder visible. Figures reference files in `../reference/screens/`. Section headings are suggestions; follow the portfolio's existing case-study template if it has one.

---

## Hero

**Title:** Sentinel: letting operators build their own console

**One-line summary:** Sentinel is a sanitized system built for this case study. It reproduces a real design problem I encountered and my process, not any real program's screens or data.

**Meta row:** Role: Lead Designer and Researcher · Timeline: 6 months (3 research, 3 design iteration) · Team: Sole designer with 20+ developers · Tools: Figma

**Project summary:** I designed a configurable console to shorten the time from decision to execution. After the design-system handoff, the team implemented **10 to 12 widgets per month**, up from **1 to 3**.

**Hero figure:** `Populated.html` (Configuration in use).

---

## The problem

The project supported a high-stakes environment where decisions often had to be made quickly, with little room for error. Operators had to switch between applications to carry out those decisions. The goal was to shorten the time from decision to execution, our primary KPI, by bringing those tools into one console.

I led a three-month research study to understand what users needed from the combined console. I found that it would have to serve a much wider range of roles than the team initially expected. Their needs grouped into three personas that rarely overlapped:

* **Operators** do the hands-on work in the system and need their working tools in front of them at once.
* **Supervisors** need to see what operators are doing, along with high-level health and status.
* **Maintainers** need to drill into health and status for very specific information.

A single fixed layout either buried each group's essentials or crowded the screen with things only someone else needed.

**Figure:** three persona cards in a row, each with the persona name and the one-line need above. Build these with portfolio styling, not Sentinel styling.

---

## My role and the study

I was the only designer on a team of more than 20 developers and 2 project managers, and I led both design and research. I was given a three-month study to understand how each persona actually worked, followed by three months of design iteration and review with the team and stakeholders.

I had full ownership of how the research was run. The constraint was access: time with end users and stakeholders was limited, so every session had to earn its slot. I mixed methods to get the most out of it:

* **One-on-one interviews** with roughly 15 participants, with two rounds per person, to understand their work in depth.
* **Group studies** to see where needs overlapped and where they conflicted.
* **Surveys** to reach more users than live sessions allowed.
* **A/B tests** comparing the console builder with tabbed views and fixed layouts assigned at sign-in.

### What I learned

Some users needed to see related information together as they worked. The capabilities we were combining did not come as separate tools. I broke them into widgets so users could put the pieces they needed next to each other.

Many users needed capabilities that were missing from their assigned views, while other capabilities in those views were irrelevant to their work. That feedback supported letting people choose which widgets appeared together.

The interviews and group studies let me map each type of user to the tools they needed. That gave me confidence in recommending a configurable console to stakeholders. The proposal was approved, and design iteration began.

---

## What I tried first

### Tabbed views

Each capability got its own tab. It kept every view uncluttered, but only one view was visible at a time. Operators and supervisors both needed related widgets side by side to do their jobs, and tabs split that context apart.

**Figure:** `Explored-Tabs.html`, caption: `Tabbed views: clean, but one view at a time.`

### Fixed layouts by sign-in role

The console would load a fixed layout for whoever signed in: operator, supervisor, or maintainer. These views did not match the combinations of capabilities many users needed. The approach also required role-aware sign-in and layout routing that the platform did not have.

**Figure:** `Explored-RoleLogin.html`, caption: `An early concept with fixed layouts for operators, supervisors, and maintainers.`

---

## The decision

I broke the combined capabilities into widgets, each with a single purpose. Users could arrange the widgets they needed on a 12-column grid or start from a pre-built layout and customize it.

### Why micro frontends made this work

After I presented the research findings and recommended a "build your own console" approach, the lead developer suggested micro frontends as a way to support it. We agreed to move forward with that architecture.

In a micro frontend architecture, the interface is split into independently built and deployed pieces that a host application, the shell, composes at runtime. That mapped directly onto the design:

* **The shell owns the frame.** Layout, the grid, saved configurations, and the global controls (STOP and system status) live in the shell. They behave the same no matter which widgets are on screen.
* **Widgets are the deployable units.** Most widgets were their own micro frontend. A few that shared the same data and always shipped together lived in one micro frontend that exposed several widgets.
* **New capability without a console release.** A new widget could ship on its own release cadence and appear in the picker without touching the shell.
* **Failure stays contained.** Each widget loads independently, so a failing widget should not take the console down with it. I designed loading, empty, and error states for individual widgets.
* **One design system across all of it.** Independently built pieces only feel like one product if they share tokens and components. The Sentinel system is what kept every widget consistent.

### What we built first

We prioritized the most frequently used widgets that needed context from one another. Less frequently used widgets stayed outside the initial scope because they would be easier to add once we understood the complex flows that depended on context across tools.

### Working with developers

I presented clickable Figma mockups to developers so they could walk through the console building flow.

The team was concerned that users could build consoles that were too complicated or too simple. I added pre-built layouts as a starting point, while keeping the option to customize. That brought the team into alignment.

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

Maintainers told us they would always need the same screen and a layout built around drilling into detail. I gave them a dedicated page with a fixed layout organized around that workflow.

**Embed:** the prototype, scenario "Maintainer diagnostics". Fallback figure: `Maintainer.html`.

---

## The design system

I created the design system and handed it over to the developers so they could continue adding widgets and capabilities after my involvement ended.

The system covered content inside widgets, including headings and settings layouts, as well as shared rules for adding widgets to the console.

Sentinel runs on a small system built for operator density: neutral ink surfaces, color reserved for status, monospaced numbers so columns hold still while values refresh, and every status paired with a word, never color alone.

**Figure:** a strip showing the five components (Button variants, Status Chips, Alert Banner, Track Row, Panel). Build it from `../design-system/components.md` using the Sentinel tokens.

---

## Outcome

Stakeholders approved the configurable console approach. After I handed the design system over to developers, the team implemented 10 to 12 widgets per month, up from 1 to 3 per month previously.

Feedback from users after testing clickable prototypes indicated that the proposed console would shorten the time from decision to execution, our primary KPI.

Looking back, I would have pitched the "build your own console" concept to stakeholders and end users earlier. For other products serving several types of users, I would use the same combination of one-on-one interviews and group studies to map the tools each group needed.
