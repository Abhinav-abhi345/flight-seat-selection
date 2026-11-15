import { Armchair, X } from 'lucide-react'
import { formatPrice, getSeatPrice } from '../../utils/priceCalculator'

export default function PassengerSummary({ passenger, seat, onSeatRemove }) {
  return (
    <li className="flex items-center justify-between gap-3 py-3.5">
      <div>
        <p className="text-sm font-medium text-slate-800">{passenger.name}</p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><Armchair size={13} aria-hidden="true" />{passenger.seatId ?? 'Not selected yet'}</p>
      </div>
      {seat ? (
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-slate-700">{formatPrice(getSeatPrice(seat))}</span>
          <button type="button" onClick={() => onSeatRemove(passenger.id)} aria-label={`Remove seat ${seat.id} from ${passenger.name}`} className="flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-700">
            <X size={15} aria-hidden="true" />
          </button>
        </div>
      ) : <span aria-label="No seat charge yet" className="text-sm text-slate-400">—</span>}
    </li>
  )
}
