import { Fragment } from 'react'
import { Armchair, MoveUp } from 'lucide-react'
import { buildSeatRows, getSeatGridColumns } from '../../utils/seatHelpers'
import Seat from './Seat'
import SeatLegend from './SeatLegend'
import SeatConfiguration from './SeatConfiguration'
import SeatDetails from './SeatDetails'

export default function AircraftSeatMap({ layout, onLayoutChange, activePassenger, passengers, onSeatSelect, onSeatRemove, feedback }) {
  const seatRows = buildSeatRows(layout)
  const gridStyle = { gridTemplateColumns: getSeatGridColumns(layout) }
  const activeSeat = seatRows.flatMap((row) => row.groups.flat()).find((seat) => seat.id === activePassenger.seatId)
  const assignedPassengers = Object.fromEntries(passengers.filter((passenger) => passenger.seatId).map((passenger) => [passenger.seatId, passenger]))

  return (
    <section aria-labelledby="seat-map-heading" className="panel min-w-0 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
        <div>
          <h2 id="seat-map-heading" className="section-title">Your seat, your space</h2>
          <p className="mt-1.5 text-xs text-slate-500">A view of your cabin. Settle into something good.</p>
        </div>
        <SeatConfiguration layoutId={layout.id} onLayoutChange={onLayoutChange} />
      </div>
      <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-4">
        <SeatLegend />
      </div>
      <div className="px-3 pt-6 pb-7 sm:px-6">
        {feedback && feedback.scope !== 'meal' && (
          <p role={feedback.kind === 'error' ? 'alert' : 'status'} className={`mb-4 rounded-xl px-4 py-3 text-sm leading-6 ${feedback.kind === 'error' ? 'bg-red-50 text-red-800' : 'bg-teal-50 text-teal-900'}`}>
            {feedback.text}
          </p>
        )}
        <div role="status" className="mx-auto flex w-fit items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-xs font-medium text-teal-900">
          <Armchair size={14} aria-hidden="true" /> Choosing for {activePassenger.name}
        </div>
        {/* <p role="status" className="mt-3 text-center text-xs text-slate-500">{layout.description} · {layout.rowCount} rows</p> */}
        <p className="mt-2 text-center text-[11px] leading-5 text-slate-500">Changing cabins keeps available seats and clears unavailable selections.</p>
        <SeatDetails passenger={activePassenger} seat={activeSeat} onRemove={onSeatRemove} />
        <div role="region" aria-label={`${layout.label} seat map, scroll horizontally if needed`} tabIndex={0} className="mt-6 overflow-x-auto rounded-xl pb-2">
          <div className="aircraft-cabin mx-auto w-max border border-slate-200 bg-slate-50/50 px-3 pt-7 pb-6 sm:px-6">
            <div className="mb-6 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
              <MoveUp size={13} aria-hidden="true" /> Front of aircraft
            </div>
            <div aria-hidden="true" style={gridStyle} className="seat-row mb-3 text-center text-[11px] font-medium text-slate-600">
              <span />
              {layout.groups.map((group, groupIndex) => (
                <Fragment key={group.join('')}>
                  {groupIndex > 0 && <span />}
                  {group.map((letter) => <span key={letter}>{letter}</span>)}
                </Fragment>
              ))}
            </div>
            <ol aria-label="Aircraft seat rows" className="space-y-2.5">
              {seatRows.map((row) => (
                <li key={row.number} aria-label={`Row ${row.number}`} style={gridStyle} className="seat-row">
                  <span aria-hidden="true" className="text-center text-[11px] text-slate-600">{row.number}</span>
                  {row.groups.map((group, groupIndex) => (
                    <Fragment key={layout.groups[groupIndex].join('')}>
                      {groupIndex > 0 && <span aria-hidden="true" />}
                      {group.map((seat) => (
                        <Seat
                          key={seat.id}
                          seat={seat}
                          assignedPassenger={assignedPassengers[seat.id]}
                          activePassengerId={activePassenger.id}
                          onSelect={onSeatSelect}
                        />
                      ))}
                    </Fragment>
                  ))}
                </li>
              ))}
            </ol>
            <div className="mx-auto mt-6 h-1 w-12 rounded-full bg-slate-200" aria-hidden="true" />
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-slate-500 md:hidden">Scroll sideways if needed to see every seat.</p>
        <p className="mt-5 text-center text-xs leading-5 text-slate-500">Seat fees are per passenger, per flight.</p>
      </div>
    </section>
  )
}
