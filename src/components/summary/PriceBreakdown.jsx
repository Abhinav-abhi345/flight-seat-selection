import { formatPrice } from '../../utils/priceCalculator'

function PricingLines({ items }) {
  return items.map((item) => (
    <div key={item.id} className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-600">
      <dt>
        {item.label}
        <span className="mt-1 block text-[11px] text-slate-500">{item.quantity} × {formatPrice(item.unitPrice)}{item.unitPrice === 0 && ' · Free'}</span>
      </dt>
      <dd className="shrink-0 tabular-nums text-slate-700">{formatPrice(item.subtotal)}</dd>
    </div>
  ))
}

export default function PriceBreakdown({ pricing }) {
  return (
    <section aria-labelledby="price-heading" className="border-t border-slate-200 pt-4">
      <h3 id="price-heading" className="eyebrow">PRICE BREAKDOWN</h3>
      {pricing.lineItems.length === 0 && pricing.mealLineItems.length === 0 && <p className="mt-3 text-xs leading-5 text-slate-500">No add-ons selected yet.</p>}
      <dl>
        <div className="mt-4 flex items-center justify-between gap-3 text-sm font-medium text-slate-800">
          <dt>Seat charges</dt><dd className="tabular-nums">{formatPrice(pricing.seatTotal)}</dd>
        </div>
        <PricingLines items={pricing.lineItems} />
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm font-medium text-slate-800">
          <dt>Meal charges <span className="text-[11px] font-normal text-slate-500">· Optional</span></dt>
          <dd className="tabular-nums">{formatPrice(pricing.mealTotal)}</dd>
        </div>
        <PricingLines items={pricing.mealLineItems} />
        <div className="mt-5 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
          <dt className="text-sm font-semibold text-slate-900">
            Total add-ons
            <span className="mt-1 block text-[11px] font-normal text-slate-500">For all passengers · INR</span>
          </dt>
          <dd className="text-3xl font-semibold tracking-tight text-teal-900">
            <output aria-label="Total seat and meal charges" aria-live="polite" aria-atomic="true">{formatPrice(pricing.grandTotal)}</output>
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-[11px] leading-5 text-slate-500">Seats and optional meals only. Airfare is not included.</p>
    </section>
  )
}
