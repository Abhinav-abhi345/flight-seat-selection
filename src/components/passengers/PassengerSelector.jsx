import { Info, Users } from 'lucide-react'
import PassengerCard from './PassengerCard'
import { passengerLimits } from '../../data/passengers'

export default function PassengerSelector({ passengers, activePassengerId, onPassengerSelect, onCountChange, seatsById }) {
  return (
    <section aria-labelledby="passenger-heading" className="panel p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 id="passenger-heading" className="section-title">Passengers</h2>
        <Users size={18} className="text-slate-400" aria-hidden="true" />
      </div>
      <p className="mt-1.5 text-xs text-slate-500">A comfortable spot for everyone.</p>
      <div className="mt-5">
        <label htmlFor="passenger-count" className="block text-xs font-medium text-slate-600">Number of passengers</label>
        <select
          id="passenger-count"
          value={passengers.length}
          onChange={(event) => onCountChange(Number(event.target.value))}
          aria-describedby="passenger-count-hint"
          className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 hover:border-teal-600"
        >
          {Array.from({ length: passengerLimits.max - passengerLimits.min + 1 }, (_, index) => {
            const count = index + passengerLimits.min
            return <option key={count} value={count}>{count} passenger{count === 1 ? '' : 's'}</option>
          })}
        </select>
        <p id="passenger-count-hint" className="mt-2 text-[11px] leading-5 text-slate-500">
          Reducing the count removes the last passengers and their selections.
        </p>
      </div>
      <p className="mt-5 mb-3 text-xs font-medium text-slate-600">Select a traveller · Economy</p>
      <ul className="grid gap-2.5 sm:grid-cols-3 lg:grid-cols-1">
        {passengers.map((passenger, index) => (
          <li key={passenger.id}>
            <PassengerCard
              passenger={passenger}
              number={index + 1}
              isActive={passenger.id === activePassengerId}
              onSelect={onPassengerSelect}
              seat={seatsById[passenger.seatId]}
            />
          </li>
        ))}
      </ul>
      <div className="mt-5 flex gap-2.5 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">
        <Info size={15} className="mt-0.5 shrink-0 text-teal-700" aria-hidden="true" />
        <p>Each traveller can have one seat. Standard seats are complimentary.</p>
      </div>
    </section>
  )
}
