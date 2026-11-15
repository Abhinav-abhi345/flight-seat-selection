import { getMealById } from '../data/meals.js'

export function selectMeal(state, passengerId, mealId) {
  const passenger = state.passengers.find((item) => item.id === passengerId)
  const meal = getMealById(mealId)

  if (!passenger || !meal) {
    return {
      ...state,
      feedback: {
        scope: 'meal',
        kind: 'error',
        text: !passenger ? 'That passenger is no longer in this booking.' : 'Please choose an available meal.',
      },
    }
  }

  return {
    ...state,
    passengers: state.passengers.map((item) => item.id === passengerId ? { ...item, mealId } : item),
    feedback: { scope: 'meal', kind: 'success', text: `${meal.name} selected for ${passenger.name}.` },
  }
}

export function removeMeal(state, passengerId) {
  const passenger = state.passengers.find((item) => item.id === passengerId)
  if (!passenger) {
    return { ...state, feedback: { scope: 'meal', kind: 'error', text: 'That passenger is no longer in this booking.' } }
  }
  if (!passenger.mealId) return state

  return {
    ...state,
    passengers: state.passengers.map((item) => item.id === passengerId ? { ...item, mealId: null } : item),
    feedback: { scope: 'meal', kind: 'success', text: `Meal removed from ${passenger.name}.` },
  }
}
