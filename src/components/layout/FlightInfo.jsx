import { ArrowRight, Clock3, Plane } from 'lucide-react'

export default function FlightInfo() {
  return (
    <section aria-label="Flight details" className="panel flex flex-wrap items-center justify-between gap-x-8 gap-y-5 px-5 py-5 sm:px-6">
      <div className="flex items-center gap-4 sm:gap-6">
        <div>
          <p className="text-2xl font-semibold tracking-tight">BOM</p>
          <p className="mt-1 text-xs text-slate-500">Mumbai · 08:20</p>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-slate-600">
          <Plane size={19} aria-hidden="true" className="rotate-45" />
          <span className="h-px w-12 bg-slate-200 sm:w-20" />
          <span className="text-[10px] font-medium uppercase tracking-wider">Non-stop</span>
        </div>
        <div>
          <p className="text-2xl font-semibold tracking-tight">DEL</p>
          <p className="mt-1 text-xs text-slate-500">New Delhi · 10:30</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        <div>
          <p className="font-medium text-slate-800">Fri, 20 Nov 2026</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><Clock3 size={13} aria-hidden="true" />2h 10m · All times local</p>
        </div>
        <div className="border-l border-slate-200 pl-6">
          <p className="font-medium text-slate-800">Aero AE 204</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">Economy <ArrowRight size={12} aria-hidden="true" /> One way</p>
        </div>
      </div>
    </section>
  )
}
