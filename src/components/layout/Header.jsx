import { Plane, ShieldCheck } from 'lucide-react'

export default function Header() {
  return (
    <header className="border-b border-slate-200/80 bg-white">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-10">
        <div className="flex items-center gap-2.5" aria-label="Aero airlines">
          <span className="flex size-9 items-center justify-center rounded-xl bg-teal-800 text-white">
            <Plane size={21} aria-hidden="true" />
          </span>
          <span className="text-3xl font-semibold tracking-[-0.08em] text-teal-950">aero<span className="text-teal-600">.</span></span>
        </div>
        <p className="hidden text-sm text-slate-500 md:block">Good journeys start with a great seat.</p>
        <span className="flex items-center gap-2 text-xs font-medium text-teal-800 sm:text-sm">
          <ShieldCheck size={17} aria-hidden="true" />
          Your booking
        </span>
      </div>
    </header>
  )
}
