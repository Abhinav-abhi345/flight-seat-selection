import { Check, UserRound, X } from 'lucide-react'
import { seatCategories } from '../../data/seats'
import { formatPrice } from '../../utils/priceCalculator'

const categoryStyles = {
  standard: 'border-slate-300 bg-white',
  premium: 'border-sky-300 bg-sky-50',
  extraLegroom: 'border-amber-400 bg-amber-50',
}

export default function SeatLegend() {
  return (
    <ul aria-label="Seat legend" className="flex flex-wrap justify-center gap-x-5 gap-y-3 text-[11px] text-slate-600">
      {Object.entries(seatCategories).map(([id, category]) => (
        <li key={id} className="flex items-center gap-2">
          <span className={`legend-seat ${categoryStyles[id]}`} aria-hidden="true" />
          {category.label} · {category.price === 0 ? 'Free' : formatPrice(category.price)}
        </li>
      ))}
      <li className="flex items-center gap-2"><span className="legend-seat border-teal-800 bg-teal-800 text-white" aria-hidden="true"><Check size={11} /></span>Selected</li>
      <li className="flex items-center gap-2"><span className="legend-seat border-violet-300 bg-violet-100 text-violet-900" aria-hidden="true"><UserRound size={11} /></span>Your group</li>
      <li className="flex items-center gap-2"><span className="legend-seat border-slate-200 bg-slate-100 text-slate-400" aria-hidden="true"><X size={11} /></span>Occupied</li>
    </ul>
  )
}
