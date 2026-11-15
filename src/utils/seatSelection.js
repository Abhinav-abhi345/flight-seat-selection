import { aircraftLayouts } from '../data/aircraftLayouts.js'
import { getSeatLookup } from './seatHelpers.js'
import { validateSeatAssignment } from './validation.js'

export function assignSeat(state, action) {
  const error = validateSeatAssignment(state, action.seatId, action.layoutId)
  if (error) return { ...state, feedback: { kind: 'error', text: error } }

  const activePassenger = state.passengers.find((passenger) => passenger.id === state.activePassengerId)

  return {
    ...state,
    passengers: state.passengers.map((passenger) => (
      passenger.id === state.activePassengerId ? { ...passenger, seatId: action.seatId } : passenger
    )),
    feedback: { kind: 'success', text: `Seat ${action.seatId} selected for ${activePassenger.name}.` },
  }
}

export function removeSeat(state, passengerId) {
  const passenger = state.passengers.find((item) => item.id === passengerId)
  if (!passenger) return { ...state, feedback: { kind: 'error', text: 'That passenger is no longer in this booking.' } }
  if (!passenger.seatId) return state

  return {
    ...state,
    passengers: state.passengers.map((item) => item.id === passengerId ? { ...item, seatId: null } : item),
    feedback: { kind: 'success', text: `Seat ${passenger.seatId} removed from ${passenger.name}.` },
  }
}

export function changeLayout(state, layoutId) {
  if (!Object.hasOwn(aircraftLayouts, layoutId)) {
    return { ...state, feedback: { kind: 'error', text: 'Please choose a supported cabin layout.' } }
  }
  if (state.layoutId === layoutId) return state

  const layout = aircraftLayouts[layoutId]
  const seatsById = getSeatLookup(layout)
  const cleared = []
  const passengers = state.passengers.map((passenger) => {
    if (!passenger.seatId) return passenger
    const seat = Object.hasOwn(seatsById, passenger.seatId) ? seatsById[passenger.seatId] : null
    if (seat && !seat.occupied) return passenger

    cleared.push(`${passenger.name} (${passenger.seatId})`)
    return { ...passenger, seatId: null }
  })

  return {
    ...state,
    layoutId,
    passengers,
    feedback: {
      kind: 'success',
      text: cleared.length
        ? `Switched to ${layout.label}. Cleared unavailable seats for ${cleared.join(', ')}. Please choose new seats.`
        : `Switched to ${layout.label}. Existing seat selections have been kept.`,
    },
  }
}
