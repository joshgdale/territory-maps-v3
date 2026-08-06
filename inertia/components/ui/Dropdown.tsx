import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Link as InertiaLink } from '@inertiajs/react'
import { type ElementType, Fragment, type ReactNode } from 'react'
import { Button } from './Button'

interface IDropdown {
  title?: string
  icon?: ElementType
  children?: ReactNode
}

export function Dropdown(props: IDropdown) {
  const Icon = props.icon ? props.icon : ChevronDownIcon
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          as={Button}
          type="button"
          className={`px-2 ${props.title ? 'sm:pl-3 sm:pr-4' : ''}`}
        >
          <Icon className={`h-5 w-5 ${props.title ? 'sm:mr-2' : ''}`} aria-hidden />
          <span className="hidden sm:block">{props.title}</span>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md border border-slate-700 bg-white p-1 shadow-lg focus:outline-none">
          {props.children}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

Dropdown.Item = DropdownItem

interface IDropdownItem {
  children: ReactNode
  onClick?: () => void
  href?: string
  newTab?: boolean
  to?: string
}

function DropdownItem(props: IDropdownItem) {
  const itemClass = (active: boolean) =>
    `${active ? 'bg-green-500/50' : 'text-slate-900 hover:bg-green-500/50'} flex w-full items-center rounded-md px-2 py-2 text-sm`

  return (
    <Menu.Item>
      {({ active }) => {
        if (props.href) {
          return (
            <a
              href={props.href}
              target={props.newTab ? '_blank' : '_self'}
              rel={props.newTab ? 'noreferrer' : undefined}
              className={itemClass(active)}
            >
              {props.children}
            </a>
          )
        }

        if (props.to) {
          return (
            <InertiaLink preserveScroll href={props.to} className={itemClass(active)}>
              {props.children}
            </InertiaLink>
          )
        }

        return (
          <button type="button" onClick={props.onClick} className={itemClass(active)}>
            {props.children}
          </button>
        )
      }}
    </Menu.Item>
  )
}
