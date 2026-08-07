import {
  Bars3Icon,
  CheckIcon,
  PencilIcon as SolidPencilIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid'
import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUpTrayIcon,
  BellAlertIcon,
  ChatBubbleBottomCenterTextIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  ExclamationTriangleIcon,
  LinkIcon,
  PencilIcon as OutlinePencilIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { Head, router, useForm, usePage } from '@inertiajs/react'
import { add, isAfter, parseISO } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  AppBarTools,
  Button,
  Card,
  DatePicker,
  Dropdown,
  FileInput,
  Input,
  Panel,
  Select,
  Switch,
  Table,
  TextArea,
  type ITableColumn,
} from '~/components/ui'
import { toInputDate } from '~/lib/format'
import {
  type Activity,
  type DoNotCall,
  type MapSummary,
  type MapType,
  type Rural,
  type Street,
  type StreetCategory,
} from '~/lib/types'
import { RuralExternalLinks, RuralMeta } from '~/components/rural_links'
import { withAppLayout } from '~/layouts/app'

interface MapsShowProps {
  map: MapSummary
  imageUrl: string | null
  mapTypes: MapType[]
  streetCategories: StreetCategory[]
  isOverdue: boolean
  shareableLink: string
  shareMessage: string
}

type PanelKind =
  | { kind: 'edit-map' }
  | { kind: 'activity'; activity?: Activity }
  | { kind: 'street'; street?: Street }
  | { kind: 'rural'; rural?: Rural }
  | { kind: 'dnc'; dnc?: DoNotCall }
  | null

const activityTableColumns: ITableColumn[] = [
  { label: 'Status', name: 'status', selector: (row) => row.status, sortable: true },
  { label: 'Date Taken Out', name: 'outDate', isDate: true, selector: (row) => row.outDate, sortable: true },
  { label: 'Date Brought In', name: 'inDate', isDate: true, selector: (row) => row.inDate, sortable: true },
  { label: 'Publisher', name: 'publisher', selector: (row) => row.publisher, sortable: true },
  { label: 'Notes', name: 'notes', selector: (row) => row.notes },
  { label: '', name: 'actions' },
]

const dncTableColumns: ITableColumn[] = [
  { label: 'Address', name: 'address', selector: (row) => row.address, sortable: true },
  { label: 'Last Called', name: 'lastCalled', isDate: true, selector: (row) => row.lastCalled, sortable: true },
  { label: '', name: 'actions' },
]

