import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown, Users } from 'lucide-react'
import { passengerLimits } from '../../data/passengers'

export default function PassengerCountSelect({ value, onChange }) {
  const id = useId()
  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const optionRefs = useRef({})
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedCount, setHighlightedCount] = useState(value)
  const counts = Array.from({ length: passengerLimits.max - passengerLimits.min + 1 }, (_, index) => index + passengerLimits.min)

  useEffect(() => {
    if (!isOpen) return

    function handleOutsidePress(event) {
      if (!containerRef.current?.contains(event.target)) setIsOpen(false)
    }

    document.addEventListener('pointerdown', handleOutsidePress)
    return () => document.removeEventListener('pointerdown', handleOutsidePress)
  }, [isOpen])

  useEffect(() => {
    if (isOpen) optionRefs.current[highlightedCount]?.scrollIntoView({ block: 'nearest' })
  }, [isOpen, highlightedCount])

  function chooseCount(count) {
    onChange(count)
    setIsOpen(false)
    triggerRef.current?.focus({ preventScroll: true })
  }

  function handleKeyDown(event) {
    const { key } = event

    if (key === 'Tab' || key === 'Escape') {
      if (key === 'Escape' && isOpen) event.preventDefault()
      setIsOpen(false)
      return
    }

    if (key === 'Enter' || key === ' ') {
      event.preventDefault()
      if (isOpen) chooseCount(highlightedCount)
      else {
        setHighlightedCount(value)
        setIsOpen(true)
      }
      return
    }

    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key) || /^[1-9]$/.test(key)) {
      event.preventDefault()
      let next = isOpen ? highlightedCount : value
      if (key === 'ArrowDown' && isOpen) next += 1
      if (key === 'ArrowUp' && isOpen) next -= 1
      if (key === 'Home') next = passengerLimits.min
      if (key === 'End') next = passengerLimits.max
      if (/^[1-9]$/.test(key)) next = Number(key)
      setHighlightedCount(Math.max(passengerLimits.min, Math.min(passengerLimits.max, next)))
      setIsOpen(true)
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onBlur={(event) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setIsOpen(false)
      }}
    >
      <label id={`${id}-label`} htmlFor={`${id}-trigger`} className="block text-xs font-medium text-slate-600">Number of passengers</label>
      <button
        id={`${id}-trigger`}
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? `${id}-options` : undefined}
        aria-activedescendant={isOpen ? `${id}-option-${highlightedCount}` : undefined}
        aria-labelledby={`${id}-label ${id}-value`}
        aria-describedby={`${id}-hint`}
        onKeyDown={handleKeyDown}
        onClick={() => {
          setHighlightedCount(value)
          setIsOpen(!isOpen)
        }}
        className={`mt-2 flex min-h-14 w-full cursor-pointer items-center gap-2 rounded-xl border px-2 py-3 text-left text-sm font-semibold text-teal-950 shadow-sm hover:border-teal-500 ${isOpen ? 'border-teal-700 bg-white ring-2 ring-teal-700/10' : 'border-teal-200 bg-teal-50/60'}`}
      >
        <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${isOpen ? 'bg-teal-800 text-white' : 'bg-teal-100 text-teal-800'}`} aria-hidden="true"><Users size={16} /></span>
        <span id={`${id}-value`} className="whitespace-nowrap">{value} passenger{value === 1 ? '' : 's'}</span>
        <ChevronDown size={17} aria-hidden="true" className={`ml-auto shrink-0 text-teal-700 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 left-0 z-30 mt-2 overflow-hidden rounded-2xl border border-teal-100 bg-white p-1 shadow-[0_12px_32px_-8px_rgba(15,55,50,0.22)]">
          <div aria-hidden="true" className="flex items-center justify-between px-2 pt-2 pb-2.5 text-[10px] font-semibold tracking-wider text-slate-500">
            <span>TRAVELLERS</span><span>{passengerLimits.min}–{passengerLimits.max}</span>
          </div>
          <ul id={`${id}-options`} role="listbox" aria-labelledby={`${id}-label`} className="max-h-72 space-y-1 overflow-y-auto overscroll-contain p-0.5">
            {counts.map((count) => (
              <li
                key={count}
                id={`${id}-option-${count}`}
                ref={(element) => { optionRefs.current[count] = element }}
                role="option"
                aria-selected={count === value}
                onPointerMove={(event) => {
                  if (event.pointerType === 'mouse') setHighlightedCount(count)
                }}
                onPointerDown={(event) => {
                  if (event.pointerType === 'mouse') event.preventDefault()
                }}
                onClick={() => chooseCount(count)}
                className={`flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl px-1.5 py-2.5 text-xs ${count === highlightedCount ? 'bg-teal-50 ring-1 ring-teal-200 ring-inset' : count === value ? 'bg-teal-50/50' : 'bg-white'} ${count === value ? 'font-semibold text-teal-900' : 'text-slate-600'}`}
              >
                <span aria-hidden="true" className={`flex size-6 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${count === value ? 'bg-teal-800 text-white' : 'bg-slate-100 text-slate-500'}`}>{count}</span>
                <span className="whitespace-nowrap">{count} passenger{count === 1 ? '' : 's'}</span>
                {count === value && <Check size={14} aria-hidden="true" className="ml-auto shrink-0 text-teal-700" />}
              </li>
            ))}
          </ul>
        </div>
      )}
      <p id={`${id}-hint`} className="mt-2 text-[11px] leading-5 text-slate-500">
        Reducing the count removes the last passengers and their selections.
      </p>
    </div>
  )
}
