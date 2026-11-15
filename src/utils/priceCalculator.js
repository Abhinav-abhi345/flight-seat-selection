import { seatCategories } from '../data/seats.js'

export function getSeatPrice(seat) {
  return seat ? seatCategories[seat.category].price : 0
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}
