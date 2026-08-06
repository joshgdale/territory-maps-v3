import { type InputHTMLAttributes, useEffect, useId, useState } from 'react'

interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
  error?: string
  largerLabel?: boolean
  className?: string
}

export function Input(props: IInput) {
  const id = useId()
  const [error, setError] = useState<string | undefined>(props.error)

  useEffect(() => {
    setError(props.error)
  }, [props.error])

  const { largerLabel, error: _error, ...rest } = props

  return (
    <div className={props.className ? props.className : ''}>
      <label
        htmlFor={id}
        className={`block font-semibold text-slate-700 ${
          props.largerLabel ? 'text-base' : 'text-sm'
        }`}
      >
        {props.label}
        {props.required && <span className="ml-1 text-sm text-red-500">*</span>}
      </label>
      <div className="mt-1">
        <input
          {...rest}
          id={id}
          type={props.type ? props.type : 'text'}
          name={props.name}
          required={false}
          className={`block w-full rounded-lg text-sm text-slate-700 ${
            error
              ? 'border-red-400 bg-red-100 focus:border-red-700 focus:ring-red-700'
              : 'border-slate-400 bg-white focus:border-slate-700 focus:ring-slate-700'
          }`}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-error`}
          onChange={(e) => {
            error && setError(undefined)
            props.onChange && props.onChange(e)
          }}
        />
        {error && (
          <div className="pt-1 text-sm text-red-700" id={`${id}-error`}>
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
