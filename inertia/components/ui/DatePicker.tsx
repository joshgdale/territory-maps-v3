import { Popover } from '@headlessui/react'
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid'
import clsx from 'clsx'
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useId, useRef, useState } from 'react'

interface IDatePicker {
  label: string
  name: string
  required?: boolean
  error?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
}

export function DatePicker(props: IDatePicker) {
  const id = useId()
  const [error, setError] = useState<string | undefined>(props.error)
  const hiddenInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setError(props.error)
  }, [props.error])

  const today = startOfToday()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
  const firstDayOfCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayOfCurrentMonth, { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(firstDayOfCurrentMonth), { weekStartsOn: 1 }),
  })

  function nextMonth() {
    const firstDayOfNextMonth = add(firstDayOfCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayOfNextMonth, 'MMM-yyyy'))
  }

  function previousMonth() {
    const firstDayOfPreviousMonth = add(firstDayOfCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayOfPreviousMonth, 'MMM-yyyy'))
  }

  useEffect(() => {
    const initial = props.value ?? props.defaultValue
    if (!initial) return
    const date = new Date(initial)
    if (Number.isNaN(date.getTime())) return
    setSelectedDate(date)
    setCurrentMonth(format(startOfMonth(date), 'MMM-yyyy'))
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = format(date, 'yyyy-MM-dd')
    }
  }, [])

  useEffect(() => {
    if (props.value === undefined) return
    if (!props.value) {
      setSelectedDate(null)
      if (hiddenInputRef.current) hiddenInputRef.current.value = ''
      return
    }
    const date = new Date(props.value)
    if (Number.isNaN(date.getTime())) return
    setSelectedDate(date)
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = format(date, 'yyyy-MM-dd')
    }
  }, [props.value])

  function selectDate(date: Date, close?: () => void) {
    setSelectedDate(date)
    setError(undefined)
    const formatted = format(date, 'yyyy-MM-dd')
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = formatted
    }
    props.onChange?.(formatted)
    close?.()
  }

  function clearDate(close?: () => void) {
    setSelectedDate(null)
    setError(undefined)
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = ''
    }
    props.onChange?.('')
    close?.()
  }

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
            {props.label}
            {props.required && <span className="ml-1 text-sm text-red-500">*</span>}
          </label>
          <div className="mt-1">
            <Popover.Button
              id={id}
              className={`relative w-full cursor-default rounded-lg border py-2 pl-3 pr-10 text-left text-sm text-slate-700 focus:outline-none focus:ring-1 ${
                error
                  ? 'border-red-400 bg-red-100 focus:border-red-700 focus:ring-red-700'
                  : 'border-slate-400 bg-white focus:border-slate-700 focus:ring-slate-700'
              }`}
            >
              <span className="block min-h-[20px] truncate">
                {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <CalendarDaysIcon className="h-5 w-5 text-slate-700" aria-hidden="true" />
              </span>
            </Popover.Button>
            {error && (
              <div className="pt-1 text-sm text-red-700" id={`${id}-error`}>
                {error}
              </div>
            )}
          </div>
          <AnimatePresence>
            {open && (
              <Popover.Panel
                static
                className="absolute z-50 mt-1 w-full overflow-auto rounded-lg border border-slate-700 bg-white text-sm shadow-lg focus:outline-none"
                as={motion.div}
                initial={{ y: '25%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '25%', opacity: 0 }}
                transition={{
                  type: 'spring',
                  bounce: 0.3,
                  duration: 0.4,
                }}
              >
                <div className="mt-2 text-center sm:mt-4 lg:col-start-8 lg:col-end-13 lg:row-start-1 xl:col-start-9">
                  <div className="flex items-center px-6">
                    <button
                      onClick={previousMonth}
                      type="button"
                      className="flex items-center justify-center rounded-lg p-1.5 transition-colors hover:bg-slate-100"
                    >
                      <span className="sr-only">Previous month</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <div className="flex-auto font-semibold">
                      {format(firstDayOfCurrentMonth, 'MMMM yyyy')}
                    </div>
                    <button
                      onClick={nextMonth}
                      type="button"
                      className="flex items-center justify-center rounded-lg p-1.5 transition-colors hover:bg-slate-100"
                    >
                      <span className="sr-only">Next month</span>
                      <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-2 grid grid-cols-7 text-xs leading-6 text-slate-500 sm:mt-4">
                    <div>M</div>
                    <div>T</div>
                    <div>W</div>
                    <div>T</div>
                    <div>F</div>
                    <div>S</div>
                    <div>S</div>
                  </div>
                  <div className="isolate mt-2 grid w-full grid-cols-7 gap-px bg-slate-200 text-sm ring-1 ring-slate-200">
                    {days.map((day, i) => {
                      const dayIsToday = isToday(day)
                      const sameMonth = isSameMonth(day, firstDayOfCurrentMonth)
                      const selected = selectedDate && isEqual(day, selectedDate)

                      return (
                        <button
                          onClick={() => selectDate(day, close)}
                          key={i}
                          type="button"
                          className={clsx(
                            'py-1.5 hover:bg-green-500/50 focus:z-10',
                            dayIsToday && selected && 'font-bold text-white',
                            dayIsToday && !selected && 'font-bold text-red-700',
                            selected && !dayIsToday && 'font-bold text-white',
                            !dayIsToday && !selected && sameMonth && 'text-slate-900',
                            !dayIsToday && !selected && !sameMonth && 'text-slate-400',
                            sameMonth && 'bg-white',
                            !sameMonth && 'bg-slate-100'
                          )}
                        >
                          <time
                            dateTime={format(day, 'yyyy-MM-dd')}
                            className={clsx(
                              'mx-auto flex h-7 w-7 items-center justify-center rounded-full',
                              selected && 'bg-green-700'
                            )}
                          >
                            {format(day, 'd')}
                          </time>
                        </button>
                      )
                    })}
                  </div>
                  <div className="grid grid-cols-7 gap-px bg-slate-200">
                    <button
                      onClick={() => selectDate(startOfToday(), close)}
                      type="button"
                      className="col-span-2 flex bg-white px-6 py-2 transition-colors hover:bg-slate-200"
                    >
                      <CalendarDaysIcon className="mr-2 h-5 w-5" aria-hidden />
                      <span>Today</span>
                    </button>
                    <div className="col-span-3 bg-white"></div>
                    <button
                      onClick={() => clearDate(close)}
                      type="button"
                      className="col-span-2 flex items-center justify-center bg-white px-6 py-2 transition-colors hover:bg-slate-200"
                    >
                      <XMarkIcon className="mr-2 h-5 w-5" aria-hidden />
                      <span>Clear</span>
                    </button>
                  </div>
                </div>
              </Popover.Panel>
            )}
          </AnimatePresence>
          <input type="hidden" hidden readOnly name={props.name} ref={hiddenInputRef} />
        </>
      )}
    </Popover>
  )
}
