import './css/app.css'
import { type ComponentType, type ReactNode } from 'react'
import { client } from './client'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

type PageComponent = ComponentType & {
  layout?: (page: ReactNode) => ReactNode
}

const appName = import.meta.env.VITE_APP_NAME || 'Territory Maps'

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: async (name) => {
    const module = (await resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob('./pages/**/*.tsx')
    )) as { default: PageComponent }
    module.default.layout ??= (node) => node
    return module
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <TuyauProvider client={client}>
        <App {...props} />
      </TuyauProvider>
    )
  },
  progress: {
    color: '#334155',
  },
})
