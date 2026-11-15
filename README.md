# Flight Seat Selection & Passenger Management

React and JavaScript frontend for the flight seat selection assessment.

## Current progress

Phase 5: seat assignment. Includes the responsive airline interface, both aircraft layouts, passenger management, seat assignment/reassignment/removal, duplicate prevention, and safe cabin changes.

Seat selections and their charges now update together. Phase 6 will expand and verify the pricing breakdown. Meals, persistence, and final UI refinement follow mandatory features. The review button is still a disabled presentation placeholder; it does not perform a reservation.

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
- `src/components/`: layout, passenger, seat, and summary components. Meals will follow mandatory features.
- `src/data/`: mock passenger and seat data, separate from presentation.
- `src/hooks/usePassengers.js`: shared passenger/assignment state, cabin selection, and event handlers.
- `src/utils/passengerHelpers.js`: pure passenger initialization and reducer logic, covered by Node tests.
- `src/utils/seatSelection.js`: assignment, removal, and cabin-change transitions.
- `src/utils/validation.js`: latest-state validation of assignment attempts.
- `src/utils/priceCalculator.js`: seat price lookup and shared Indian rupee formatting.

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

No dependencies were added for Phase 5. Automated checks now include 19 tests.

## State management

`usePassengers` uses React's `useReducer` to keep the passenger list (including seat IDs), active passenger ID, aircraft layout ID, and action feedback together. The reducer validates each action against the latest state and changes related values atomically, so reducing the list cannot leave the active ID pointing at a removed passenger.

Passenger count comes from the list length. The active passenger object is found by ID. Neither is stored separately. Retained profiles keep their identifiers and existing data, and updates never mutate the previous state.

In Phase 5, the layout ID moved from `App` into the same reducer. A cabin change and the removal of invalid assignments happen in one transition. Assignment actions carry the layout ID rendered when clicked; the reducer rejects an event from an outdated cabin. The aircraft definition, seat rows, assignment ownership, active seat, and displayed charges are derived from current state. No effects are required to synchronize them.

Redux would add dependencies and indirection without helping this small page. Custom hooks, a pure reducer, and a shallow component tree provide the required shared state. Totals are calculated from assignments on every render; there is no independently mutable total or availability state.
