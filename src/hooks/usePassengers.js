import { useReducer } from 'react'
import { createPassengerState, passengerReducer } from '../utils/passengerHelpers'

export default function usePassengers() {
  const [state, dispatch] = useReducer(passengerReducer, undefined, createPassengerState)

  return {
    passengers: state.passengers,
    layoutId: state.layoutId,
    activePassengerId: state.activePassengerId,
    activePassenger: state.passengers.find((passenger) => passenger.id === state.activePassengerId),
    feedback: state.feedback,
    selectPassenger: (passengerId) => dispatch({ type: 'selectPassenger', passengerId }),
    changePassengerCount: (count) => dispatch({ type: 'changePassengerCount', count }),
    changeLayout: (layoutId) => dispatch({ type: 'changeLayout', layoutId }),
    selectSeat: (seatId) => dispatch({ type: 'assignSeat', seatId, layoutId: state.layoutId }),
    removeSeat: (passengerId) => dispatch({ type: 'removeSeat', passengerId }),
    selectMeal: (passengerId, mealId) => dispatch({ type: 'selectMeal', passengerId, mealId }),
    removeMeal: (passengerId) => dispatch({ type: 'removeMeal', passengerId }),
  }
}
