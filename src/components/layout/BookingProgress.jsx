import { Check } from 'lucide-react'

const steps = ['Your flight', 'Choose seats', 'Seat summary']

export default function BookingProgress({ isComplete }) {
  const currentStep = isComplete ? 2 : 1

  return (
    <nav aria-label="Booking progress" className="py-7 sm:py-8">
      <ol className="grid grid-cols-3 items-center gap-2 sm:flex sm:gap-6">
        {steps.map((step, index) => (
          <li key={step} aria-current={index === currentStep ? 'step' : undefined} className="flex min-w-0 items-center gap-1 min-[400px]:gap-1.5 sm:gap-2.5">
            {index > 0 && <span aria-hidden="true" className="mr-1 hidden h-px w-9 shrink-0 bg-slate-300 sm:block" />}
            <span className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold min-[400px]:size-6 min-[400px]:text-xs ${index === currentStep ? 'bg-teal-800 text-white' : index < currentStep ? 'bg-teal-100 text-teal-800' : 'border border-slate-300 text-slate-500'}`}>
              {index < currentStep ? <Check size={13} aria-label="Complete" /> : index + 1}
            </span>
            <span className={`whitespace-nowrap text-[10px] min-[400px]:text-xs sm:text-sm ${index === currentStep ? 'font-semibold text-teal-900' : 'text-slate-600'}`}>{step}</span>
          </li>
        ))}
      </ol>
    </nav>
  )
}
