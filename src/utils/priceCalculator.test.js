import assert from 'node:assert/strict'
import test from 'node:test'
import { aircraftLayouts } from '../data/aircraftLayouts.js'
import { getSeatLookup } from './seatHelpers.js'
import { calculateSeatPricing, formatPrice } from './priceCalculator.js'
import { createPassengerState, passengerReducer } from './passengerHelpers.js'

const narrowSeats = getSeatLookup(aircraftLayouts['3-2'])

function withSeats(...seatIds) {
  return seatIds.map((seatId, index) => ({ id: `passenger-${index + 1}`, seatId }))
}

test('an empty or unassigned booking has no pricing lines or selected seats', () => {
  for (const passengers of [[], withSeats(null, null, null)]) {
    assert.deepEqual(calculateSeatPricing(passengers, narrowSeats), {
      selectedCount: 0, lineItems: [], seatTotal: 0,
    })
  }
})

test('free seats count as selected and have an explicit zero-price line', () => {
  const pricing = calculateSeatPricing(withSeats('5C', '6A', '7A'), narrowSeats)
  assert.equal(pricing.selectedCount, 3)
  assert.equal(pricing.seatTotal, 0)
  assert.deepEqual(pricing.lineItems, [{
    id: 'standard', label: 'Standard', unitPrice: 0, quantity: 3, subtotal: 0,
  }])
})

test('mixed seat categories have correct individual subtotals and a combined total', () => {
  const pricing = calculateSeatPricing(withSeats('1A', '2A', '5C'), narrowSeats)
  assert.equal(pricing.selectedCount, 3)
  assert.equal(pricing.seatTotal, 600)
  assert.deepEqual(pricing.lineItems.map(({ id, quantity, subtotal }) => ({ id, quantity, subtotal })), [
    { id: 'standard', quantity: 1, subtotal: 0 },
    { id: 'premium', quantity: 1, subtotal: 250 },
    { id: 'extraLegroom', quantity: 1, subtotal: 350 },
  ])
})

test('seats in the same category are grouped by quantity without changing input data', () => {
  const passengers = Object.freeze(withSeats('2A', '2C', '3D').map(Object.freeze))
  const pricing = calculateSeatPricing(passengers, narrowSeats)
  assert.equal(pricing.seatTotal, 750)
  assert.equal(pricing.lineItems.length, 1)
  assert.equal(pricing.lineItems[0].quantity, 3)
  assert.equal(pricing.lineItems[0].unitPrice, 250)
  assert.equal(calculateSeatPricing(withSeats(null), narrowSeats).seatTotal, 0)
  assert.equal(pricing.lineItems[0].quantity, 3)
})

test('missing and occupied seat IDs cannot add charges or count toward completion', () => {
  const pricing = calculateSeatPricing(withSeats('1H', '2B', 'toString', null, '5C'), narrowSeats)
  assert.equal(pricing.selectedCount, 1)
  assert.equal(pricing.seatTotal, 0)
  assert.equal(pricing.lineItems[0].quantity, 1)
})

test('count and cabin changes immediately recalculate charges from the retained assignments', () => {
  let state = createPassengerState()
  for (const [index, seatId] of ['1C', '4D', '1A'].entries()) {
    state = passengerReducer(state, { type: 'selectPassenger', passengerId: `passenger-${index + 1}` })
    state = passengerReducer(state, { type: 'assignSeat', seatId, layoutId: state.layoutId })
  }
  assert.equal(calculateSeatPricing(state.passengers, narrowSeats).seatTotal, 950)

  const reduced = passengerReducer(state, { type: 'changePassengerCount', count: 2 })
  assert.equal(calculateSeatPricing(reduced.passengers, narrowSeats).seatTotal, 600)

  const switched = passengerReducer(state, { type: 'changeLayout', layoutId: '2-3-2' })
  const pricing = calculateSeatPricing(switched.passengers, getSeatLookup(aircraftLayouts[switched.layoutId]))
  assert.equal(pricing.seatTotal, 350)
  assert.equal(pricing.selectedCount, 1)
})

test('prices use Indian rupees and Indian digit grouping, including zero', () => {
  assert.equal(formatPrice(0), '₹0')
  assert.equal(formatPrice(600), '₹600')
  assert.equal(formatPrice(125000), '₹1,25,000')
})
