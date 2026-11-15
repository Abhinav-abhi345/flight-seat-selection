import { Utensils } from 'lucide-react'
import { meals } from '../../data/meals'
import MealCard from './MealCard'

export default function MealSelector({ passenger, onMealSelect, onMealRemove, feedback }) {
  function handleSelect(mealId) {
    if (mealId === null) onMealRemove(passenger.id)
    else onMealSelect(passenger.id, mealId)
  }

  return (
    <section aria-labelledby="meal-heading" className="panel p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 id="meal-heading" className="section-title">A little something on board</h2>
        <Utensils size={18} className="text-slate-400" aria-hidden="true" />
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-500">Meals are optional. Choose one for {passenger.name}, or skip it.</p>
      {feedback?.scope === 'meal' && (
        <p role={feedback.kind === 'error' ? 'alert' : 'status'} className={`mt-4 rounded-xl px-4 py-3 text-sm leading-6 ${feedback.kind === 'error' ? 'bg-red-50 text-red-800' : 'bg-teal-50 text-teal-900'}`}>
          {feedback.text}
        </p>
      )}
      <fieldset className="mt-4">
        <legend className="sr-only">Meal selection for {passenger.name}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {[null, ...meals].map((meal) => (
            <MealCard
              key={meal?.id ?? 'none'}
              meal={meal}
              passengerId={passenger.id}
              isSelected={passenger.mealId === (meal?.id ?? null)}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </fieldset>
    </section>
  )
}
