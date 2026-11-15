import { getSeatLookup } from './utils/seatHelpers'
import Header from './components/layout/Header'
import FlightInfo from './components/layout/FlightInfo'
import BookingProgress from './components/layout/BookingProgress'
import PassengerSelector from './components/passengers/PassengerSelector'
import AircraftSeatMap from './components/seats/AircraftSeatMap'
import BookingSummary from './components/summary/BookingSummary'
import usePassengers from './hooks/usePassengers'
import { aircraftLayouts } from './data/aircraftLayouts'

export default function App() {
  const {
    passengers,
    layoutId,
    changeLayout,
    selectSeat,
    removeSeat,
    activePassenger,
    activePassengerId,
    feedback,
    selectPassenger,
    changePassengerCount,
  } = usePassengers()
  const layout = aircraftLayouts[layoutId]
  const seatsById = getSeatLookup(layout)

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to seat selection</a>
      <Header />
      <main id="main-content" className="mx-auto max-w-[1440px] px-4 pb-12 sm:px-6 lg:px-10">
        <BookingProgress />
        <div className="mb-7">
          <p className="eyebrow mb-2">MAKE YOURSELF AT HOME</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            A little more you. A better journey.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Window views or room to stretch? Find your favourite spot in the sky.
          </p>
        </div>
        <FlightInfo />
        <div className="mt-6 grid items-start gap-5 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_300px]">
          <PassengerSelector
            passengers={passengers}
            activePassengerId={activePassengerId}
            onPassengerSelect={selectPassenger}
            onCountChange={changePassengerCount}
            seatsById={seatsById}
          />
          <AircraftSeatMap
            layout={layout}
            onLayoutChange={changeLayout}
            activePassenger={activePassenger}
            passengers={passengers}
            onSeatSelect={selectSeat}
            onSeatRemove={removeSeat}
            feedback={feedback}
          />
          <BookingSummary passengers={passengers} seatsById={seatsById} onSeatRemove={removeSeat} />
        </div>
        <p className="mt-7 text-center text-xs leading-5 text-slate-500">
          A mock flight experience. No payment or actual reservation is made.
        </p>
      </main>
    </>
  )
}
