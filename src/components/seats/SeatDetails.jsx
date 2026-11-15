import { Armchair, Trash2 } from 'lucide-react'
import { seatCategories } from '../../data/seats'
import { formatPrice, getSeatPrice } from '../../utils/priceCalculator'

export default function SeatDetails({ passenger, seat, onRemove }) {
  if (!seat) {
    return <p className="mt-4 text-center text-xs leading-5 text-slate-600">Choose an available seat for {passenger.name}.</p>
  }

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-teal-200 bg-teal-50/50 p-4">
      <div className="flex items-center gap-3">
        <Armchair size={20} className="text-teal-800" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-teal-950">{passenger.name} · Seat {seat.id}</p>
          <p className="mt-1 text-xs text-slate-600">{seatCategories[seat.category].label} · {formatPrice(getSeatPrice(seat))}</p>
        </div>
      </div>
      <button type="button" onClick={() => onRemove(passenger.id)} className="flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-teal-900 hover:bg-teal-100" aria-label={`Remove seat ${seat.id} from ${passenger.name}`}>
        <Trash2 size={14} aria-hidden="true" /> Remove
      </button>
      <p className="w-full text-xs text-slate-500">To change seats, choose another available seat.</p>
    </div>
  )
}