function StreetItem({
  street,
  completed,
  onEdit,
  onToggle,
  pending,
  striped,
}: {
  street: Street
  completed: boolean
  onEdit: () => void
  pending: boolean
  onToggle: () => void
  striped: boolean
}) {
  return (
    <li
      className={`flex items-start justify-between gap-3 px-4 py-3 sm:px-6 ${
        striped ? 'bg-slate-100' : 'bg-white'
      } ${completed ? 'text-slate-600' : 'text-black'}`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-4 sm:gap-6">
        <input
          type="checkbox"
          checked={completed}
          disabled={pending}
          onChange={onToggle}
          className="mt-0.5 h-6 w-6 shrink-0 rounded text-slate-700 disabled:opacity-60"
        />
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className={`wrap-break-word ${completed ? 'line-through' : ''}`}>{street.name}</span>
          {(street.categories ?? []).map((category) => (
            <span key={category.id} className="rounded-lg bg-slate-200 px-3 py-1 text-sm">
              {category.name}
            </span>
          ))}
        </div>
      </div>
      <div className="flex shrink-0 space-x-2">
        <button
          type="button"
          title={`Update ${street.name}`}
          className="inline-flex items-center rounded-lg bg-slate-700 px-2 py-1.5 text-white hover:bg-slate-600"
          onClick={onEdit}
        >
          <SolidPencilIcon className="h-4 w-4" aria-hidden />
          <span className="sr-only">Update {street.name}</span>
        </button>
      </div>
    </li>
  )
}

function RuralItem({
  rural,
  completed,
  onEdit,
  onToggle,
  pending,
  striped,
}: {
  rural: Rural
  completed: boolean
  onEdit: () => void
  pending: boolean
  onToggle: () => void
  striped: boolean
}) {
  return (
    <li
      className={`flex items-start justify-between gap-3 px-4 py-3 sm:px-6 ${
        striped ? 'bg-slate-100' : 'bg-white'
      } ${completed ? 'text-slate-600' : 'text-black'}`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-4 sm:gap-6">
        <input
          type="checkbox"
          checked={completed}
          disabled={pending}
          onChange={onToggle}
          className="mt-0.5 h-6 w-6 shrink-0 rounded text-slate-700 disabled:opacity-60"
        />
        <div className="flex min-w-0 max-w-full flex-col gap-0.5">
          <span className={`min-w-0 wrap-break-word ${completed ? 'line-through' : ''}`}>
            {rural.description}
          </span>
          <RuralMeta rural={rural} />
        </div>
      </div>
      <div className="flex shrink-0 items-start gap-1.5">
        <RuralExternalLinks rural={rural} />
        <button
          type="button"
          title="Update rural"
          className="inline-flex items-center rounded-lg bg-slate-700 px-2 py-1.5 text-white hover:bg-slate-600"
          onClick={onEdit}
        >
          <SolidPencilIcon className="h-4 w-4" aria-hidden />
          <span className="sr-only">Update rural</span>
        </button>
      </div>
    </li>
  )
}

function MapsShow({
  map,
  imageUrl,
  mapTypes,
  streetCategories,
  isOverdue,
  shareableLink,
  shareMessage,
}: MapsShowProps) {
  const [panel, setPanel] = useState<PanelKind>(null)
  const [panelClosed, setPanelClosed] = useState(true)
  const [optimisticComplete, setOptimisticComplete] = useState<Record<string, boolean>>({})
  const [optimisticRuralComplete, setOptimisticRuralComplete] = useState<Record<string, boolean>>(
    {}
  )
  const pendingStreetToggles = useRef(new Set<string>())
  const pendingRuralToggles = useRef(new Set<string>())
  const [, setPendingVersion] = useState(0)
  const latestActivity = map.activities?.[0]
  const [messageFromServant, setMessageFromServant] = useState(map.messageFromServant ?? '')

  useEffect(() => {
    setOptimisticComplete({})
    pendingStreetToggles.current.clear()
  }, [map.streets])

  useEffect(() => {
    setOptimisticRuralComplete({})
    pendingRuralToggles.current.clear()
  }, [map.rurals])

  useEffect(() => {
    if (latestActivity?.status !== 'OUT') return
    if (messageFromServant === (map.messageFromServant ?? '')) return
    const timer = window.setTimeout(() => {
      router.put(
        `/maps/${map.id}/messages/from-servant`,
        { message: messageFromServant },
        { preserveScroll: true }
      )
    }, 1500)
    return () => window.clearTimeout(timer)
  }, [messageFromServant, map.messageFromServant, map.id, latestActivity?.status])

  function openPanel(next: PanelKind) {
    setPanel(next)
    setPanelClosed(false)
  }

  function closePanel() {
    setPanelClosed(true)
  }

  function handlePanelClosed() {
    setPanel(null)
  }

  function isStreetComplete(street: Street) {
    return street.id in optimisticComplete
      ? optimisticComplete[street.id]
      : Boolean(street.isComplete)
  }

  function toggleStreet(streetId: string) {
    if (pendingStreetToggles.current.has(streetId)) return

    const street = map.streets?.find((item) => item.id === streetId)
    if (!street) return

    const current = isStreetComplete(street)
    const next = !current
    setOptimisticComplete((prev) => ({ ...prev, [streetId]: next }))
    pendingStreetToggles.current.add(streetId)
    setPendingVersion((value) => value + 1)

    router.put(
      `/maps/${map.id}/street/${streetId}/toggle-complete`,
      {},
      {
        preserveScroll: true,
        onError: () => {
          setOptimisticComplete((prev) => ({ ...prev, [streetId]: current }))
        },
        onFinish: () => {
          pendingStreetToggles.current.delete(streetId)
          setPendingVersion((value) => value + 1)
        },
      }
    )
  }

  function isRuralComplete(rural: Rural) {
    return rural.id in optimisticRuralComplete
      ? optimisticRuralComplete[rural.id]
      : Boolean(rural.isComplete)
  }

  function toggleRural(ruralId: string) {
    if (pendingRuralToggles.current.has(ruralId)) return

    const rural = map.rurals?.find((item) => item.id === ruralId)
    if (!rural) return

    const current = isRuralComplete(rural)
    const next = !current
    setOptimisticRuralComplete((prev) => ({ ...prev, [ruralId]: next }))
    pendingRuralToggles.current.add(ruralId)
    setPendingVersion((value) => value + 1)

    router.put(
      `/maps/${map.id}/rural/${ruralId}/toggle-complete`,
      {},
      {
        preserveScroll: true,
        onError: () => {
          setOptimisticRuralComplete((prev) => ({ ...prev, [ruralId]: current }))
        },
        onFinish: () => {
          pendingRuralToggles.current.delete(ruralId)
          setPendingVersion((value) => value + 1)
        },
      }
    )
  }

  const pageTitle = `${map.name} (${map.code})`

  return (
    <>
      <Head title={pageTitle} />
      <AppBarTools>
        <Dropdown icon={Bars3Icon} title="Menu">
          <Dropdown.Item onClick={() => openPanel({ kind: 'edit-map' })}>
            <OutlinePencilIcon aria-hidden className="mr-2 h-5 w-5" />
            Edit Map Details
          </Dropdown.Item>
          <Dropdown.Item href={`sms:&body=${shareMessage}`}>
            <LinkIcon className="mr-2 h-5 w-5" aria-hidden="true" />
            Send Link via SMS
          </Dropdown.Item>
          <Dropdown.Item href={`whatsapp://send?text=${shareMessage}`}>
            <LinkIcon className="mr-2 h-5 w-5" aria-hidden="true" />
            Send Link via WhatsApp
          </Dropdown.Item>
          <Dropdown.Item
            href={`mailto:?subject=Link to the ${map.name} map&body=${shareMessage}`}
          >
            <LinkIcon className="mr-2 h-5 w-5" aria-hidden="true" />
            Send Link via Email
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              navigator.clipboard.writeText(shareableLink)
              toast.success('Link copied to clipboard')
            }}
          >
            <DocumentDuplicateIcon className="mr-2 h-5 w-5" aria-hidden="true" />
            Copy Link to Clipboard
          </Dropdown.Item>
          <Dropdown.Item href={shareableLink} newTab>
            <ArrowTopRightOnSquareIcon className="mr-2 h-5 w-5" aria-hidden="true" />
            Go to Public Page
          </Dropdown.Item>
        </Dropdown>
      </AppBarTools>

      <div className="space-y-4 sm:space-y-6">
        {latestActivity && (
          <div className="flex gap-4 overflow-x-scroll sm:gap-6">
            <div
              className={`flex items-center whitespace-nowrap rounded-lg px-4 py-1 text-sm font-semibold sm:text-base ${
                latestActivity.status == 'IN' ? 'bg-green-500/50' : 'bg-amber-500/50'
              }`}
            >
              {latestActivity.status == 'IN' ? (
                <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
              ) : (
                <ArrowUpTrayIcon className="mr-2 h-5 w-5" />
              )}
              {latestActivity.status == 'IN' ? 'In' : 'Out'}
            </div>
            {latestActivity.status == 'OUT' && (
              <div className="flex items-center whitespace-nowrap rounded-lg bg-sky-500/50 px-4 py-1 text-sm font-semibold sm:text-base">
                <UserIcon className="mr-2 h-5 w-5" />
                {latestActivity.publisher}
              </div>
            )}
            {map.messageToServant && (
              <div className="flex items-center whitespace-nowrap rounded-lg bg-emerald-500/50 px-4 py-1 text-sm font-semibold sm:text-base">
                <ChatBubbleBottomCenterTextIcon className="mr-2 h-5 w-5" />
                Message Available
              </div>
            )}
            {(isOverdue ||
              (latestActivity.status == 'OUT' &&
                isAfter(new Date(), add(parseISO(latestActivity.outDate), { months: 4 })))) && (
              <div className="flex items-center whitespace-nowrap rounded-lg bg-red-500/50 px-4 py-1 text-sm font-semibold sm:text-base">
                <ClockIcon className="mr-2 h-5 w-5" />
                Out for over 4 months
              </div>
            )}
          </div>
        )}

        {imageUrl && (
          <div className="mx-auto max-w-3xl">
            <a href={imageUrl}>
              <img
                className="mx-auto rounded-lg"
                src={imageUrl}
                alt={`Image of the ${map.name} map`}
              />
            </a>
          </div>
        )}

        <Table
          heading="Activity"
          renderHeadingRight={
            <button
              type="button"
              title="Add Activity"
              className="inline-flex items-center rounded-lg bg-slate-700 px-2 py-1.5 text-white hover:bg-slate-600"
              onClick={() => openPanel({ kind: 'activity' })}
            >
              <PlusIcon className="h-5 w-5" aria-hidden />
            </button>
          }
          columns={activityTableColumns}
          data={map.activities ?? []}
          noDataMessage="No Activity on this Map"
          shadow
        >
          {({ row }) => ({
            status:
              row.status == 'IN' ? (
                <div className="flex">
                  <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
                  <span>In</span>
                </div>
              ) : (
                <div className="flex">
                  <ArrowUpTrayIcon className="mr-2 h-5 w-5" />
                  <span>Out</span>
                </div>
              ),
            actions: (
              <button
                type="button"
                title="Edit Activity"
                className="inline-flex items-center rounded-lg bg-slate-700 px-2 py-1.5 text-white hover:bg-slate-600"
                onClick={() => openPanel({ kind: 'activity', activity: row })}
              >
                <SolidPencilIcon className="h-4 w-4" aria-hidden />
              </button>
            ),
          })}
        </Table>

        <Card
          externalHeading
          heading="Message from assigned Brother"
          renderHeadingRight={
            map.messageToServant ? (
              <Button
                hasIcon
                type="button"
                onClick={() =>
                  router.delete(`/maps/${map.id}/messages/to-servant`, { preserveScroll: true })
                }
              >
                <XMarkIcon className="mr-2 h-5 w-5" aria-hidden />
                <span>Clear</span>
              </Button>
            ) : undefined
          }
        >
          {map.messageToServant ? (
            <p className="whitespace-pre-wrap">{map.messageToServant}</p>
          ) : (
            <p className="text-sm text-slate-700">No message to display.</p>
          )}
        </Card>

        {latestActivity?.status == 'OUT' && (
          <Card
            externalHeading
            heading="Message to assigned Brother"
            renderHeadingRight={
              messageFromServant ? (
                <Button
                  hasIcon
                  type="button"
                  onClick={() => {
                    setMessageFromServant('')
                    router.delete(`/maps/${map.id}/messages/from-servant`, { preserveScroll: true })
                  }}
                >
                  <XMarkIcon className="mr-2 h-5 w-5" aria-hidden />
                  <span>Clear</span>
                </Button>
              ) : undefined
            }
          >
            <textarea
              rows={5}
              value={messageFromServant}
              onChange={(e) => setMessageFromServant(e.target.value)}
              className="w-full resize-y rounded-lg border border-slate-400 px-2 py-1 focus:border-slate-700 focus:ring-slate-700 sm:px-3 sm:py-2"
              placeholder="Leave a message to the brother viewing the map link..."
            />
          </Card>
        )}

        <Table
          heading="Do Not Calls"
          renderHeadingRight={
            <button
              type="button"
              className="inline-flex items-center rounded-lg bg-slate-700 px-2 py-1.5 text-white hover:bg-slate-600"
              onClick={() => openPanel({ kind: 'dnc' })}
            >
              <PlusIcon className="h-5 w-5" aria-hidden />
              <span className="sr-only">Add Do Not Call</span>
            </button>
          }
          columns={dncTableColumns}
          data={map.doNotCalls ?? []}
          noDataMessage="No Do Not Calls on this Map"
          shadow
        >
          {({ row }) => ({
            actions: (
              <button
                type="button"
                className="inline-flex items-center rounded-lg bg-slate-700 px-2 py-1.5 text-white hover:bg-slate-600"
                onClick={() => openPanel({ kind: 'dnc', dnc: row })}
              >
                <SolidPencilIcon className="h-4 w-4" aria-hidden />
                <span className="sr-only">Edit Do Not Call</span>
              </button>
            ),
          })}
        </Table>

        <Card
          externalHeading
          noContentPadding
          heading="Streets"
          renderHeadingRight={
            <button
              type="button"
              className="inline-flex items-center rounded-lg bg-slate-700 px-2 py-1.5 text-white hover:bg-slate-600"
              onClick={() => openPanel({ kind: 'street' })}
            >
              <PlusIcon className="h-5 w-5" aria-hidden />
              <span className="sr-only">Add Street</span>
            </button>
          }
        >
          {(map.streets ?? []).length == 0 ? (
            <p className="px-4 py-6 text-center text-sm sm:px-6">
              No streets added yet. Display the add form with the plus button above.
            </p>
          ) : (
            <ul className="overflow-hidden rounded-lg">
              {(map.streets ?? []).map((street, index) => (
                <StreetItem
                  key={street.id}
                  street={street}
                  completed={isStreetComplete(street)}
                  pending={pendingStreetToggles.current.has(street.id)}
                  onToggle={() => toggleStreet(street.id)}
                  onEdit={() => openPanel({ kind: 'street', street })}
                  striped={index % 2 === 1}
                />
              ))}
            </ul>
          )}
        </Card>

        <Card
          externalHeading
          noContentPadding
          heading="Rurals"
          renderHeadingRight={
            <button
              type="button"
              className="inline-flex items-center rounded-lg bg-slate-700 px-2 py-1.5 text-white hover:bg-slate-600"
              onClick={() => openPanel({ kind: 'rural' })}
            >
              <PlusIcon className="h-5 w-5" aria-hidden />
              <span className="sr-only">Add Rural</span>
            </button>
          }
        >
          {(map.rurals ?? []).length == 0 ? (
            <p className="px-4 py-6 text-center text-sm sm:px-6">
              No rurals added yet. Display the add form with the plus button above.
            </p>
          ) : (
            <ul className="overflow-hidden rounded-lg">
              {(map.rurals ?? []).map((rural, index) => (
                <RuralItem
                  key={rural.id}
                  rural={rural}
                  completed={isRuralComplete(rural)}
                  pending={pendingRuralToggles.current.has(rural.id)}
                  onToggle={() => toggleRural(rural.id)}
                  onEdit={() => openPanel({ kind: 'rural', rural })}
                  striped={index % 2 === 1}
                />
              ))}
            </ul>
          )}
        </Card>
      </div>

      {panel && (
        <MapDetailPanel
          panel={panel}
          map={map}
          mapTypes={mapTypes}
          streetCategories={streetCategories}
          isOpen={!panelClosed}
          onClose={closePanel}
          onClosed={handlePanelClosed}
        />
      )}
    </>
  )
}

