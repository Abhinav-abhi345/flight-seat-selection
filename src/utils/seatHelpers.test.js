import assert from 'node:assert/strict'
import test from 'node:test'
import { aircraftLayouts } from '../data/aircraftLayouts.js'
import { seatCategories } from '../data/seats.js'
import { buildSeatRows } from './seatHelpers.js'

test('3–2 cabin contains 50 uniquely identified seats in the correct groups', () => {
  const rows = buildSeatRows(aircraftLayouts['3-2'])
  const seats = rows.flatMap((row) => row.groups.flat())

  assert.equal(rows.length, 10)
  assert.equal(seats.length, 50)
  assert.equal(new Set(seats.map((seat) => seat.id)).size, 50)
  assert.deepEqual(rows[0].groups.map((group) => group.map((seat) => seat.id)), [
    ['1A', '1B', '1C'], ['1D', '1E'],
  ])
  assert.equal(rows.at(-1).groups.at(-1).at(-1).id, '10E')
})

test('2–3–2 cabin follows the PDF labels and omits seats from the other layout', () => {
  const rows = buildSeatRows(aircraftLayouts['2-3-2'])
  const seats = rows.flatMap((row) => row.groups.flat())

  assert.equal(seats.length, 70)
  assert.equal(new Set(seats.map((seat) => seat.id)).size, 70)
  assert.deepEqual(rows[0].groups.map((group) => group.map((seat) => seat.id)), [
    ['1A', '1B'], ['1D', '1E', '1F'], ['1G', '1H'],
  ])
  assert.equal(seats.some((seat) => seat.id === '1C'), false)
})

test('switching layouts derives occupied seats from the target cabin', () => {
  const wideSeats = buildSeatRows(aircraftLayouts['2-3-2']).flatMap((row) => row.groups.flat())
  const narrowSeats = buildSeatRows(aircraftLayouts['3-2']).flatMap((row) => row.groups.flat())

  assert.equal(wideSeats.find((seat) => seat.id === '2G').occupied, true)
  assert.equal(narrowSeats.some((seat) => seat.id === '2G'), false)
  assert.equal(narrowSeats.find((seat) => seat.id === '7C').occupied, true)
  assert.equal(wideSeats.some((seat) => seat.id === '7C'), false)
  assert.equal(narrowSeats.find((seat) => seat.id === '1A').occupied, false)
})

test('both cabins include free, premium and extra-legroom seat categories', () => {
  for (const layout of Object.values(aircraftLayouts)) {
    const seats = buildSeatRows(layout).flatMap((row) => row.groups.flat())
    assert.equal(seatCategories[seats.find((seat) => seat.id === '1A').category].price, 350)
    assert.equal(seatCategories[seats.find((seat) => seat.id === '2A').category].price, 250)
    assert.equal(seatCategories[seats.find((seat) => seat.id === '10A').category].price, 0)
    assert.equal(seats.filter((seat) => seat.occupied).length, layout.occupiedSeatIds.length)
  }
})
