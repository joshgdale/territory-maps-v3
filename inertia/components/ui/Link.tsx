import { Link as InertiaLink } from '@inertiajs/react'
import { cva, type VariantProps } from 'class-variance-authority'
import { type ComponentProps, type ReactNode } from 'react'

interface ILink
  extends Omit<ComponentProps<typeof InertiaLink>, 'className'>,
    VariantProps<typeof styles> {
  children: ReactNode
  className?: string
}

const styles = cva(
  'inline-flex items-center rounded-lg py-1.5 text-sm font-semibold text-white transition-colors sm:text-base',
  {
    variants: {
      intent: {
        primary: 'bg-slate-700 hover:bg-slate-600 text-white',
        success: 'bg-green-700 hover:bg-green-600 text-white',
        danger: 'bg-red-700 hover:bg-red-600 text-white',
      },
      hasIcon: {
        true: 'pl-3 pr-4',
      },
      iconOnly: {
        true: 'px-2',
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

export function Link({ intent, hasIcon, iconOnly, className, ...props }: ILink) {
  return (
    <InertiaLink
      {...props}
      className={`${styles({ intent, hasIcon, iconOnly })} ${className ?? ''}`}
    >
      {props.children}
    </InertiaLink>
  )
}
