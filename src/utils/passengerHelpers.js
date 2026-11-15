import { createPassenger, passengerLimits } from '../data/passengers.js'
import { defaultLayoutId } from '../data/aircraftLayouts.js'
import { assignSeat, changeLayout, removeSeat } from './seatSelection.js'
import { removeMeal, selectMeal } from './mealSelection.js'

function isValidCount(count) {
  return Number.isInteger(count) && count >= passengerLimits.min && count <= passengerLimits.max
}

export function createPassengerState(count = passengerLimits.initial) {
  if (!isValidCount(count)) {
    throw new RangeError(`Passenger count must be between ${passengerLimits.min} and ${passengerLimits.max}.`)
  }

  const passengers = Array.from({ length: count }, (_, index) => createPassenger(index + 1))

  return { passengers, activePassengerId: passengers[0].id, layoutId: defaultLayoutId, feedback: null }
}

export function passengerReducer(state, action) {
  switch (action.type) {
    case 'selectMeal':
      return selectMeal(state, action.passengerId, action.mealId)

    case 'removeMeal':
      return removeMeal(state, action.passengerId)

    case 'assignSeat':
      return assignSeat(state, action)

    case 'removeSeat':
      return removeSeat(state, action.passengerId)

    case 'changeLayout':
      return changeLayout(state, action.layoutId)

    case 'selectPassenger': {
      if (!state.passengers.some((passenger) => passenger.id === action.passengerId)) {
        return { ...state, feedback: { kind: 'error', text: 'That passenger is no longer in this booking.' } }
      }

      return { ...state, activePassengerId: action.passengerId, feedback: null }
    }

    case 'changePassengerCount': {
      const count = action.count

      if (!isValidCount(count)) {
        return {
          ...state,
          feedback: {
            kind: 'error',
            text: `Choose between ${passengerLimits.min} and ${passengerLimits.max} passengers.`,
          },
        }
      }

      if (count === state.passengers.length) return state

      const passengers = Array.from({ length: count }, (_, index) => (
        state.passengers[index] ?? createPassenger(index + 1)
      ))
      const activePassengerId = passengers.some((passenger) => passenger.id === state.activePassengerId)
        ? state.activePassengerId
        : passengers[0].id
      const removedCount = Math.max(0, state.passengers.length - count)

      return {
        ...state,
        passengers,
        activePassengerId,
        feedback: {
          kind: 'success',
          text: removedCount > 0
            ? `${removedCount} passenger${removedCount === 1 ? '' : 's'} removed. Their selections have been cleared.`
            : `Booking updated to ${count} passengers.`,
        },
      }
    }

    default:
      return state
  }
}