function MapDetailPanel({
  panel,
  map,
  mapTypes,
  streetCategories,
  isOpen,
  onClose,
  onClosed,
}: {
  panel: Exclude<PanelKind, null>
  map: MapSummary
  mapTypes: MapType[]
  streetCategories: StreetCategory[]
  isOpen: boolean
  onClose: () => void
  onClosed: () => void
}) {
  if (panel.kind === 'edit-map') {
    return <EditMapPanel map={map} mapTypes={mapTypes} isOpen={isOpen} onClose={onClose} onClosed={onClosed} />
  }
  if (panel.kind === 'activity') {
    return (
      <ActivityPanel
        mapId={map.id}
        activity={panel.activity}
        isOpen={isOpen}
        onClose={onClose}
        onClosed={onClosed}
      />
    )
  }
  if (panel.kind === 'street') {
    return (
      <StreetPanel
        mapId={map.id}
        street={panel.street}
        streetCategories={streetCategories}
        isOpen={isOpen}
        onClose={onClose}
        onClosed={onClosed}
      />
    )
  }
  if (panel.kind === 'rural') {
    return (
      <RuralPanel
        mapId={map.id}
        rural={panel.rural}
        isOpen={isOpen}
        onClose={onClose}
        onClosed={onClosed}
      />
    )
  }
  return (
    <DncPanel
      mapId={map.id}
      dnc={panel.dnc}
      isOpen={isOpen}
      onClose={onClose}
      onClosed={onClosed}
    />
  )
}

