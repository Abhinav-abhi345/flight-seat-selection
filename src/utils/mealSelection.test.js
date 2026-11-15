import assert from 'node:assert/strict'
import test from 'node:test'
import { aircraftLayouts } from '../data/aircraftLayouts.js'
import { createPassengerState, passengerReducer } from './passengerHelpers.js'
import { getSeatLookup } from './seatHelpers.js'
import { calculateBookingPricing, calculateMealPricing } from './priceCalculator.js'

function chooseMeal(state, passengerId, mealId) {
  return passengerReducer(state, { type: 'selectMeal', passengerId, mealId })
}

function chooseSeat(state, seatId) {
  return passengerReducer(state, { type: 'assignSeat', seatId, layoutId: state.layoutId })
}

function pricing(state) {
  return calculateBookingPricing(state.passengers, getSeatLookup(aircraftLayouts[state.layoutId]))
}

test('a free meal is selected explicitly and does not assign a seat or add a charge', () => {
  const initial = createPassengerState()
  const next = chooseMeal(initial, 'passenger-1', 'fruit-bowl')

  assert.equal(initial.passengers[0].mealId, null)
  assert.equal(next.passengers[0].mealId, 'fruit-bowl')
  assert.equal(next.passengers[0].seatId, null)
  assert.equal(pricing(next).selectedMealCount, 1)
  assert.equal(pricing(next).grandTotal, 0)
  assert.equal(next.feedback.scope, 'meal')
})

test('changing a meal replaces it without changing the seat assignment', () => {
  const initial = chooseSeat(createPassengerState(), '1A')
  const paid = chooseMeal(initial, 'passenger-1', 'vegetarian')
  const changed = chooseMeal(paid, 'passenger-1', 'chicken')

  assert.equal(paid.passengers[0].mealId, 'vegetarian')
  assert.equal(changed.passengers[0].mealId, 'chicken')
  assert.equal(changed.passengers[0].seatId, '1A')
  assert.equal(pricing(changed).selectedMealCount, 1)
  assert.equal(pricing(changed).grandTotal, 600)
  assert.strictEqual(changed.passengers[1], initial.passengers[1])
})

test('passenger switching retains meals and multiple passengers can choose the same meal', () => {
  let state = chooseMeal(createPassengerState(), 'passenger-1', 'vegetarian')
  state = passengerReducer(state, { type: 'selectPassenger', passengerId: 'passenger-2' })
  state = chooseMeal(state, 'passenger-2', 'vegetarian')

  assert.equal(state.passengers[0].mealId, 'vegetarian')
  assert.equal(state.passengers[1].mealId, 'vegetarian')
  assert.equal(pricing(state).mealTotal, 360)
  assert.equal(pricing(state).selectedMealCount, 2)
})

test('removing one passenger meal leaves seats and other passenger meals unchanged', () => {
  let state = chooseSeat(createPassengerState(), '1A')
  state = chooseMeal(state, 'passenger-1', 'vegetarian')
  state = chooseMeal(state, 'passenger-2', 'chicken')
  const removed = passengerReducer(state, { type: 'removeMeal', passengerId: 'passenger-1' })

  assert.equal(removed.passengers[0].mealId, null)
  assert.equal(removed.passengers[0].seatId, '1A')
  assert.strictEqual(removed.passengers[1], state.passengers[1])
  assert.equal(pricing(removed).grandTotal, 600)
  assert.equal(state.passengers[0].mealId, 'vegetarian')
})

test('invalid meals and stale passenger IDs are rejected without changing selections', () => {
  const state = chooseMeal(createPassengerState(), 'passenger-1', 'vegetarian')
  for (const mealId of ['unknown', 'toString', '__proto__', '', null]) {
    const rejected = chooseMeal(state, 'passenger-1', mealId)
    assert.strictEqual(rejected.passengers, state.passengers)
    assert.equal(rejected.feedback.kind, 'error')
  }
  const invalidPassenger = chooseMeal(state, 'passenger-99', 'chicken')
  assert.strictEqual(invalidPassenger.passengers, state.passengers)
  assert.equal(invalidPassenger.feedback.kind, 'error')
  const invalidRemoval = passengerReducer(state, { type: 'removeMeal', passengerId: 'passenger-99' })
  assert.strictEqual(invalidRemoval.passengers, state.passengers)
  assert.equal(invalidRemoval.feedback.kind, 'error')
})

