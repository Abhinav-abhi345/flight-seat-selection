import { formatPrice } from '../../utils/priceCalculator'

export default function PriceBreakdown({ pricing }) {
  return (
    <section aria-labelledby="price-heading" className="border-t border-slate-200 pt-4">
      <h3 id="price-heading" className="eyebrow">PRICE BREAKDOWN</h3>
      {pricing.lineItems.length === 0 && <p className="mt-3 text-xs leading-5 text-slate-500">No seat charges yet.</p>}
      <dl>
        {pricing.lineItems.map((item) => (
          <div key={item.id} className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-600">
            <dt>
              {item.label}
              <span className="mt-1 block text-xs text-slate-500">{item.quantity} × {formatPrice(item.unitPrice)}{item.unitPrice === 0 && ' · Free'}</span>
            </dt>
            <dd className="shrink-0 font-medium tabular-nums text-slate-800">{formatPrice(item.subtotal)}</dd>
          </div>
        ))}
        <div className="mt-5 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
          <dt className="text-sm font-semibold text-slate-900">
            Total seat charges
            <span className="mt-1 block text-[11px] font-normal text-slate-500">For all passengers · INR</span>
          </dt>
          <dd className="text-3xl font-semibold tracking-tight text-teal-900">
            <output aria-label="Total seat charges" aria-live="polite" aria-atomic="true">{formatPrice(pricing.seatTotal)}</output>
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-[11px] leading-5 text-slate-500">Seat charges only. Airfare is not included.</p>
    </section>
  )
}
