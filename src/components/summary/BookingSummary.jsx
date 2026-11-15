import { ArrowRight, CircleCheck, Ticket } from 'lucide-react'
import PassengerSummary from './PassengerSummary'
import PriceBreakdown from './PriceBreakdown'

export default function BookingSummary({ passengers, seatsById, onSeatRemove, pricing }) {
  const { selectedCount } = pricing
  const isComplete = selectedCount === passengers.length

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
      <div className="pt-3"><PriceBreakdown pricing={pricing} /></div>
      <div role="status" className={`mt-5 rounded-xl px-4 py-3 text-center text-xs leading-5 ${isComplete ? 'bg-teal-50 text-teal-900' : 'border border-dashed border-slate-200 text-slate-500'}`}>
        {isComplete ? (
          <>
            <p className="flex items-center justify-center gap-2 font-semibold"><CircleCheck size={16} aria-hidden="true" />All seats selected</p>
            <p className="mt-1">You can change or remove seats at any time.</p>
          </>
        ) : selectedCount === 0 ? 'Choose a seat for each passenger to complete your selection.' : `${passengers.length - selectedCount} more seat${passengers.length - selectedCount === 1 ? '' : 's'} to choose.`}
      </div>
    </aside>
  )
}