function EditMapPanel({
  map,
  mapTypes,
  isOpen,
  onClose,
  onClosed,
}: {
  map: MapSummary
  mapTypes: MapType[]
  isOpen: boolean
  onClose: () => void
  onClosed: () => void
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { data, setData, put, processing, errors, delete: destroy } = useForm({
    name: map.name,
    code: map.code,
    type: map.typeId ?? map.type?.id ?? '',
    image: null as File | null,
  })

  function submit(event: React.FormEvent) {
    event.preventDefault()
    put(`/maps/${map.id}`, { forceFormData: true, onSuccess: () => onClose() })
  }

  function remove() {
    destroy(`/maps/${map.id}`)
  }

  return (
    <Panel
      isOpen={isOpen}
      close={onClose}
      onClosed={onClosed}
      title={isDeleting ? 'Delete Map' : 'Edit Map Details'}
      footerSpaceClass="justify-between"
      footer={
        isDeleting ? (
          <>
            <Button onClick={() => setIsDeleting(false)} intent="primary" hasIcon>
              <XMarkIcon aria-hidden className="mr-2 h-5 w-5" />
              <span>Cancel</span>
            </Button>
            <Button intent="danger" type="button" hasIcon onClick={remove} loading={processing}>
              <TrashIcon aria-hidden className="mr-2 h-5 w-5" />
              <span>Delete</span>
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setIsDeleting(true)} intent="danger" hasIcon>
              <TrashIcon aria-hidden className="mr-2 h-5 w-5" />
              <span>Delete</span>
            </Button>
            <Button intent="primary" type="submit" hasIcon form="edit-map-form" loading={processing}>
              <CheckIcon aria-hidden className="mr-2 h-5 w-5" />
              <span>Save</span>
            </Button>
          </>
        )
      }
    >
      {isDeleting ? (
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 rounded-full bg-red-100 p-4">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-600" aria-hidden />
          </div>
          <h3 className="pb-4 text-2xl font-bold">{`Delete "${map.name}"?`}</h3>
          <p>
            Are you sure you want to permanently delete this map?
            <br />
            This action cannot be undone.
          </p>
        </div>
      ) : (
        <form id="edit-map-form" onSubmit={submit} className="space-y-4">
          <Input label="Name" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} error={errors.name} />
          <Input label="Code" name="code" value={data.code} onChange={(e) => setData('code', e.target.value)} error={errors.code} />
          <Select
            label="Type"
            name="type"
            options={mapTypes.map((t) => ({ value: t.id, option: t.name }))}
            value={data.type}
            onChange={(option) => setData('type', option?.value ?? '')}
            error={errors.type}
          />
          <FileInput label="Image" name="image" error={errors.image} onFileChange={(file) => setData('image', file)} />
        </form>
      )}
    </Panel>
  )
}

