import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Spinner } from './Spinner'

interface IButton
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof styles> {
  loading?: boolean
}

const styles = cva(
  'inline-flex items-center justify-center rounded-lg text-sm relative sm:text-base font-semibold transition-colors py-1.5',
  {
    variants: {
      intent: {
        primary:
          'bg-slate-700 enabled:hover:bg-slate-600 text-white disabled:cursor-not-allowed disabled:bg-slate-500',
        secondary:
          'bg-slate-300 enabled:hover:bg-slate-200 text-slate-800 disabled:cursor-not-allowed disabled:bg-slate-100',
        success:
          'bg-green-700 enabled:hover:bg-green-600 text-white disabled:cursor-not-allowed disabled:bg-green-500',
        danger:
          'bg-red-700 enabled:hover:bg-red-600 text-white disabled:cursor-not-allowed disabled:bg-red-500',
        outline:
          'border-slate-700 border bg-white enabled:hover:bg-slate-700 enabled:hover:text-white disabled:cursor-not-allowed disabled:bg-slate-50',
      },
      hasIcon: {
        true: 'pl-3 pr-4',
      },
      iconOnly: {
        true: 'px-2',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    compoundVariants: [
      {
        hasIcon: false,
        iconOnly: false,
        className: 'px-4',
      },
    ],
    defaultVariants: {
      intent: 'primary',
      hasIcon: false,
      iconOnly: false,
    },
  }
)

export const Button = forwardRef<HTMLButtonElement, IButton>(function Button(
  { intent, hasIcon, iconOnly, fullWidth, className, loading, disabled, children, type = 'button', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={styles({
        intent,
        hasIcon,
        iconOnly,
        fullWidth,
        className,
      })}
      disabled={loading || disabled}
      {...props}
    >
      {children}
      {loading ? (
        <div
          className={`absolute inset-0 flex items-center justify-center rounded-lg p-1.5 ${
            intent == 'success'
              ? 'bg-green-700'
              : intent == 'danger'
                ? 'bg-red-700'
                : intent == 'secondary'
                  ? 'bg-slate-300'
                  : 'bg-slate-700'
          }`}
        >
          <Spinner />
        </div>
      ) : null}
    </button>
  )
})
