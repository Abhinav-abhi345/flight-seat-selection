import { ArrowRight, Clock3, Plane } from 'lucide-react'

export default function FlightInfo() {
  return (
    <section aria-label="Flight details" className="panel grid gap-5 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 sm:gap-6 lg:w-fit">
        <div className="min-w-0">
          <p className="text-2xl font-semibold tracking-tight">BOM</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            <span className="block min-[400px]:inline">Mumbai</span>
            <span className="hidden min-[400px]:inline"> · </span>
            <span className="block min-[400px]:inline">08:20</span>
          </p>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-slate-600">
          <Plane size={19} aria-hidden="true" className="rotate-45" />
          <span className="h-px w-12 bg-slate-200 sm:w-20" />
          <span className="text-[10px] font-medium uppercase tracking-wider">Non-stop</span>
        </div>
        <div className="min-w-0 text-right lg:text-left">
          <p className="text-2xl font-semibold tracking-tight">DEL</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            <span className="block min-[400px]:inline">New Delhi</span>
            <span className="hidden min-[400px]:inline"> · </span>
            <span className="block min-[400px]:inline">10:30</span>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs min-[400px]:text-sm sm:gap-6 lg:border-t-0 lg:pt-0">
        <div className="min-w-0">
          <p className="font-medium text-slate-800">Fri, 20 Nov 2026</p>
          <p className="mt-1 flex items-center gap-1.5 text-[11px] leading-5 text-slate-500 sm:text-xs"><Clock3 size={13} className="shrink-0" aria-hidden="true" />2h 10m · All times local</p>
        </div>
        <div className="min-w-0 border-l border-slate-200 pl-3 text-right sm:pl-6 lg:text-left">
          <p className="font-medium text-slate-800">Aero AE 204</p>
          <p className="mt-1 flex flex-wrap items-center justify-end gap-x-1 text-[11px] leading-5 text-slate-500 sm:text-xs lg:justify-start">
            <span>Economy</span>
            <ArrowRight size={12} className="hidden shrink-0 min-[400px]:block" aria-hidden="true" />
            <span className="whitespace-nowrap">One way</span>
          </p>
        </div>
      </div>
    </section>
  )
}
