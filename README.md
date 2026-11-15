# Flight Seat Selection & Passenger Management

React and JavaScript frontend for the flight seat selection assessment.

## Current progress

Phase 7: bonus meal selection. Includes all mandatory seat-selection and pricing behavior, one optional meal per passenger, and a combined seat-and-meal price breakdown.

Mandatory functionality and bonus meals are implemented. Final browser verification, GitHub publication, and Vercel deployment remain for Phase 8. This is a mock seat-selection experience: it does not perform a reservation or collect payment.

Selections are held in memory and reset on page refresh. Optional localStorage persistence is intentionally omitted to keep the assessment focused on its requirements.

## Stack

- React with Vite
- Tailwind CSS through its Vite plugin
- Lucide React icons
- ESLint

## Windows PowerShell setup

Run these commands from the project folder:

```powershell
npm.cmd install
npm.cmd run dev
```

Open the local URL printed by Vite. The page displays Aero branding and a Mumbai–New Delhi flight with three mock travellers.

Use `npm.cmd` if PowerShell blocks the `npm.ps1` launcher. No execution-policy change is needed.

## Checks

```powershell
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

The production build is written to `dist`. To serve it locally:

```powershell
npm.cmd run preview
```

## Structure

- `src/App.jsx`: composes the page from presentation components.
- `src/main.jsx`: React entry point with StrictMode.
- `src/index.css`: Tailwind import and base styles.
- `src/components/`: layout, passenger, seat, meal, and summary components.
- `src/data/`: mock passenger, aircraft, seat-category, and meal data, separate from presentation.
- `src/hooks/usePassengers.js`: shared passenger/assignment state, cabin selection, and event handlers.
- `src/utils/passengerHelpers.js`: pure passenger initialization and reducer logic, covered by Node tests.
- `src/utils/seatSelection.js`: assignment, removal, and cabin-change transitions.
- `src/utils/mealSelection.js`: independent meal selection and removal transitions.
- `src/utils/validation.js`: latest-state validation of assignment attempts.
- `src/utils/priceCalculator.js`: separate seat and meal pricing calculations, combined total, selection counts, and Indian rupee formatting.

Empty directories may not appear in Git until implementation adds files.

## Phase 2 verification

- Desktop at 1280px and above: passengers on the left, cabin in the centre, summary on the right.
- Tablet: the grid reduces to two columns or a single column as space permits.
- Mobile at 320px and above: passengers, seat map, then summary in a single column.
- The cabin displays ten numbered rows with A/B/C, an aisle, then D/E.
- Gold seats show extra legroom (₹350), blue seats premium (₹250), and white seats standard (free). Occupied seats use a gray cross.
- Hover a seat to see its mock seat identifier, category, and availability or price.
- All three travellers start without seats, and the summary displays ₹0.
- Keyboard Tab reveals a skip link to the main content.

No new dependencies were added for Phases 2 or 3.

## Phase 3 implementation and verification

- Switch between 3–2 (50 seats) and 2–3–2 (70 seats). Both cabins have ten rows.
- The narrow cabin uses A/B/C, one aisle, then D/E. The wide cabin follows the PDF example: A/B, an aisle, D/E/F, an aisle, G/H.
- The layout switch is a labelled native radio group, usable with Tab and the arrow keys.
- Labels, aisles, and seat rows all come from `src/data/aircraftLayouts.js`. `buildSeatRows` generates fresh seat data for the selected configuration. One component renders both layouts.
- Only the selected layout ID is stored in React state. The active layout, seat rows, and grid columns are derived; no effect or duplicated seat state is required.
- Occupied seats are defined separately for each configuration. Switching back restores the configuration's mock occupancy.
- Seat columns have a minimum width of 44px. A focusable scroll region contains any overflow on narrow displays; the page itself should not scroll sideways.
- Automated tests cover both seat counts, unique seat identifiers, PDF labels, layout-specific occupancy, and the three prices.

Assignment policy, implemented in Phase 5: retain an assignment only if the same seat ID exists and is available in the target cabin; clear all other assignments and explain the change to the user.

## Phase 4 implementation and verification

- Change the passenger count from 1 to 9 using the labelled dropdown. The initial count is 3; the upper limit is a mock booking policy defined in `src/data/passengers.js`.
- The passenger-count dropdown uses a styled select-only combobox. Use Enter/Space to open, arrow keys or Home/End to navigate, Enter/Space to select, and Escape or Tab to dismiss without changing the count. Number keys highlight the matching option; clicking outside closes the list.
- All panels receive the same passenger list. Profiles and summary rows update together.
- Click a passenger card or focus it with Tab and press Enter or Space. Exactly one card is active, and the cabin's “Choosing for” label updates immediately.
- Increasing the count preserves existing profiles and the active passenger. New passengers start without a seat.
- Decreasing the count removes passengers from the end. The UI explains this policy before the count selector is changed and announces changes afterwards.
- If the active passenger is removed, Passenger 1 becomes active. Re-adding a removed passenger creates a fresh profile, with no recovered selections.
- Switching aircraft configurations preserves the passenger list and active passenger.
- Tests cover count boundaries, invalid actions, active-passenger fallback, immutable updates, retained selections, and clearing removed selections.

No dependencies were added for Phase 4.

## Phase 5 implementation and verification

- Select a passenger, then click an available seat. The seat ID and price appear in the passenger card, active-seat details, and booking summary.
- The active passenger's seat shows a teal check. Other passengers' seats show violet person icons. Occupied seats show gray crosses and use native disabled buttons.
- Select another passenger and try a violet seat: an error explains who owns it, and no assignment changes. These buttons use `aria-disabled` while remaining focusable so users can discover the ownership feedback.
- Choose a different available seat to replace the active passenger's assignment. The former seat is released automatically because availability comes from current assignments.
- Remove a seat through the active-seat details or its summary row. The action targets that passenger's ID and does not change anyone else's assignment.
- Switching passengers keeps all assignments. Reducing passenger count releases seats belonging to removed profiles.
- Switch 3–2 to 2–3–2 with 1A, 1C, and 4D assigned to different passengers: 1A remains, 1C is missing, and 4D is occupied in the target cabin. The latter two are cleared, with a message naming affected passengers and seats.
- Assign 1H in the wide cabin, then switch to 3–2: the assignment is cleared. Switching back does not restore it.
- Invalid, occupied, duplicate, and stale-layout assignments are rejected inside the reducer, using current state. Rapid or queued actions cannot bypass UI validation.
- Available seats have a 44px minimum size, accessible labels including their category and price, and keyboard focus styles. Enter and Space activate native seat buttons.
- Basic charges are derived from current assignments, including ₹0 seats. This was connected alongside assignment functionality to avoid displaying stale placeholder totals.

No dependencies were added for Phase 5. That phase's automated checks covered 19 tests.

## Phase 6 implementation and verification

- `calculateSeatPricing` builds a fresh breakdown from the current passenger assignments and seat catalogue. It returns selected-seat count, category quantities/subtotals, and total seat charges.
- Category prices are defined once in `src/data/seats.js`: Standard ₹0, Premium ₹250, and Extra legroom ₹350. Seat labels, details, passenger prices, the legend, and summary use that data.
- Choose 1A, 2A, and 5C for three passengers in the 3–2 cabin. Expect one Extra legroom seat at ₹350, one Premium seat at ₹250, one Standard seat at ₹0, and total ₹600.
- Change 1A to another free seat: total becomes ₹250. Remove the Premium assignment: total becomes ₹0, and the selected count decreases.
- Choose free seats for every passenger: total stays ₹0, all seats count as selected, the progress indicator advances to Seat summary, and a completion message appears.
- Category lines display quantity × unit price and subtotal. Free seats show both ₹0 and a Free label; unassigned passengers show Not selected yet.
- Reducing passenger count and switching cabins recalculate the breakdown immediately using only retained assignments. Missing and occupied seats do not count toward completion or totals.
- The total is an accessible live output. Prices use the en-IN number format and Indian rupee symbol. Airfare is explicitly excluded from the displayed seat charges.
- The inactive Review placeholder was removed. Selection completion is shown as a status; no checkout or actual booking is implied.
- There is no separate total state, synchronization effect, or pricing dependency. This small pure calculation runs during rendering, so a dedicated hook or memoization would add unnecessary indirection.

No dependencies were added for Phase 6. That phase's automated checks covered 26 tests.

## Phase 7 implementation and verification

- Select a passenger and use the optional meal panel below the cabin. Choose No meal, Fresh fruit bowl (₹0), Vegetarian meal (₹180), or Grilled chicken meal (₹250).
- Each passenger stores one meal ID. Changing meals replaces the previous choice. No meal and a free meal are distinct: both cost ₹0, but only the latter counts as a selected meal.
- The meal choices use native radio inputs with a labelled group, keyboard navigation, and visible focus styles. The No meal option is checked initially. Meals are never required to finish seat selection.
- Meal names and charges appear in passenger cards and summary rows. Each summary row includes separate seat/meal removal controls and a combined passenger total.
- Choose 1A + Vegetarian meal for Passenger 1 and 2A + Grilled chicken meal for Passenger 2. Expect seat charges ₹600, meal charges ₹430, total add-ons ₹1,030.
- Change the Vegetarian meal to the free fruit bowl: total becomes ₹850. Remove Passenger 2's meal: total becomes ₹600, with both seats retained.
- Switch passengers or cabins: meals remain selected, even when a cabin change clears a seat. Removing a seat preserves the meal; removing a meal preserves the seat.
- Reduce passenger count: removed profiles' seats and meals disappear from pricing. Increasing it again creates profiles with no previous selections restored.
- Meal feedback appears beside meal controls. Seat/count/cabin feedback remains in the cabin panel; there are no duplicate live announcements.
- `mealSelection.js` handles meal updates independently from `seatSelection.js`. `calculateMealPricing` and `calculateSeatPricing` remain separate pure functions, composed by `calculateBookingPricing`.
- No meal prices or independently mutable totals are stored in state. All displayed prices come from the catalogue and current passenger selections.

No dependencies were added for Phase 7. There are 37 automated business-logic tests. Rendering checks cover skipped, free and paid meals, combined totals, and optional-meal completion behavior. Final browser appearance, keyboard interactions, responsive behavior, and browser console checks remain for Phase 8.

## State management

`usePassengers` uses React's `useReducer` to keep the passenger list (including seat and meal IDs), active passenger ID, aircraft layout ID, and action feedback together. The reducer validates each action against the latest state and changes related values atomically, so reducing the list cannot leave the active ID pointing at a removed passenger.

Passenger count comes from the list length. The active passenger object is found by ID. Neither is stored separately. Retained profiles keep their identifiers and existing data, and updates never mutate the previous state.

In Phase 5, the layout ID moved from `App` into the same reducer. A cabin change and the removal of invalid assignments happen in one transition. Assignment actions carry the layout ID rendered when clicked; the reducer rejects an event from an outdated cabin. The aircraft definition, seat rows, assignment ownership, active seat, and displayed charges are derived from current state. No effects are required to synchronize them.

Redux would add dependencies and indirection without helping this small page. Custom hooks, a pure reducer, and a shallow component tree provide the required shared state. Totals are calculated from assignments on every render; there is no independently mutable total or availability state.
