import { seatCategories } from '../data/seats.js'
import { meals } from '../data/meals.js'

const rupeeFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export function getSeatPrice(seat) {
  return seat ? seatCategories[seat.category].price : 0
}

export function calculateSeatPricing(passengers, seatsById) {
  const categories = Object.fromEntries(Object.entries(seatCategories).map(([id, category]) => [id, {
    id,
    label: category.label,
    unitPrice: category.price,
    quantity: 0,
  }]))
  let selectedCount = 0

  for (const passenger of passengers) {
    const seat = Object.hasOwn(seatsById, passenger.seatId) ? seatsById[passenger.seatId] : null
    if (!seat || seat.occupied) continue

    categories[seat.category].quantity += 1
    selectedCount += 1
  }

  const lineItems = Object.values(categories)
    .filter((category) => category.quantity > 0)
    .map((category) => ({ ...category, subtotal: category.quantity * category.unitPrice }))

  return {
    selectedCount,
    lineItems,
    seatTotal: lineItems.reduce((total, item) => total + item.subtotal, 0),
  }
}

export function formatPrice(amount) {
  return rupeeFormatter.format(amount)
}

export function calculateMealPricing(passengers) {
  const mealLineItems = meals.map((meal) => {
    const quantity = passengers.filter((passenger) => passenger.mealId === meal.id).length
    return { id: meal.id, label: meal.name, unitPrice: meal.price, quantity, subtotal: quantity * meal.price }
  }).filter((item) => item.quantity > 0)

  return {
    mealLineItems,
    selectedMealCount: mealLineItems.reduce((count, item) => count + item.quantity, 0),
    mealTotal: mealLineItems.reduce((total, item) => total + item.subtotal, 0),
  }
}

export function calculateBookingPricing(passengers, seatsById) {
  const seatPricing = calculateSeatPricing(passengers, seatsById)
  const mealPricing = calculateMealPricing(passengers)

  return { ...seatPricing, ...mealPricing, grandTotal: seatPricing.seatTotal + mealPricing.mealTotal }
}
