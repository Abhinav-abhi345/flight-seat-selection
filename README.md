# Flight Seat Selection & Passenger Management

A responsive React assessment application for choosing aircraft seats and optional meals for multiple passengers. All flight, seat and meal data is mocked; no backend, payment or actual reservation is involved.

Repository: [Abhinav-abhi345/flight-seat-selection](https://github.com/Abhinav-abhi345/flight-seat-selection) (private).

## Run locally on Windows

Install a current Node.js LTS release compatible with Vite and ESLint, then open PowerShell in the project folder:

```powershell
npm.cmd ci
npm.cmd run dev
```

Open the local URL printed by Vite. Use `npm.cmd` if PowerShell blocks the `npm.ps1` launcher; no execution-policy change is necessary.

```powershell
npm.cmd run lint
npm.cmd test
npm.cmd run build
npm.cmd run preview
```

`build` creates the production assets in `dist`. `preview` serves that build locally. The project uses React, Vite, JavaScript, Tailwind CSS, Lucide React and Node's built-in test runner. No state-management or component libraries are required.

## Features

- Select 1–9 passengers, with generated identifiers and one active passenger.
- Accessible styled passenger-count dropdown with mouse, touch and keyboard interaction.
- Configuration-driven 3–2 and 2–3–2 aircraft cabins, with ten rows, labelled seats and one or two aisles.
- Available, occupied, active-passenger and other-passenger seat appearances, with a pricing legend.
- Assign, change and remove seats; prevent occupied, invalid and duplicate assignments.
- Preserve assignments when changing passengers; safely reconcile them when changing cabins.
- Standard seats at ₹0, Premium at ₹250 and Extra legroom at ₹350.
- Optional meals: Fresh fruit bowl at ₹0, Vegetarian meal at ₹180 and Grilled chicken meal at ₹250.
- Individual seat and meal charges, category quantities/subtotals and a combined total.
- Responsive passenger/sidebar/summary layout, touch-friendly seat controls, focus indicators and live feedback.

The PDF describes its second layout inconsistently in one sentence. This implementation follows the 2–3–2 title and illustrated labels: `A B | D E F | G H`. The 3–2 cabin uses `A B C | D E`.

## How to use

1. Set the passenger count and select the traveller you want to seat.
2. Click or keyboard-activate an available seat. Choose another seat to replace it.
3. Switch passengers to assign their seats. A teal check marks the active traveller's seat; violet marks other travellers' seats; gray crosses mark occupied seats.
4. Remove a seat in the active-seat details or booking summary.
5. Optionally choose one meal for each passenger in the meal panel. Choose No meal or use the summary removal control to clear it.
6. Check the summary for individual charges, category subtotals and the combined add-on total. Free seats still count toward completion; meals are optional.

The passenger-count dropdown supports Enter/Space to open or select, arrow keys and Home/End to navigate, number keys to highlight an option, and Escape/Tab or an outside click to dismiss without committing a new count. Meal and cabin options use native radio inputs.

## State management and assignment logic

`usePassengers` owns one React `useReducer` state containing the passenger list, active passenger ID, aircraft layout ID and action feedback. Each passenger stores only their identifier, display name, seat ID and meal ID.

Passenger count, active passenger, seat ownership, seat rows and all pricing are derived. Prices and totals are never copied into mutable booking state. Custom dropdown state is local presentation state, separate from booking data.

The reducer validates assignment actions against its latest state. It checks the active passenger, rendered/current layout, seat existence, occupied status and another passenger's ownership before changing a seat ID. Reassignment releases the old seat automatically because availability is derived from current assignments.

Cabin changes update the layout and passenger assignments atomically: retain a seat only if its ID exists and is unoccupied in the target cabin. Otherwise clear it and name the affected passenger and seat in feedback. Switching back does not restore cleared assignments. Meals remain unchanged.

Reducing the passenger count removes profiles from the end. Retained profiles keep their selections. If the active traveller is removed, Passenger 1 becomes active. Re-adding profiles creates empty seat and meal selections.

Meal actions live separately in `mealSelection.js`; they never modify seat assignments. Seat and meal pricing are separate pure functions composed into a combined booking calculation. A free meal differs from No meal even though both cost ₹0.

Redux is unnecessary for this small page: a custom hook, a pure reducer and a shallow component tree provide one source of truth without an additional dependency. No effects are used to synchronize booking state or totals; dropdown effects only manage outside presses and scrolling.

## Source structure

```text
src/
  components/
    layout/       Branding, flight details and progress
    passengers/   Count dropdown and passenger cards
    seats/        Configuration switch, cabin, seats, details and legend
    meals/        Optional meal selector and cards
    summary/      Passenger charges and pricing breakdown
  data/           Passenger rules, aircraft layouts, seat categories and meals
  hooks/          Shared booking state and action handlers
  utils/          Pure transitions, validation, pricing and unit tests
  App.jsx         Page composition and derived booking data
  main.jsx        React entry point with StrictMode
  index.css       Tailwind and shared presentation styles
public/
  favicon.svg
```

## Verification

- 37 Node business-logic tests cover passenger resizing, immutable updates, seat assignment/removal, duplicate and occupied protection, stale-layout events, cabin reconciliation, free/paid pricing, meal independence and combined totals.
- ESLint and the Vite production build pass.
- Headless Chrome was run against the production build, exercising passenger counts, keyboard dropdown interaction, seat/meal assignment and removal, duplicate rejection, cabin changes and free-seat completion.
- Responsive checks passed at 320, 375, 768, 1024, 1280 and 1440px with no page-level horizontal overflow. Wide cabins scroll inside their panel. Touch selection was checked at 390px.
- The final browser flow reported no console errors, JavaScript page errors or failed HTTP resources.
- Automated WCAG 2 A/AA and 2.1 AA accessibility checks were run for the initial screen, open dropdown, selected seat/meal state and mobile cabin. Automated checks complement the keyboard and visual review; they do not establish complete accessibility conformance.

Browser automation and accessibility tooling were installed temporarily outside the repository, so they add no application dependencies. The reproducible business tests are included in `src/utils/*.test.js`. Cross-browser testing beyond Chrome is not claimed.

## Vercel deployment

Vercel supports Vite's default static build. Import this repository into Vercel and use:

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Root directory | Repository root |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variables | None |

No client-side routes or server functions are used, so additional rewrites and backend configuration are unnecessary. See [Vercel's Vite documentation](https://vercel.com/docs/frameworks/frontend/vite).

Deployment requires an authenticated Vercel account. The production URL will be recorded after a successful deployment.

## Scope and limitations

- Passenger identifiers satisfy the assessment; personal-details forms are outside its mandatory scope.
- Selections are held in memory and reset on refresh. Optional localStorage persistence is intentionally omitted.
- Passenger limit, flight schedule, occupancy, seat categories and meal options are mock policies, defined in source data.
- The displayed total covers seats and optional meals, not airfare.