function ActivityPanel({
  mapId,
  activity,
  isOpen,
  onClose,
  onClosed,
}: {
  mapId: string
  activity?: Activity
  isOpen: boolean
  onClose: () => void
  onClosed: () => void
}) {
  const isEdit = Boolean(activity)
  const [viewState, setViewState] = useState<'form' | 'delete' | 'send-confirmation'>('form')
  const [hasSentMessage, setHasSentMessage] = useState(false)
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null)
  const [confirmationPublisher, setConfirmationPublisher] = useState(activity?.publisher ?? '')
  const { data, setData, post, put, processing, errors, delete: destroy, transform } = useForm({
    publisher: activity?.publisher ?? '',
    outDate: toInputDate(activity?.outDate) || new Date().toISOString().slice(0, 10),
    inDate: toInputDate(activity?.inDate),
    notes: activity?.notes ?? '',
  })

  transform((formData) => ({
    ...formData,
    inDate: formData.inDate || null,
    notes: formData.notes || null,
  }))

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const options = {
      preserveScroll: true,
      preserveState: true,
      onSuccess: (page: { props: Record<string, unknown> }) => {
        const flash = page.props.flash as
          | {
              justBroughtBack?: boolean
              confirmationMessage?: string
              confirmationPublisher?: string
            }
          | undefined

        if (flash?.justBroughtBack && flash.confirmationMessage) {
          setConfirmationMessage(flash.confirmationMessage)
          setConfirmationPublisher(flash.confirmationPublisher || data.publisher)
          setHasSentMessage(false)
          setViewState('send-confirmation')
          return
        }

        onClose()
      },
    }
    if (isEdit && activity) put(`/maps/${mapId}/activity/${activity.id}`, options)
    else post(`/maps/${mapId}/activity`, options)
  }

  function remove() {
    if (!activity) return
    destroy(`/maps/${mapId}/activity/${activity.id}`, { onSuccess: () => onClose() })
  }

  const title =
    viewState === 'delete'
      ? 'Delete Activity'
      : viewState === 'send-confirmation'
        ? 'Send Confirmation'
        : isEdit
          ? 'Edit Activity'
          : 'Add Activity'

  return (
    <Panel
      isOpen={isOpen}
      close={onClose}
      onClosed={onClosed}
      title={title}
      footerSpaceClass={
        viewState === 'send-confirmation'
          ? 'justify-end'
          : viewState === 'delete' || isEdit
            ? 'justify-between'
            : 'justify-end'
      }
      footer={
        viewState === 'delete' ? (
          <>
            <Button onClick={() => setViewState('form')} intent="primary" hasIcon>
              <XMarkIcon aria-hidden className="mr-2 h-5 w-5" />
              <span>Cancel</span>
            </Button>
            <Button intent="danger" type="button" hasIcon onClick={remove} loading={processing}>
              <TrashIcon aria-hidden className="mr-2 h-5 w-5" />
              <span>Delete</span>
            </Button>
          </>
        ) : viewState === 'send-confirmation' ? (
          <div className="flex w-full flex-col items-end gap-4">
            <Switch
              onChange={setHasSentMessage}
              checked={hasSentMessage}
              label={`Yes, I've sent a message to ${confirmationPublisher} confirming the map has been completed and is now returned.`}
              name="message-sent"
            />
            <Button disabled={!hasSentMessage} onClick={onClose} intent="primary" hasIcon>
              <CheckIcon aria-hidden className="mr-2 h-5 w-5" />
              <span>Done</span>
            </Button>
          </div>
        ) : isEdit ? (
          <>
            <Button onClick={() => setViewState('delete')} intent="danger" hasIcon>
              <TrashIcon aria-hidden className="mr-2 h-5 w-5" />
              <span>Delete</span>
            </Button>
            <Button intent="primary" type="submit" hasIcon form="activity-form" loading={processing}>
              <CheckIcon aria-hidden className="mr-2 h-5 w-5" />
              <span>Save</span>
            </Button>
          </>
        ) : (
          <Button intent="primary" type="submit" hasIcon form="activity-form" loading={processing}>
            <CheckIcon aria-hidden className="mr-2 h-5 w-5" />
            <span>Save</span>
          </Button>
        )
      }
    >
      {viewState === 'delete' ? (
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 rounded-full bg-red-100 p-4">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-600" aria-hidden />
          </div>
          <h3 className="pb-4 text-2xl font-bold">Delete Activity?</h3>
          <p>
            Are you sure you want to permanently delete this activity?
            <br />
            This action cannot be undone.
          </p>
        </div>
      ) : viewState === 'send-confirmation' ? (
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 rounded-full bg-blue-100 p-4">
            <BellAlertIcon className="h-16 w-16 text-blue-600" aria-hidden />
          </div>
          <h3 className="mb-4 text-2xl font-bold">{`Send confirmation to ${confirmationPublisher}`}</h3>
          <p className="mb-8">
            Confirm with the publisher that the map has been completed and is no longer in their
            name.
            <br />
            <br />
            It&apos;s important to do this to ensure that everyone involved is aware of the current
            status of the map.
          </p>
          <a href={`sms:&body=${confirmationMessage}`} className="mb-4">
            <Button intent="secondary" hasIcon type="button">
              <LinkIcon className="mr-2 h-5 w-5" aria-hidden="true" />
              <span>Send Confirmation via SMS</span>
            </Button>
          </a>
          <a href={`whatsapp://send?text=${confirmationMessage}`} className="mb-4">
            <Button intent="secondary" hasIcon type="button">
              <LinkIcon className="mr-2 h-5 w-5" aria-hidden="true" />
              <span>Send Confirmation via WhatsApp</span>
            </Button>
          </a>
          <a
            href={`mailto:?subject=Confirmation of map completion&body=${confirmationMessage}`}
            className="mb-4"
          >
            <Button intent="secondary" hasIcon type="button">
              <LinkIcon className="mr-2 h-5 w-5" aria-hidden="true" />
              <span>Send Confirmation via Email</span>
            </Button>
          </a>
        </div>
      ) : (
        <form id="activity-form" onSubmit={submit} className="space-y-4">
          <Input
            label="Publisher"
            name="publisher"
            value={data.publisher}
            onChange={(e) => setData('publisher', e.target.value)}
            error={errors.publisher}
          />
          <DatePicker
            label="Date Taken Out"
            name="outDate"
            value={data.outDate}
            onChange={(value) => setData('outDate', value)}
            error={errors.outDate}
            required
          />
          <DatePicker
            label="Date Brought In"
            name="inDate"
            value={data.inDate}
            onChange={(value) => setData('inDate', value)}
            error={errors.inDate}
          />
          <TextArea
            label="Notes"
            name="notes"
            value={data.notes}
            onChange={(e) => setData('notes', e.target.value)}
            error={errors.notes}
          />
        </form>
      )}
    </Panel>
  )
}

