import { aircraftLayouts } from '../data/aircraftLayouts.js'
import { getSeatLookup } from './seatHelpers.js'

export function validateSeatAssignment(state, seatId, renderedLayoutId) {
  if (renderedLayoutId !== state.layoutId) return 'The cabin changed. Please choose a seat from the current layout.'
  if (!state.passengers.some((passenger) => passenger.id === state.activePassengerId)) {
    return 'Select a passenger before choosing a seat.'
  }

  const seatsById = getSeatLookup(aircraftLayouts[state.layoutId])
  const seat = Object.hasOwn(seatsById, seatId) ? seatsById[seatId] : null
  if (!seat) return 'That seat does not exist in this cabin.'
  if (seat.occupied) return `Seat ${seatId} is occupied. Please choose an available seat.`

  const owner = state.passengers.find((passenger) => passenger.seatId === seatId && passenger.id !== state.activePassengerId)
  if (owner) return `Seat ${seatId} is already assigned to ${owner.name}. Choose another seat.`

  return null
}
