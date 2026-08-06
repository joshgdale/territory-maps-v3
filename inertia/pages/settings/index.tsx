import {
  ArrowPathIcon,
  HandThumbUpIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/20/solid'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { Head, router, useForm, usePage } from '@inertiajs/react'
import { useEffect, useRef, useState } from 'react'
import { Button, Card, ColumnLayout, Input, Switch } from '~/components/ui'
import { type MapTypeWithCanDelete, type StreetCategoryWithCanDelete } from '~/lib/types'
import { withAppLayout } from '~/layouts/app'

interface SettingsCongregation {
  number: string
  name: string
  shareMessage: string
  broughtBackConfirmationMessage: string
  securityToken: string
}

interface SettingsProps {
  congregation: SettingsCongregation
  mapTypes: MapTypeWithCanDelete[]
  streetCategories: StreetCategoryWithCanDelete[]
}

function ManageMapTypes({ mapTypes }: { mapTypes: MapTypeWithCanDelete[] }) {
  const form = useForm({ name: '' })
  const ref = useRef<HTMLFormElement>(null)

  function submit(event: React.FormEvent) {
    event.preventDefault()
    form.post('/settings/map-types', {
      preserveScroll: true,
      onSuccess: () => {
        form.reset()
        ref.current?.reset()
      },
    })
  }

  return (
    <Card heading="Manage Map Types">
      <form ref={ref} onSubmit={submit} className="flex items-end gap-5">
        <div className="flex-1">
          <Input
            label="Add New Map Type"
            name="name"
            largerLabel
            value={form.data.name}
            onChange={(e) => form.setData('name', e.target.value)}
            error={form.errors.name}
          />
        </div>
        <Button className="px-3" type="submit" loading={form.processing}>
          <PlusIcon aria-hidden className="my-1 h-5 w-5" />
          <span className="sr-only">New Map Type</span>
        </Button>
      </form>
      {mapTypes.length != 0 && (
        <>
          <h3 className="mt-4 pb-2 font-semibold text-slate-700">Existing Map Types</h3>
          <ul className="-mx-3">
            {mapTypes.map((type) => (
              <li
                key={type.id}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-100"
              >
                <span className="flex-1 py-1">{type.name}</span>
                {type.canDelete && (
                  <Button
                    iconOnly
                    type="button"
                    onClick={() =>
                      router.delete(`/settings/map-types/${type.id}`, { preserveScroll: true })
                    }
                  >
                    <TrashIcon aria-hidden className="h-4 w-4" />
                    <span className="sr-only">Delete {type.name} Map Type</span>
                  </Button>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <QuestionMarkCircleIcon aria-hidden className="h-6 w-6 shrink-0" />
            <span>A Map Type can only be deleted if are no maps assigned to that type.</span>
          </div>
        </>
      )}
    </Card>
  )
}

function ManageStreetCategories({
  streetCategories,
}: {
  streetCategories: StreetCategoryWithCanDelete[]
}) {
  const form = useForm({ name: '' })
  const ref = useRef<HTMLFormElement>(null)

  function submit(event: React.FormEvent) {
    event.preventDefault()
    form.post('/settings/street-categories', {
      preserveScroll: true,
      onSuccess: () => {
        form.reset()
        ref.current?.reset()
      },
    })
  }

  return (
    <Card heading="Manage Street Categories">
      <form ref={ref} onSubmit={submit} className="flex items-end gap-5">
        <div className="flex-1">
          <Input
            label="Add New Street Category"
            name="name"
            largerLabel
            value={form.data.name}
            onChange={(e) => form.setData('name', e.target.value)}
            error={form.errors.name}
          />
        </div>
        <Button className="px-3" type="submit" loading={form.processing}>
          <PlusIcon aria-hidden className="my-1 h-5 w-5" />
          <span className="sr-only">New Street Category</span>
        </Button>
      </form>
      {streetCategories.length != 0 && (
        <>
          <h3 className="mt-4 pb-2 font-semibold text-slate-700">Existing Street Categories</h3>
          <ul className="-mx-3">
            {streetCategories.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-100"
              >
                <span className="flex-1 py-1">{category.name}</span>
                {category.canDelete && (
                  <Button
                    iconOnly
                    type="button"
                    onClick={() =>
                      router.delete(`/settings/street-categories/${category.id}`, {
                        preserveScroll: true,
                      })
                    }
                  >
                    <TrashIcon aria-hidden className="h-4 w-4" />
                    <span className="sr-only">Delete {category.name} Street Category</span>
                  </Button>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <QuestionMarkCircleIcon aria-hidden className="h-6 w-6 shrink-0" />
            <span>A Street Category can only be deleted if are no streets categoried with it.</span>
          </div>
        </>
      )}
    </Card>
  )
}

function CustomiseShareMessage({ shareMessage }: { shareMessage: string }) {
  const [message, setMessage] = useState(shareMessage)

  useEffect(() => {
    if (message === shareMessage) return
    const timer = window.setTimeout(() => {
      router.put('/settings/share-message', { message }, { preserveScroll: true })
    }, 1500)
    return () => window.clearTimeout(timer)
  }, [message, shareMessage])

  return (
    <Card heading="Customise Share Message">
      <textarea
        rows={10}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full resize-y rounded-lg border border-slate-400 px-2 py-1 focus:border-slate-700 focus:ring-slate-700 sm:px-3 sm:py-2"
      />
      <p className="mt-4 flex items-center gap-2 text-sm text-slate-600">
        <QuestionMarkCircleIcon aria-hidden className="h-6 w-6 shrink-0" />
        <span>
          Customise the message that is pre-filled when sharing a link via email, SMS or WhatsApp.
        </span>
      </p>
      <p className="mt-4 flex items-center gap-2 text-sm text-slate-600">
        <QuestionMarkCircleIcon aria-hidden className="h-6 w-6 shrink-0" />
        <span>Use tokens to insert dynamic infomation about the map you&apos;re sharing.</span>
      </p>
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-200 p-4">
        <span>
          <p className="mb-2 font-bold">Available tokens</p>
          <ul className="list-disc pl-5 text-sm">
            <li>{'{name} — Map name'}</li>
            <li>{'{code} — Map code'}</li>
            <li>{'{link} — Sharable link to map'}</li>
          </ul>
        </span>
      </div>
    </Card>
  )
}

function CustomiseConfirmationMessage({
  confirmationMessage,
}: {
  confirmationMessage: string
}) {
  const [message, setMessage] = useState(confirmationMessage)

  useEffect(() => {
    if (message === confirmationMessage) return
    const timer = window.setTimeout(() => {
      router.put('/settings/confirmation-message', { message }, { preserveScroll: true })
    }, 1500)
    return () => window.clearTimeout(timer)
  }, [message, confirmationMessage])

  return (
    <Card heading="Customise Confirmation Message">
      <textarea
        rows={10}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full resize-y rounded-lg border border-slate-400 px-2 py-1 focus:border-slate-700 focus:ring-slate-700 sm:px-3 sm:py-2"
      />
      <p className="mt-4 flex items-center gap-2 text-sm text-slate-600">
        <QuestionMarkCircleIcon aria-hidden className="h-6 w-6 shrink-0" />
        <span>
          Customise the message that is pre-filled when marking a map as complete and returned.
        </span>
      </p>
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-200 p-4">
        <span>
          <p className="mb-2 font-bold">Available tokens</p>
          <ul className="list-disc pl-5 text-sm">
            <li>{'{name} — Map name'}</li>
            <li>{'{code} — Map code'}</li>
          </ul>
        </span>
      </div>
    </Card>
  )
}

function RollSecurityToken({ securityToken }: { securityToken: string }) {
  const { props } = usePage<{ flash?: { success?: string } }>()
  const [showingTool, setShowingTool] = useState(false)
  const form = useForm({ confirm: false })
  const justRefreshed = Boolean(props.flash?.success?.toLowerCase().includes('security token'))

  useEffect(() => {
    if (justRefreshed) setShowingTool(true)
  }, [justRefreshed])

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!form.data.confirm) {
      form.setError('confirm', 'You must confirm this action')
      return
    }
    form.post('/settings/roll-security-token', {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        form.setData('confirm', false)
      },
    })
  }

  return (
    <Card heading="Refresh Security Token">
      {showingTool ? (
        <>
          <span className="mb-4 inline-block rounded-lg bg-slate-200 px-2 py-1 text-sm">
            {justRefreshed ? 'New Token: ' : 'Current Token: '}
            <span className="font-mono">{securityToken}</span>
          </span>
          <form onSubmit={submit} className="flex flex-col items-end space-y-4">
            <Switch
              label="Yes, I want to invalidate all current map links & refresh the security token."
              name="confirm"
              required
              checked={form.data.confirm}
              onChange={(value) => form.setData('confirm', value)}
              error={form.errors.confirm}
            />
            <Button type="submit" hasIcon loading={form.processing}>
              <ArrowPathIcon aria-hidden className="mr-2 h-5 w-5" />
              <span>Refresh Security Token</span>
            </Button>
          </form>
          <div className="my-4 flex items-center gap-2 text-sm text-slate-600">
            <QuestionMarkCircleIcon aria-hidden className="h-6 w-6 shrink-0" />
            <span>
              Refreshing the security token will invalidate all current shared map links.
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <QuestionMarkCircleIcon aria-hidden className="h-6 w-6 shrink-0" />
            <span>
              Use this feature if you believe a map link has got into the hands of someone it
              shouldn&apos;t have. This should happen rarely, if at all.
            </span>
          </div>
        </>
      ) : (
        <>
          <p className="mb-4">This is an advanced feature. Please use carefully!</p>
          <Button onClick={() => setShowingTool(true)} hasIcon>
            <HandThumbUpIcon aria-hidden className="mr-2 h-5 w-5" />
            <span>I know what I&apos;m doing!</span>
          </Button>
        </>
      )}
    </Card>
  )
}

function SettingsPage({ congregation, mapTypes, streetCategories }: SettingsProps) {
  return (
    <>
      <Head title="Settings" />
      <ColumnLayout>
        <ColumnLayout.Column>
          <ManageMapTypes mapTypes={mapTypes} />
          <ManageStreetCategories streetCategories={streetCategories} />
        </ColumnLayout.Column>
        <ColumnLayout.Column>
          <CustomiseShareMessage shareMessage={congregation.shareMessage} />
          <CustomiseConfirmationMessage
            confirmationMessage={congregation.broughtBackConfirmationMessage}
          />
          <RollSecurityToken securityToken={congregation.securityToken} />
        </ColumnLayout.Column>
      </ColumnLayout>
    </>
  )
}

SettingsPage.layout = (page: React.ReactNode) => withAppLayout(page, 'Settings')
export default SettingsPage
