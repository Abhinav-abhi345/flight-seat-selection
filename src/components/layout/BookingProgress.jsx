import { Check } from 'lucide-react'

const steps = ['Your flight', 'Choose seats', 'Seat summary']

export default function BookingProgress({ isComplete }) {
  const currentStep = isComplete ? 2 : 1

  return (
    <nav aria-label="Booking progress" className="py-7 sm:py-8">
      <ol className="flex flex-wrap items-center gap-x-4 gap-y-3 sm:gap-x-6">
        {steps.map((step, index) => (
          <li key={step} aria-current={index === currentStep ? 'step' : undefined} className="flex items-center gap-2.5">
            {index > 0 && <span aria-hidden="true" className="mr-1 h-px w-4 bg-slate-300 sm:w-9" />}
            <span className={`flex size-6 items-center justify-center rounded-full text-xs font-semibold ${index === currentStep ? 'bg-teal-800 text-white' : index < currentStep ? 'bg-teal-100 text-teal-800' : 'border border-slate-300 text-slate-500'}`}>
              {index < currentStep ? <Check size={13} aria-label="Complete" /> : index + 1}
            </span>
            <span className={`text-xs sm:text-sm ${index === currentStep ? 'font-semibold text-teal-900' : 'text-slate-600'}`}>{step}</span>
          </li>
        ))}
      </ol>
    </nav>
  )
}
