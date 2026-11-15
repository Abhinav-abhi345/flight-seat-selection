export const meals = [
  {
    id: 'fruit-bowl',
    name: 'Fresh fruit bowl',
    description: 'Seasonal fruit, served chilled.',
    price: 0,
  },
  {
    id: 'vegetarian',
    name: 'Vegetarian meal',
    description: 'Vegetable curry with steamed rice.',
    price: 180,
  },
  {
    id: 'chicken',
    name: 'Grilled chicken meal',
    description: 'Grilled chicken with rice and vegetables.',
    price: 250,
  },
]

export function getMealById(mealId) {
  return meals.find((meal) => meal.id === mealId) ?? null
}
