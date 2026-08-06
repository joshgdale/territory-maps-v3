import { client } from '~/client'
import { type ComponentType, type ReactNode } from 'react'
import ReactDOMServer from 'react-dom/server'
import { createInertiaApp } from '@inertiajs/react'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

type PageComponent = ComponentType & {
  layout?: (page: ReactNode) => ReactNode
}

export default function render(page: Parameters<typeof createInertiaApp>[0]['page']) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: async (name) => {
      const module = (await resolvePageComponent(
        `./pages/${name}.tsx`,
        import.meta.glob('./pages/**/*.tsx', { eager: true })
      )) as { default: PageComponent }
      module.default.layout ??= (node) => node
      return module
    },
    setup: ({ App, props }) => (
      <TuyauProvider client={client}>
        <App {...props} />
      </TuyauProvider>
    ),
  })
}
