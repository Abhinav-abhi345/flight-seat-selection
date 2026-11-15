import { Check, UserRound, X } from 'lucide-react'

export default function SeatLegend() {
  return (
    <ul aria-label="Seat legend" className="flex flex-wrap justify-center gap-x-5 gap-y-3 text-[11px] text-slate-600">
      <li className="flex items-center gap-2"><span className="legend-seat border-slate-300 bg-white" aria-hidden="true" />Standard · Free</li>
      <li className="flex items-center gap-2"><span className="legend-seat border-sky-300 bg-sky-50" aria-hidden="true" />Premium · ₹250</li>
      <li className="flex items-center gap-2"><span className="legend-seat border-amber-400 bg-amber-50" aria-hidden="true" />Extra legroom · ₹350</li>
      <li className="flex items-center gap-2"><span className="legend-seat border-teal-800 bg-teal-800 text-white" aria-hidden="true"><Check size={11} /></span>Selected</li>
      <li className="flex items-center gap-2"><span className="legend-seat border-violet-300 bg-violet-100 text-violet-900" aria-hidden="true"><UserRound size={11} /></span>Your group</li>
      <li className="flex items-center gap-2"><span className="legend-seat border-slate-200 bg-slate-100 text-slate-400" aria-hidden="true"><X size={11} /></span>Occupied</li>
    </ul>
  )
}
