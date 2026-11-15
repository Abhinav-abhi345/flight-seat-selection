import { formatPrice } from '../../utils/priceCalculator'

export default function PriceBreakdown({ seatTotal }) {
  return (
    <dl className="border-t border-slate-200 pt-4">
      <div className="flex items-center justify-between text-sm text-slate-600">
        <dt>Seat charges</dt>
        <dd>{formatPrice(seatTotal)}</dd>
      </div>
      <div className="mt-5 flex items-end justify-between gap-3">
        <dt className="text-sm font-semibold text-slate-900">
          Total add-ons
          <span className="mt-1 block text-[11px] font-normal text-slate-500">For all passengers</span>
        </dt>
        <dd className="text-3xl font-semibold tracking-tight text-teal-900">{formatPrice(seatTotal)}</dd>
      </div>
    </dl>
  )
}