test('changing passenger count preserves retained meals and never restores removed meals', () => {
  let state = chooseMeal(createPassengerState(), 'passenger-1', 'fruit-bowl')
  state = chooseMeal(state, 'passenger-3', 'chicken')
  const retained = state.passengers[0]
  state = passengerReducer(state, { type: 'changePassengerCount', count: 1 })
  assert.equal(pricing(state).mealTotal, 0)
  state = passengerReducer(state, { type: 'changePassengerCount', count: 3 })

  assert.strictEqual(state.passengers[0], retained)
  assert.equal(state.passengers[2].mealId, null)
  assert.equal(pricing(state).selectedMealCount, 1)
})

test('cabin changes and seat removal preserve the passenger meal', () => {
  let state = chooseSeat(createPassengerState(), '1C')
  state = chooseMeal(state, 'passenger-1', 'chicken')
  state = passengerReducer(state, { type: 'changeLayout', layoutId: '2-3-2' })
  assert.equal(state.passengers[0].seatId, null)
  assert.equal(state.passengers[0].mealId, 'chicken')
  assert.equal(pricing(state).grandTotal, 250)

  state = chooseSeat(state, '1A')
  state = passengerReducer(state, { type: 'removeSeat', passengerId: 'passenger-1' })
  assert.equal(state.passengers[0].mealId, 'chicken')
  assert.equal(pricing(state).grandTotal, 250)
})

test('meal pricing groups quantities, including free meals, independently from seats', () => {
  const passengers = Object.freeze([
    Object.freeze({ mealId: 'vegetarian' }),
    Object.freeze({ mealId: 'vegetarian' }),
    Object.freeze({ mealId: 'fruit-bowl' }),
  ])
  const result = calculateMealPricing(passengers)

  assert.equal(result.selectedMealCount, 3)
  assert.equal(result.mealTotal, 360)
  assert.deepEqual(result.mealLineItems.map(({ id, quantity, subtotal }) => ({ id, quantity, subtotal })), [
    { id: 'fruit-bowl', quantity: 1, subtotal: 0 },
    { id: 'vegetarian', quantity: 2, subtotal: 360 },
  ])
})

test('combined pricing recalculates after seat, meal and passenger changes', () => {
  let state = chooseSeat(createPassengerState(), '1A')
  state = chooseMeal(state, 'passenger-1', 'vegetarian')
  state = passengerReducer(state, { type: 'selectPassenger', passengerId: 'passenger-2' })
  state = chooseSeat(state, '2A')
  state = chooseMeal(state, 'passenger-2', 'chicken')
  assert.equal(pricing(state).seatTotal, 600)
  assert.equal(pricing(state).mealTotal, 430)
  assert.equal(pricing(state).grandTotal, 1030)

  state = passengerReducer(state, { type: 'removeSeat', passengerId: 'passenger-1' })
  assert.equal(pricing(state).grandTotal, 680)
  state = passengerReducer(state, { type: 'removeMeal', passengerId: 'passenger-1' })
  assert.equal(pricing(state).grandTotal, 500)
  state = chooseMeal(state, 'passenger-2', 'fruit-bowl')
  assert.equal(pricing(state).grandTotal, 250)
  state = passengerReducer(state, { type: 'changePassengerCount', count: 1 })
  assert.equal(pricing(state).grandTotal, 0)
})

test('skipping a meal and selecting a free meal both cost zero but remain distinct choices', () => {
  const initial = createPassengerState(1)
  const free = chooseMeal(initial, 'passenger-1', 'fruit-bowl')
  const skipped = passengerReducer(free, { type: 'removeMeal', passengerId: 'passenger-1' })

  assert.equal(pricing(free).selectedMealCount, 1)
  assert.equal(pricing(skipped).selectedMealCount, 0)
  assert.equal(pricing(free).grandTotal, 0)
  assert.equal(pricing(skipped).grandTotal, 0)
  assert.deepEqual(pricing(skipped).mealLineItems, [])
})

test('unknown meal identifiers cannot add charges', () => {
  const result = calculateMealPricing([{ mealId: 'unknown' }, { mealId: null }, { mealId: 'toString' }])
  assert.equal(result.selectedMealCount, 0)
  assert.equal(result.mealTotal, 0)
  assert.deepEqual(result.mealLineItems, [])
})
