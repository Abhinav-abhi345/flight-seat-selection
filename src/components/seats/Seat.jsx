import { Check, UserRound, X } from 'lucide-react'
import { seatCategories } from '../../data/seats'
import { formatPrice } from '../../utils/priceCalculator'

const categoryStyles = {
  standard: 'border-slate-300 bg-white text-slate-600',
  premium: 'border-sky-300 bg-sky-50 text-sky-900',
  extraLegroom: 'border-amber-400 bg-amber-50 text-amber-900',
}

export default function Seat({ seat, assignedPassenger, activePassengerId, onSelect }) {
  const category = seatCategories[seat.category]
  const isSelected = assignedPassenger?.id === activePassengerId
  const belongsToAnotherPassenger = Boolean(assignedPassenger && !isSelected)
  const status = seat.occupied ? 'occupied' : assignedPassenger ? `selected for ${assignedPassenger.name}` : 'available'
  const description = `${seat.id}, ${category.label}, ${category.price === 0 ? 'free' : formatPrice(category.price)}, ${status}`
  const appearance = seat.occupied
    ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
    : isSelected ? 'border-teal-800 bg-teal-800 text-white'
      : belongsToAnotherPassenger ? 'border-violet-300 bg-violet-100 text-violet-900'
        : `${categoryStyles[seat.category]} hover:brightness-95 hover:ring-2 hover:ring-teal-600/30`

  return (
    <button
      type="button"
      disabled={seat.occupied}
      aria-disabled={seat.occupied || belongsToAnotherPassenger}
      aria-pressed={isSelected}
      aria-label={description}
      title={description}
      onClick={() => onSelect(seat.id)}
      className={`seat min-h-11 cursor-pointer disabled:cursor-not-allowed ${appearance}`}
    >
      {seat.occupied ? <X size={15} aria-hidden="true" /> : isSelected ? <Check size={16} aria-hidden="true" /> : belongsToAnotherPassenger ? <UserRound size={15} aria-hidden="true" /> : <span>{seat.letter}</span>}
    </button>
  )
}