function StreetPanel({
  mapId,
  street,
  streetCategories,
  isOpen,
  onClose,
  onClosed,
}: {
  mapId: string
  street?: Street
  streetCategories: StreetCategory[]
  isOpen: boolean
  onClose: () => void
  onClosed: () => void
}) {
  const isEdit = Boolean(street)
  const [isDeleting, setIsDeleting] = useState(false)
  const { data, setData, post, put, processing, errors, delete: destroy, transform } = useForm({
    name: street?.name ?? '',
    categoryIds: street?.categories?.map((c) => c.id) ?? [],
  })

  transform((formData) => ({
    name: formData.name,
    categories: formData.categoryIds.length > 0 ? formData.categoryIds.join(',') : null,
  }))

  function toggleCategory(id: string) {
    const next = new Set(data.categoryIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setData('categoryIds', [...next])
  }

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const options = { onSuccess: () => onClose() }
    if (isEdit && street) put(`/maps/${mapId}/street/${street.id}`, options)
    else post(`/maps/${mapId}/street`, options)
  }

  function remove() {
    if (!street) return
    destroy(`/maps/${mapId}/street/${street.id}`, { onSuccess: () => onClose() })
  }

  return (
    <Panel
      isOpen={isOpen}
      close={onClose}
      onClosed={onClosed}
      title={isDeleting ? 'Delete Street' : isEdit ? 'Edit Street' : 'Add Street'}
      footerSpaceClass={isDeleting || isEdit ? 'justify-between' : 'justify-end'}
      footer={
        isDeleting ? (
          <>
            <Button onClick={() => setIsDeleting(false)} intent="primary" hasIcon>
              <XMarkIcon aria-hidden className="mr-2 h-5 w-5" />
              <span>Cancel</span>
            </Button>
            <Button intent="danger" type="button" hasIcon onClick={remove} loading={processing}>
              <TrashIcon aria-hidden className="mr-2 h-5 w-5" />
              <span>Delete</span>
            </Button>
          </>
        ) : isEdit ? (
          <>
            <Button onClick={() => setIsDeleting(true)} intent="danger" hasIcon>
              <TrashIcon aria-hidden className="mr-2 h-5 w-5" />
              <span>Delete</span>
            </Button>
            <Button intent="primary" type="submit" hasIcon form="street-form" loading={processing}>
              <CheckIcon aria-hidden className="mr-2 h-5 w-5" />
              <span>Save</span>
            </Button>
          </>
        ) : (
          <Button intent="primary" type="submit" hasIcon form="street-form" loading={processing}>
            <CheckIcon aria-hidden className="mr-2 h-5 w-5" />
            <span>Save</span>
          </Button>
        )
      }
    >
      {isDeleting ? (
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 rounded-full bg-red-100 p-4">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-600" aria-hidden />
          </div>
          <h3 className="pb-4 text-2xl font-bold">{`Delete "${street?.name}"?`}</h3>
          <p>
            Are you sure you want to permanently delete this street?
            <br />
            This action cannot be undone.
          </p>
        </div>
      ) : (
        <form id="street-form" onSubmit={submit} className="space-y-4">
          <Input
            label="Street Name"
            name="name"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            error={errors.name}
          />
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-700">Categories</p>
            <div className="space-y-2">
              {streetCategories.map((category) => (
                <label key={category.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={data.categoryIds.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="h-4 w-4 rounded text-slate-700"
                  />
                  <span>{category.name}</span>
                </label>
              ))}
            </div>
          </div>
        </form>
      )}
    </Panel>
  )
}

function RuralPanel({
  mapId,
  rural,
  isOpen,
  onClose,
  onClosed,
}: {
  mapId: string
  rural?: Rural
  isOpen: boolean
  onClose: () => void
  onClosed: () => void
}) {
  const isEdit = Boolean(rural)
  const [isDeleting, setIsDeleting] = useState(false)
  const { data, setData, post, put, processing, errors, delete: destroy, transform } = useForm({
    latitude: rural?.latitude?.toString() ?? '',
    longitude: rural?.longitude?.toString() ?? '',
    what3words: rural?.what3words ?? '',
    description: rural?.description ?? '',
  })

  transform((formData) => ({
    latitude: Number(formData.latitude),
    longitude: Number(formData.longitude),
    what3words: formData.what3words,
    description: formData.description,
  }))

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const options = { onSuccess: () => onClose() }
    if (isEdit && rural) put(`/maps/${mapId}/rural/${rural.id}`, options)
    else post(`/maps/${mapId}/rural`, options)
  }

  function remove() {
    if (!rural) return
    destroy(`/maps/${mapId}/rural/${rural.id}`, { onSuccess: () => onClose() })
  }

  return (
    <Panel
      isOpen={isOpen}
      close={onClose}
      onClosed={onClosed}
      title={isDeleting ? 'Delete Rural' : isEdit ? 'Edit Rural' : 'Add Rural'}
      footerSpaceClass={isDeleting || isEdit ? 'justify-between' : 'justify-end'}
      footer={
        isDeleting ? (
          <>
            <Button onClick={() => setIsDeleting(false)} intent="primary" hasIcon>
              <XMarkIcon aria-hidden className="mr-2 h-5 w-5" />
              <span>Cancel</span>
            </Button>
            <Button intent="danger" type="button" hasIcon onClick={remove} loading={processing}>
              <TrashIcon aria-hidden className="mr-2 h-5 w-5" />
              <span>Delete</span>
            </Button>
          </>
        ) : isEdit ? (
          <>
            <Button onClick={() => setIsDeleting(true)} intent="danger" hasIcon>
              <TrashIcon aria-hidden className="mr-2 h-5 w-5" />
              <span>Delete</span>
            </Button>
            <Button intent="primary" type="submit" hasIcon form="rural-form" loading={processing}>
              <CheckIcon aria-hidden className="mr-2 h-5 w-5" />
              <span>Save</span>
            </Button>
          </>
        ) : (
          <Button intent="primary" type="submit" hasIcon form="rural-form" loading={processing}>
            <CheckIcon aria-hidden className="mr-2 h-5 w-5" />
            <span>Save</span>
          </Button>
        )
      }
    >
      {isDeleting ? (
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 rounded-full bg-red-100 p-4">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-600" aria-hidden />
          </div>
          <h3 className="pb-4 text-2xl font-bold">Delete Rural?</h3>
          <p>
            Are you sure you want to permanently delete this rural?
            <br />
            This action cannot be undone.
          </p>
        </div>
      ) : (
        <form id="rural-form" onSubmit={submit} className="space-y-4">
          <TextArea
            label="Description"
            name="description"
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
            error={errors.description}
          />
          <Input
            label="What3Words"
            name="what3words"
            value={data.what3words}
            onChange={(e) => setData('what3words', e.target.value)}
            error={errors.what3words}
            placeholder="pretty.needed.chill"
          />
          <Input
            label="Latitude"
            name="latitude"
            type="number"
            step="any"
            value={data.latitude}
            onChange={(e) => setData('latitude', e.target.value)}
            error={errors.latitude}
          />
          <Input
            label="Longitude"
            name="longitude"
            type="number"
            step="any"
            value={data.longitude}
            onChange={(e) => setData('longitude', e.target.value)}
            error={errors.longitude}
          />
        </form>
      )}
    </Panel>
  )
}

function DncPanel({
  mapId,
  dnc,
  isOpen,
  onClose,
  onClosed,
}: {
  mapId: string
  dnc?: DoNotCall
  isOpen: boolean
  onClose: () => void
  onClosed: () => void
}) {
  const isEdit = Boolean(dnc)
  const [isDeleting, setIsDeleting] = useState(false)
  const { data, setData, post, put, processing, errors, delete: destroy } = useForm({
    address: dnc?.address ?? '',
    lastCalled: toInputDate(dnc?.lastCalled) || new Date().toISOString().slice(0, 10),
  })

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const options = { onSuccess: () => onClose() }
    if (isEdit && dnc) put(`/maps/${mapId}/dnc/${dnc.id}`, options)
    else post(`/maps/${mapId}/dnc`, options)
  }

  function remove() {
    if (!dnc) return
    destroy(`/maps/${mapId}/dnc/${dnc.id}`, { onSuccess: () => onClose() })
  }

  return (
    <Panel
      isOpen={isOpen}
      close={onClose}
      onClosed={onClosed}
      title={isDeleting ? 'Delete Do Not Call' : isEdit ? 'Edit Do Not Call' : 'Add Do Not Call'}
      footerSpaceClass={isDeleting || isEdit ? 'justify-between' : 'justify-end'}
      footer={
        isDeleting ? (
          <>
            <Button onClick={() => setIsDeleting(false)} intent="primary" hasIcon>
              <XMarkIcon aria-hidden className="mr-2 h-5 w-5" />
              <span>Cancel</span>
            </Button>
            <Button intent="danger" type="button" hasIcon onClick={remove} loading={processing}>
              <TrashIcon aria-hidden className="mr-2 h-5 w-5" />
              <span>Delete</span>
            </Button>
          </>
        ) : isEdit ? (
          <>
            <Button onClick={() => setIsDeleting(true)} intent="danger" hasIcon>
              <TrashIcon aria-hidden className="mr-2 h-5 w-5" />
              <span>Delete</span>
            </Button>
            <Button intent="primary" type="submit" hasIcon form="dnc-form" loading={processing}>
              <CheckIcon aria-hidden className="mr-2 h-5 w-5" />
              <span>Save</span>
            </Button>
          </>
        ) : (
          <Button intent="primary" type="submit" hasIcon form="dnc-form" loading={processing}>
            <CheckIcon aria-hidden className="mr-2 h-5 w-5" />
            <span>Save</span>
          </Button>
        )
      }
    >
      {isDeleting ? (
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 rounded-full bg-red-100 p-4">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-600" aria-hidden />
          </div>
          <h3 className="pb-4 text-2xl font-bold">Delete Do Not Call?</h3>
          <p>
            Are you sure you want to permanently delete this do not call?
            <br />
            This action cannot be undone.
          </p>
        </div>
      ) : (
        <form id="dnc-form" onSubmit={submit} className="space-y-4">
          <Input
            label="Address"
            name="address"
            value={data.address}
            onChange={(e) => setData('address', e.target.value)}
            error={errors.address}
          />
          <DatePicker
            label="Last Called"
            name="lastCalled"
            value={data.lastCalled}
            onChange={(value) => setData('lastCalled', value)}
            error={errors.lastCalled}
            required
          />
        </form>
      )}
    </Panel>
  )
}

function MapsShowLayout({ children }: { children: React.ReactNode }) {
  const { map } = usePage<{ map: MapSummary }>().props
  return withAppLayout(children, `${map.name} (${map.code})`)
}

MapsShow.layout = (page: React.ReactNode) => <MapsShowLayout>{page}</MapsShowLayout>

export default MapsShow
