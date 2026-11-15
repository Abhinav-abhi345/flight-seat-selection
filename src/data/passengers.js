export const passengerLimits = { min: 1, max: 9, initial: 3 }

export function createPassenger(number) {
  return {
    id: `passenger-${number}`,
    name: `Passenger ${number}`,
    seatId: null,
  }
}
