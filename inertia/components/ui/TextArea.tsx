import { type TextareaHTMLAttributes, useEffect, useId, useState } from 'react'

interface ITextArea extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  name: string
  error?: string
  largerLabel?: boolean
}

export function TextArea(props: ITextArea) {
  const id = useId()
  const [error, setError] = useState<string | undefined>(props.error)

  useEffect(() => {
    setError(props.error)
  }, [props.error])

  const { largerLabel, error: _error, ...rest } = props

  return (
    <div>
      <label
        htmlFor={id}
        className={`block font-semibold text-slate-700 ${
          props.largerLabel ? 'text-base' : 'text-sm'
        }`}
      >
        {props.label}
      </label>
      <div className="mt-1">
        <textarea
          {...rest}
          id={id}
          rows={props.rows ? props.rows : 5}
          name={props.name}
          className={`block w-full rounded-lg border-slate-400 text-sm text-slate-700 focus:border-slate-700 focus:ring-slate-700 ${
            error ? 'border-red-400 bg-red-100 focus:border-red-700 focus:ring-red-700' : ''
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
