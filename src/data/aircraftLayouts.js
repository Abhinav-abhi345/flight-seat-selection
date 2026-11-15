export const aircraftLayouts = {
  '3-2': {
    id: '3-2',
    label: '3–2',
    description: 'Five seats per row, one aisle',
    groups: [['A', 'B', 'C'], ['D', 'E']],
    rowCount: 10,
    occupiedSeatIds: ['2B', '3E', '5A', '5B', '6D', '7C', '8E', '9B', '10D'],
    extraLegroomRows: [1],
    premiumRows: [2, 3, 4],
  },
  '2-3-2': {
    id: '2-3-2',
    label: '2–3–2',
    description: 'Seven seats per row, two aisles',
    groups: [['A', 'B'], ['D', 'E', 'F'], ['G', 'H']],
    rowCount: 10,
    occupiedSeatIds: ['2B', '2G', '3E', '4D', '4H', '5A', '5B', '6D', '7F', '8H', '9B', '10D'],
    extraLegroomRows: [1],
    premiumRows: [2, 3, 4],
  },
}

export const defaultLayoutId = '3-2'
