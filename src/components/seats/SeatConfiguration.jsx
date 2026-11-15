import { aircraftLayouts } from '../../data/aircraftLayouts'

export default function SeatConfiguration({ layoutId, onLayoutChange }) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-medium text-slate-600">Cabin layout</legend>
      <div className="inline-flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
        {Object.values(aircraftLayouts).map((layout) => (
          <label
            key={layout.id}
            className={`relative cursor-pointer rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-teal-700 ${layout.id === layoutId ? 'bg-teal-800 text-white shadow-sm' : 'text-slate-600 hover:bg-white'}`}
          >
            <input
              type="radio"
              name="aircraft-layout"
              value={layout.id}
              checked={layout.id === layoutId}
              onChange={() => onLayoutChange(layout.id)}
              className="sr-only"
              aria-label={`${layout.label}: ${layout.description}`}
            />
            {layout.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
