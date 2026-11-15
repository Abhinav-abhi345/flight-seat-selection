import assert from 'node:assert/strict'
import test from 'node:test'
import { createPassengerState, passengerReducer } from './passengerHelpers.js'
import { aircraftLayouts } from '../data/aircraftLayouts.js'
import { getSeatLookup } from './seatHelpers.js'
import { getSeatPrice } from './priceCalculator.js'

function chooseSeat(state, seatId) {
  return passengerReducer(state, { type: 'assignSeat', seatId, layoutId: state.layoutId })
}

function selectPassenger(state, number) {
  return passengerReducer(state, { type: 'selectPassenger', passengerId: `passenger-${number}` })
}

test('assigning and changing a seat updates only the active passenger', () => {
  const initial = createPassengerState()
  const assigned = chooseSeat(initial, '1A')
  const changed = chooseSeat(assigned, '5C')

  assert.equal(initial.passengers[0].seatId, null)
  assert.equal(assigned.passengers[0].seatId, '1A')
  assert.equal(changed.passengers[0].seatId, '5C')
  assert.strictEqual(changed.passengers[1], initial.passengers[1])
  assert.equal(changed.feedback.kind, 'success')
  assert.equal(changed.passengers.some((passenger) => passenger.seatId === '1A'), false)
})

test('occupied, nonexistent and malformed seat IDs are rejected without losing an assignment', () => {
  const state = chooseSeat(createPassengerState(), '1A')
  for (const seatId of ['2B', '99Z', '1H', 'toString', '__proto__', null]) {
    const rejected = chooseSeat(state, seatId)
    assert.strictEqual(rejected.passengers, state.passengers)
    assert.equal(rejected.passengers[0].seatId, '1A')
    assert.equal(rejected.feedback.kind, 'error')
  }
})

test('switching passengers retains assignments and blocks duplicate selections', () => {
  const first = chooseSeat(createPassengerState(), '1A')
  const second = selectPassenger(first, 2)
  const rejected = chooseSeat(second, '1A')
  assert.equal(rejected.feedback.kind, 'error')
  assert.equal(rejected.passengers[1].seatId, null)

  const assigned = chooseSeat(second, '2A')
  const switched = selectPassenger(assigned, 1)
  assert.equal(switched.passengers[0].seatId, '1A')
  assert.equal(switched.passengers[1].seatId, '2A')
})

test('removing an assignment releases it for another passenger', () => {
  const assigned = chooseSeat(createPassengerState(), '1A')
  const removed = passengerReducer(assigned, { type: 'removeSeat', passengerId: 'passenger-1' })
  const reassigned = chooseSeat(selectPassenger(removed, 2), '1A')

  assert.equal(assigned.passengers[0].seatId, '1A')
  assert.equal(removed.passengers[0].seatId, null)
  assert.equal(reassigned.passengers[1].seatId, '1A')
})

test('switching cabins retains valid seats and clears missing or newly occupied seats atomically', () => {
  let state = chooseSeat(createPassengerState(), '1A')
  state = chooseSeat(selectPassenger(state, 2), '1C')
  state = chooseSeat(selectPassenger(state, 3), '4D')
  const switched = passengerReducer(state, { type: 'changeLayout', layoutId: '2-3-2' })

  assert.equal(switched.layoutId, '2-3-2')
  assert.deepEqual(switched.passengers.map((passenger) => passenger.seatId), ['1A', null, null])
  assert.equal(switched.activePassengerId, 'passenger-3')
  assert.ok(switched.feedback.text.includes('Passenger 2 (1C)'))
  assert.ok(switched.feedback.text.includes('Passenger 3 (4D)'))
  assert.equal(state.passengers[2].seatId, '4D')
})

test('wide-cabin-only seats are cleared and not resurrected when switching back', () => {
  let state = passengerReducer(createPassengerState(), { type: 'changeLayout', layoutId: '2-3-2' })
  state = chooseSeat(state, '1H')
  state = passengerReducer(state, { type: 'changeLayout', layoutId: '3-2' })
  state = passengerReducer(state, { type: 'changeLayout', layoutId: '2-3-2' })
  assert.equal(state.passengers[0].seatId, null)
})

test('stale seat events, invalid cabin IDs and missing active passengers are rejected', () => {
  const initial = createPassengerState()
  const switched = passengerReducer(initial, { type: 'changeLayout', layoutId: '2-3-2' })
  const stale = passengerReducer(switched, { type: 'assignSeat', seatId: '1A', layoutId: '3-2' })
  assert.equal(stale.feedback.kind, 'error')
  assert.strictEqual(stale.passengers, switched.passengers)

  const invalid = passengerReducer(initial, { type: 'changeLayout', layoutId: 'unknown' })
  assert.equal(invalid.layoutId, '3-2')
  assert.equal(invalid.feedback.kind, 'error')

  const missing = chooseSeat({ ...initial, activePassengerId: 'missing' }, '1A')
  assert.equal(missing.feedback.kind, 'error')
  assert.strictEqual(missing.passengers, initial.passengers)
})

test('reducing passenger count releases removed assignments without altering retained seats', () => {
  let state = chooseSeat(createPassengerState(), '1A')
  state = chooseSeat(selectPassenger(state, 3), '1E')
  state = passengerReducer(state, { type: 'changePassengerCount', count: 2 })
  state = chooseSeat(selectPassenger(state, 2), '1E')

  assert.deepEqual(state.passengers.map((passenger) => passenger.seatId), ['1A', '1E'])
})

test('displayed charges reflect paid, free, changed and removed seats from current assignments', () => {
  const seats = getSeatLookup(aircraftLayouts['3-2'])
  const total = (state) => state.passengers.reduce((amount, passenger) => amount + getSeatPrice(seats[passenger.seatId]), 0)
  let state = chooseSeat(createPassengerState(), '1A')
  assert.equal(total(state), 350)
  state = chooseSeat(state, '2A')
  assert.equal(total(state), 250)
  state = chooseSeat(state, '5C')
  assert.equal(total(state), 0)
  state = chooseSeat(selectPassenger(state, 2), '1E')
  assert.equal(total(state), 350)
  state = passengerReducer(state, { type: 'removeSeat', passengerId: 'passenger-2' })
  assert.equal(total(state), 0)
})
