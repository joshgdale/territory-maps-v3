import { type ReactNode } from 'react'

export interface ICard {
  heading?: string
  renderHeadingRight?: ReactNode
  noContentPadding?: boolean
  children?: ReactNode
  className?: string
  externalHeading?: true
}

export function Card(props: ICard) {
  return (
    <div
      id={
        props.heading ? props.heading.toLocaleLowerCase().replace(' ', '_') : ''
      }
      className="scroll-mt-[92px]"
    >
      {props.externalHeading && props.heading && (
        <div
          className={`mb-2 flex items-center justify-between px-4 sm:mb-4 sm:px-6 ${
            props.noContentPadding ? 'p-4 sm:p-6' : ''
          }`}
        >
          <h2 className="text-lg font-bold text-slate-800 sm:text-xl">{props.heading}</h2>
          {props.renderHeadingRight && props.renderHeadingRight}
        </div>
      )}
      <div
        className={`rounded-lg bg-white shadow-md ${
          props.className ? props.className : ''
        } ${!props.noContentPadding ? 'p-4 sm:p-6' : ''}`}
      >
        {!props.externalHeading && props.heading && (
          <div
            className={`mb-2 flex items-center justify-between sm:mb-4 ${
              props.noContentPadding ? 'p-4 sm:p-6' : ''
            }`}
          >
            <h2 className="text-lg font-bold text-slate-800 sm:text-xl">{props.heading}</h2>
            {props.renderHeadingRight && props.renderHeadingRight}
          </div>
        )}
        {props.children}
      </div>
    </div>
  )
}
