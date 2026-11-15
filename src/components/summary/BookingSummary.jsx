import { ArrowRight, Ticket } from 'lucide-react'
import PassengerSummary from './PassengerSummary'
import PriceBreakdown from './PriceBreakdown'
import { getSeatPrice } from '../../utils/priceCalculator'

export default function BookingSummary({ passengers, seatsById, onSeatRemove }) {
  const selectedCount = passengers.filter((passenger) => passenger.seatId).length
  const seatTotal = passengers.reduce((total, passenger) => total + getSeatPrice(seatsById[passenger.seatId]), 0)

  return (
    <aside aria-labelledby="summary-heading" className="panel p-5 lg:col-span-2 xl:sticky xl:top-6 xl:col-span-1">
      <div className="flex items-center justify-between gap-3">
        <h2 id="summary-heading" className="section-title">Your journey</h2>
        <Ticket size={18} className="text-slate-400" aria-hidden="true" />
      </div>
      <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">Mumbai <ArrowRight size={14} className="text-slate-400" aria-hidden="true" /> New Delhi</p>
        <p className="mt-1 text-xs text-slate-500">20 Nov · AE 204 · {passengers.length} traveller{passengers.length === 1 ? '' : 's'}</p>
      </div>
      <div className="mt-5 flex items-center justify-between gap-2">
        <h3 className="eyebrow">SEAT SELECTION</h3>
        <span className="text-xs text-slate-500">{selectedCount} of {passengers.length} selected</span>
      </div>
      <ul className="mt-1 divide-y divide-slate-100">
        {passengers.map((passenger) => <PassengerSummary key={passenger.id} passenger={passenger} seat={seatsById[passenger.seatId]} onSeatRemove={onSeatRemove} />)}
      </ul>
      <div className="pt-3"><PriceBreakdown seatTotal={seatTotal} /></div>
      <p className="mt-5 rounded-lg border border-dashed border-slate-200 px-3 py-3 text-center text-xs leading-5 text-slate-500">
        {selectedCount === 0 ? 'Your selected seats and charges will appear here.' : selectedCount === passengers.length ? 'Everyone has a seat. You can still change your selections.' : `${passengers.length - selectedCount} more seat${passengers.length - selectedCount === 1 ? '' : 's'} to choose.`}
      </p>
      <button type="button" disabled className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-500 disabled:cursor-not-allowed" aria-describedby="review-hint">
        Review selections <ArrowRight size={16} aria-hidden="true" />
      </button>
      <p id="review-hint" className="mt-2.5 text-center text-[11px] leading-5 text-slate-500">{selectedCount === passengers.length ? 'Your selections are saved for this session.' : 'Choose a seat for each passenger.'}</p>
    </aside>
  )
}
