import { Listbox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { AnimatePresence, motion } from 'framer-motion'
import { type ReactNode, useEffect, useId, useState } from 'react'

export interface ISelectOption {
  value?: string
  option: string
}

interface ISelect {
  label?: string
  name: string
  options: ISelectOption[] | undefined
  emptyOptionsMessage?: string
  defaultOption?: string
  value?: string
  required?: boolean
  error?: string
  children?: ({
    selected,
    option,
  }: {
    selected?: boolean
    option: ISelectOption
  }) => {
    button: ReactNode
    option: ReactNode
  }
  onChange?: (option: ISelectOption | undefined) => void
}

export function Select(props: ISelect) {
  const id = useId()
  const [selected, setSelected] = useState<ISelectOption>()
  const [options, setOptions] = useState<ISelectOption[]>(props.options || [])
  const [error, setError] = useState<string | undefined>(props.error)

  useEffect(() => {
    setError(props.error)
  }, [props.error])

  useEffect(() => {
    if (!props.options || props.options.length === 0) return
    setOptions((current) => {
      if (
        current.length === props.options!.length &&
        current.every(
          (option, index) =>
            option.value === props.options![index].value &&
            option.option === props.options![index].option
        )
      ) {
        return current
      }
      return props.options!
    })
  }, [props.options])

  useEffect(() => {
    const initial = props.value ?? props.defaultOption
    if (!initial || options.length === 0) return
    setSelected((current) => {
      const next = options.find((op) => (op.value ? op.value === initial : op.option === initial))
      if (current?.value === next?.value && current?.option === next?.option) return current
      return next
    })
  }, [props.value, props.defaultOption, options])

  function handleChange(value: string) {
    const next = options.find((op) => (op.value ? op.value === value : op.option === value))
    setSelected(next)
    props.onChange?.(next)
    if (error) setError(undefined)
  }

  return (
    <Listbox
      name={props.name}
      value={selected?.value ?? selected?.option ?? ''}
      onChange={handleChange}
    >
      {({ open }) => (
        <div>
          {props.label && (
            <Listbox.Label className="block text-sm font-semibold text-slate-900">
              {props.label}
              {props.required && <span className="ml-1 text-sm text-red-500">*</span>}
            </Listbox.Label>
          )}
          <div className={`relative ${props.label ? 'mt-1' : ''}`}>
            <Listbox.Button
              className={`relative w-full cursor-default rounded-lg border py-2 pl-3 pr-10 text-left text-sm text-slate-700 focus:outline-none focus:ring-1 ${
                error
                  ? 'border-red-400 bg-red-100 focus:border-red-700 focus:ring-red-700'
                  : 'border-slate-300 bg-white focus:border-slate-700 focus:ring-slate-700'
              }`}
            >
              <span className="block min-h-[20px] truncate">
                {selected && selected.option
                  ? props.children
                    ? props.children({ option: selected }).button
                    : selected.option
                  : null}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-slate-700" aria-hidden="true" />
              </span>
            </Listbox.Button>
            {error && (
              <div className="pt-1 text-sm text-red-700" id={`${id}-error`}>
                {error}
              </div>
            )}
            <AnimatePresence>
              {open && (
                <motion.div
                  className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-700 bg-white py-1 text-sm shadow-lg focus:outline-none"
                  initial={{ y: '25%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '25%', opacity: 0 }}
                  transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
                >
                  <Listbox.Options static className="list-none">
                    {options.length === 0 && props.emptyOptionsMessage && (
                      <p className="p-2 text-center">{props.emptyOptionsMessage}</p>
                    )}
                    {options.map((option, i) => (
                      <Listbox.Option
                        key={i}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 text-slate-900 transition-colors ${
                            active ? 'bg-green-500/50' : ''
                          }`
                        }
                        value={option.value ? option.value : option.option}
                      >
                        {({ selected: isSelected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                isSelected ? 'font-semibold' : 'font-normal'
                              }`}
                            >
                              {props.children
                                ? props.children({ selected: isSelected, option }).option
                                : option.option}
                            </span>
                            {isSelected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-700">
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </Listbox>
  )
}
