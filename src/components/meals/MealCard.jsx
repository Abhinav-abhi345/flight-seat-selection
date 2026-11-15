import { Check, CircleSlash, Utensils } from 'lucide-react'
import { formatPrice } from '../../utils/priceCalculator'

export default function MealCard({ meal, passengerId, isSelected, onSelect }) {
  const Icon = meal ? Utensils : CircleSlash

  return (
    <label className={`relative flex h-full min-h-28 cursor-pointer flex-col rounded-xl border p-4 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-teal-700 ${isSelected ? 'border-teal-700 bg-teal-50/70 ring-1 ring-teal-700/10' : 'border-slate-200 hover:border-teal-500 hover:bg-slate-50'}`}>
      <input
        type="radio"
        name={`meal-${passengerId}`}
        value={meal?.id ?? 'none'}
        checked={isSelected}
        onChange={() => onSelect(meal?.id ?? null)}
        className="sr-only"
        aria-label={`${meal?.name ?? 'No meal'}, ${!meal || meal.price === 0 ? 'no charge' : formatPrice(meal.price)}`}
      />
      <span className="mb-3 flex items-center justify-between gap-2">
        <Icon size={18} className={isSelected ? 'text-teal-800' : 'text-slate-400'} aria-hidden="true" />
        <span className={`flex size-5 items-center justify-center rounded-full border ${isSelected ? 'border-teal-800 bg-teal-800 text-white' : 'border-slate-300'}`} aria-hidden="true">
          {isSelected && <Check size={12} />}
        </span>
      </span>
      <span className="text-sm font-semibold text-slate-800">{meal?.name ?? 'No meal'}</span>
      <span className="mt-1 text-xs leading-5 text-slate-500">{meal?.description ?? 'Skip a meal for this passenger.'}</span>
      <span className="mt-3 text-xs font-semibold text-teal-900">{meal ? meal.price === 0 ? 'Free · ₹0' : formatPrice(meal.price) : 'No charge'}</span>
    </label>
  )
}
