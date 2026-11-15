import { seatCategories } from '../data/seats.js'

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
