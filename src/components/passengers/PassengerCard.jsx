import { Armchair } from 'lucide-react'
import { formatPrice, getSeatPrice } from '../../utils/priceCalculator'

export default function PassengerCard({ passenger, number, isActive, onSelect, seat }) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={() => onSelect(passenger.id)}
      className={`min-h-11 w-full cursor-pointer rounded-xl border p-3.5 text-left transition-colors ${isActive ? 'border-teal-700 bg-teal-50/70 ring-1 ring-teal-700/10' : 'border-slate-200 bg-white hover:border-teal-500 hover:bg-teal-50/30'}`}
    >
      <span className="flex items-center gap-2.5">
        <span className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${isActive ? 'bg-teal-800 text-white' : 'bg-slate-100 text-slate-600'}`} aria-hidden="true">{number}</span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-slate-800">{passenger.name}</span>
          <span className="mt-0.5 block text-[11px] text-slate-500">Adult{isActive && <span className="font-medium text-teal-800"> · Active traveller</span>}</span>
        </span>
      </span>
      <span className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
        <Armchair size={14} aria-hidden="true" />
        {passenger.seatId ?? 'No seat selected'}
        {seat && <span className="ml-auto font-medium text-teal-900">{formatPrice(getSeatPrice(seat))}</span>}
      </span>
    </button>
  )
}
