import assert from 'node:assert/strict'
import test from 'node:test'
import { createPassengerState, passengerReducer } from './passengerHelpers.js'

test('initial booking has three unique unassigned passengers and one active passenger', () => {
  const state = createPassengerState()

  assert.equal(state.passengers.length, 3)
  assert.equal(new Set(state.passengers.map((passenger) => passenger.id)).size, 3)
  assert.equal(state.activePassengerId, state.passengers[0].id)
  assert.ok(state.passengers.every((passenger) => passenger.seatId === null))
})

test('switching passengers preserves the list and existing seat assignments', () => {
  const initial = createPassengerState()
  const state = {
    ...initial,
    passengers: initial.passengers.map((passenger, index) => (
      index === 0 ? { ...passenger, seatId: '1A' } : passenger
    )),
  }
  const next = passengerReducer(state, { type: 'selectPassenger', passengerId: 'passenger-2' })

  assert.equal(next.activePassengerId, 'passenger-2')
  assert.strictEqual(next.passengers, state.passengers)
  assert.equal(next.passengers[0].seatId, '1A')
  assert.equal(state.activePassengerId, 'passenger-1')
})

test('increasing passenger count retains profiles and the active passenger', () => {
  const state = passengerReducer(createPassengerState(), {
    type: 'selectPassenger', passengerId: 'passenger-2',
  })
  const next = passengerReducer(state, { type: 'changePassengerCount', count: 9 })

  assert.equal(next.passengers.length, 9)
  assert.equal(next.activePassengerId, 'passenger-2')
  assert.strictEqual(next.passengers[1], state.passengers[1])
  assert.equal(next.passengers[8].name, 'Passenger 9')
  assert.equal(next.passengers[8].seatId, null)
  assert.equal(state.passengers.length, 3)
})

test('removing the active passenger safely selects the first remaining passenger', () => {
  const state = passengerReducer(createPassengerState(), {
    type: 'selectPassenger', passengerId: 'passenger-3',
  })
  const next = passengerReducer(state, { type: 'changePassengerCount', count: 1 })

  assert.equal(next.passengers.length, 1)
  assert.equal(next.activePassengerId, 'passenger-1')
  assert.equal(next.feedback.kind, 'success')
  assert.equal(state.activePassengerId, 'passenger-3')
})

test('removed passengers do not recover old selections when added again', () => {
  const initial = createPassengerState()
  const state = {
    ...initial,
    passengers: initial.passengers.map((passenger, index) => (
      index === 2 ? { ...passenger, seatId: '1E' } : passenger
    )),
  }
  const smaller = passengerReducer(state, { type: 'changePassengerCount', count: 2 })
  const restored = passengerReducer(smaller, { type: 'changePassengerCount', count: 3 })

  assert.equal(restored.passengers[2].seatId, null)
  assert.notStrictEqual(restored.passengers[2], state.passengers[2])
  assert.strictEqual(restored.passengers[0], state.passengers[0])
})

test('invalid counts and unknown passenger IDs cannot corrupt the booking', () => {
  const state = createPassengerState()

  for (const count of [0, -1, 10, 1.5, NaN, '3']) {
    const next = passengerReducer(state, { type: 'changePassengerCount', count })
    assert.strictEqual(next.passengers, state.passengers)
    assert.equal(next.activePassengerId, state.activePassengerId)
    assert.equal(next.feedback.kind, 'error')
    assert.throws(() => createPassengerState(count), RangeError)
  }

  const next = passengerReducer(state, { type: 'selectPassenger', passengerId: 'passenger-99' })
  assert.equal(next.activePassengerId, state.activePassengerId)
  assert.strictEqual(next.passengers, state.passengers)
  assert.equal(next.feedback.kind, 'error')
})
