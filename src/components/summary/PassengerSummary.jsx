import { Armchair, X } from 'lucide-react'
import { formatPrice, getSeatPrice } from '../../utils/priceCalculator'
import { seatCategories } from '../../data/seats'

export default function PassengerSummary({ passenger, seat, onSeatRemove }) {
  return (
    <li className="flex items-center justify-between gap-3 py-3.5">
      <div>
        <p className="text-sm font-medium text-slate-800">{passenger.name}</p>
        <p className="mt-1 flex items-start gap-1.5 text-xs leading-5 text-slate-500"><Armchair size={13} className="mt-0.5 shrink-0" aria-hidden="true" />{seat ? `${seat.id} · ${seatCategories[seat.category].label}` : 'Not selected yet'}</p>
      </div>
      {seat ? (
        <div className="flex items-center gap-1">
          <span className="text-right text-sm font-medium tabular-nums text-slate-700">
            {formatPrice(getSeatPrice(seat))}
            {getSeatPrice(seat) === 0 && <span className="block text-[10px] font-normal text-teal-800">Free</span>}
          </span>
          <button type="button" onClick={() => onSeatRemove(passenger.id)} aria-label={`Remove seat ${seat.id} from ${passenger.name}`} className="flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-700">
            <X size={15} aria-hidden="true" />
          </button>
        </div>
      ) : <span aria-label="No seat charge yet" className="text-sm text-slate-400">—</span>}
    </li>
  )
}
