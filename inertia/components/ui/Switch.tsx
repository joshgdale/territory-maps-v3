import { Switch as HUISwitch } from '@headlessui/react'
import { useEffect, useId, useState } from 'react'

interface ISwitch {
  label: string
  name: string
  required?: boolean
  checked?: boolean
  defaultValue?: boolean
  error?: string
  onChange?: (value: boolean) => void
}

export function Switch(props: ISwitch) {
  const isControlled = props.checked !== undefined
  const [enabled, setEnabled] = useState(props.defaultValue ?? false)
  const id = useId()
  const [error, setError] = useState<string | undefined>(props.error)
  const value = isControlled ? Boolean(props.checked) : enabled

  useEffect(() => {
    setError(props.error)
  }, [props.error])

  function handleChange(next: boolean) {
    if (!isControlled) setEnabled(next)
    props.onChange?.(next)
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-6">
        <label htmlFor={id} className="text-sm font-semibold text-slate-900">
          {props.label}
          {props.required && <span className="ml-1 text-red-400">*</span>}
        </label>
        <HUISwitch
          checked={value}
          onChange={handleChange}
          name={props.name}
          value="true"
          id={id}
          className={`${value ? 'bg-green-600' : 'bg-slate-300'}
        relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span className="sr-only">{props.label}</span>
          <span
            aria-hidden="true"
            className={`${value ? 'translate-x-5' : 'translate-x-0'}
          pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </HUISwitch>
      </div>
      {error && (
        <div className="mt-1 text-sm text-red-700" id={`${id}-error`}>
          {error}
        </div>
      )}
    </div>
  )
}
