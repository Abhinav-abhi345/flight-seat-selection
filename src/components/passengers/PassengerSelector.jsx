import { Info, Users } from 'lucide-react'
import PassengerCard from './PassengerCard'
import PassengerCountSelect from './PassengerCountSelect'

export default function PassengerSelector({ passengers, activePassengerId, onPassengerSelect, onCountChange, seatsById }) {
  return (
    <section aria-labelledby="passenger-heading" className="panel p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 id="passenger-heading" className="section-title">Passengers</h2>
        <Users size={18} className="text-slate-400" aria-hidden="true" />
      </div>
      <p className="mt-1.5 text-xs text-slate-500">A comfortable spot for everyone.</p>
      <div className="mt-5">
        <PassengerCountSelect value={passengers.length} onChange={onCountChange} />
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
