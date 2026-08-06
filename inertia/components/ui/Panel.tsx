import { Dialog } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { type ReactNode } from 'react'

interface IPanel {
  title: string
  isOpen: boolean
  close: () => void
  onClosed: () => void
  children: ReactNode
  footer?: ReactNode
  footerSpaceClass?:
    | 'justify-start'
    | 'justify-end'
    | 'justify-center'
    | 'justify-between'
}

const MotionDialogPanel = motion(Dialog.Panel)

export function Panel(props: IPanel) {
  return (
    <AnimatePresence onExitComplete={props.onClosed}>
      {props.isOpen && (
        <Dialog
          static
          as="div"
          className="relative z-50"
          open={props.isOpen}
          onClose={props.close}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 backdrop-blur"
            aria-hidden
            onClick={props.close}
          />

          <MotionDialogPanel
            className="fixed inset-y-0 right-0 w-[85%] sm:max-w-md"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              bounce: 0.3,
              duration: 0.4,
            }}
          >
            <div className="h-full py-2 sm:py-4">
              <div className="flex h-full flex-col overflow-y-scroll rounded-bl-lg rounded-tl-lg bg-white shadow-2xl">
                <header className="sticky top-0 rounded-tl-lg bg-slate-700 px-4 py-2 text-white sm:px-6 sm:py-4">
                  <Dialog.Title className="text-2xl font-bold sm:text-3xl">
                    {props.title}
                  </Dialog.Title>
                </header>
                <div className="flex h-full flex-col px-4 sm:px-6">
                  <div className="flex-1 py-4 sm:py-6">{props.children}</div>
                  {props.footer && (
                    <div
                      className={`sticky bottom-0 flex gap-4 border-t border-slate-700 bg-white py-4 sm:gap-6 sm:py-6 ${
                        props.footerSpaceClass ? props.footerSpaceClass : ''
                      }`}
                    >
                      {props.footer}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </MotionDialogPanel>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
