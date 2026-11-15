import { Armchair, Utensils, X } from 'lucide-react'
import { formatPrice, getSeatPrice } from '../../utils/priceCalculator'
import { seatCategories } from '../../data/seats'
import { getMealById } from '../../data/meals'

export default function PassengerSummary({ passenger, seat, onSeatRemove, onMealRemove }) {
  const meal = getMealById(passenger.mealId)
  const seatPrice = getSeatPrice(seat)
  const passengerTotal = seatPrice + (meal?.price ?? 0)

  return (
    <li className="py-3.5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-800">{passenger.name}</p>
        <span className="shrink-0 text-sm font-semibold tabular-nums text-teal-900" aria-label={`${passenger.name} add-on total: ${formatPrice(passengerTotal)}`}>{seat || meal ? formatPrice(passengerTotal) : '—'}</span>
      </div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <p className="mt-1 flex items-start gap-1.5 text-xs leading-5 text-slate-500">
          <Armchair size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
          {seat ? `${seat.id} · ${seatCategories[seat.category].label}` : 'Not selected yet'}
        </p>
        {seat ? (
          <div className="flex shrink-0 items-center gap-1">
            <span className="text-right text-xs font-medium tabular-nums text-slate-700">
              {formatPrice(seatPrice)}
              {seatPrice === 0 && <span className="block text-[10px] font-normal text-teal-800">Free</span>}
            </span>
            <button type="button" onClick={() => onSeatRemove(passenger.id)} aria-label={`Remove seat ${seat.id} from ${passenger.name}`} className="flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-700">
              <X size={15} aria-hidden="true" />
            </button>
          </div>
        ) : <span aria-label="No seat charge yet" className="text-sm text-slate-400">—</span>}
      </div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <p className="flex items-start gap-1.5 text-xs leading-5 text-slate-500">
          <Utensils size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
          {meal?.name ?? 'No meal selected'}
        </p>
        {meal ? (
          <div className="flex shrink-0 items-center gap-1">
            <span className="text-right text-xs font-medium tabular-nums text-slate-700">
              {formatPrice(meal.price)}
              {meal.price === 0 && <span className="block text-[10px] font-normal text-teal-800">Free</span>}
            </span>
            <button type="button" onClick={() => onMealRemove(passenger.id)} aria-label={`Remove ${meal.name} from ${passenger.name}`} className="flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-700">
              <X size={15} aria-hidden="true" />
            </button>
          </div>
        ) : <span aria-label="No meal charge" className="text-sm text-slate-400">—</span>}
      </div>
    </li>
  )
}
