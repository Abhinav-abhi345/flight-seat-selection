export function buildSeatRows(layout) {
  const occupiedSeatIds = new Set(layout.occupiedSeatIds)

  return Array.from({ length: layout.rowCount }, (_, index) => {
    const row = index + 1
    const category = layout.extraLegroomRows.includes(row)
      ? 'extraLegroom'
      : layout.premiumRows.includes(row) ? 'premium' : 'standard'

    return {
      number: row,
      groups: layout.groups.map((group) => group.map((letter) => ({
        id: `${row}${letter}`,
        letter,
        row,
        category,
        occupied: occupiedSeatIds.has(`${row}${letter}`),
      }))),
    }
  })
}

export function getSeatGridColumns(layout) {
  return `18px ${layout.groups
    .map((group) => `repeat(${group.length}, minmax(44px, 1fr))`)
    .join(' 16px ')}`
}

export function getSeatLookup(layout) {
  return Object.fromEntries(buildSeatRows(layout).flatMap((row) => (
    row.groups.flat().map((seat) => [seat.id, seat])
  )))
}
