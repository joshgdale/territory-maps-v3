import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useEffect, useId, useRef, useState } from 'react'
import { type ISelectOption } from './Select'

interface IMultiSelect {
  label?: string
  name: string
  options: ISelectOption[] | undefined
  emptyOptionsMessage?: string
  defaultOptions?: string
  required?: boolean
  error?: string
  onChange?: (options: ISelectOption[] | undefined) => void
}

export function MultiSelect(props: IMultiSelect) {
  const id = useId()
  const hiddenInputRef = useRef<HTMLInputElement>(null)
  const [selected, setSelected] = useState<ISelectOption[]>([])
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
    if (!props.defaultOptions || options.length === 0) {
      setSelected((current) => (current.length === 0 ? current : []))
      return
    }

    const defaultOptionValues = props.defaultOptions.split(',')
    const defaultSelected = defaultOptionValues
      .map((value) =>
        options.find((opt) => (opt.value ? opt.value === value : opt.option === value))
      )
      .filter((option): option is ISelectOption => Boolean(option))

    setSelected((current) => {
      if (
        current.length === defaultSelected.length &&
        current.every((option, index) => option.value === defaultSelected[index]?.value)
      ) {
        return current
      }
      updateHiddenInput(defaultSelected)
      return defaultSelected
    })
  }, [props.defaultOptions, options])

  function handleChange(values: ISelectOption[]) {
    setSelected(values)
    updateHiddenInput(values)
    if (error) setError(undefined)
    props.onChange?.(values)
  }

  function updateHiddenInput(values: ISelectOption[]) {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = values
        .map((value) => (value.value ? value.value : value.option))
        .toString()
    }
  }

  return (
    <Listbox value={selected} onChange={handleChange} multiple by="value">
      <div>
        {props.label && (
          <Listbox.Label className="block text-sm font-semibold text-slate-900">
            {props.label}
            {props.required && <span className="ml-1 text-red-400">*</span>}
          </Listbox.Label>
        )}
        <div className={`relative ${props.label ? 'mt-1' : ''}`}>
          <ListboxButton
            className={`relative w-full cursor-default rounded-lg border py-2 pl-3 pr-10 text-left text-sm text-slate-700 focus:outline-none focus-visible:ring-1 ${
              error
                ? 'border-red-400 bg-white focus-visible:border-red-700 focus-visible:ring-red-700'
                : 'border-slate-300 bg-white focus-visible:border-slate-700 focus-visible:ring-slate-700'
            }`}
          >
            <span className="block min-h-[20px] truncate">
              {selected.map((option) => option.option).join(', ')}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-slate-700" aria-hidden="true" />
            </span>
          </ListboxButton>
          {error && (
            <div className="pt-1 text-sm text-red-700" id={`${id}-error`}>
              {error}
            </div>
          )}

          <ListboxOptions
            anchor={{ to: 'bottom start', gap: 4 }}
            portal
            className="z-50 max-h-60 w-max min-w-[var(--button-width)] overflow-auto rounded-lg border border-slate-700 bg-white py-1 text-sm shadow-lg focus:outline-none"
          >
            {options.length === 0 && props.emptyOptionsMessage && (
              <p className="p-2 text-center">{props.emptyOptionsMessage}</p>
            )}
            {options.map((option, i) => (
              <ListboxOption
                key={i}
                className="relative cursor-default select-none whitespace-nowrap py-2 pl-10 pr-4 text-slate-900 transition-colors data-focus:bg-green-500/50"
                value={option}
              >
                {({ selected: isSelected }) => (
                  <>
                    <span className={`block ${isSelected ? 'font-semibold' : 'font-normal'}`}>
                      {option.option}
                    </span>
                    {isSelected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-700">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </div>
      <input type="hidden" hidden readOnly name={props.name} ref={hiddenInputRef} />
    </Listbox>
  )
}
