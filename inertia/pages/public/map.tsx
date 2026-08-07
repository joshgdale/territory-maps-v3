import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'
import { Head, router } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Card, Table, type ITableColumn } from '~/components/ui'
import { RuralExternalLinks, RuralMeta } from '~/components/rural_links'
import { type MapSummary, type Rural, type Street, type StreetCategory } from '~/lib/types'

interface PublicMapProps {
  map: MapSummary | null
  imageUrl: string | null
  token: string
}

const dncTableColumns: ITableColumn[] = [
  { label: 'Address', name: 'address', selector: (row) => row.address, sortable: true },
  {
    label: 'Last Called',
    name: 'lastCalled',
    isDate: true,
    selector: (row) => row.lastCalled,
    sortable: true,
  },
]

const activityTableColumns: ITableColumn[] = [
  { label: 'Status', name: 'status', selector: (row) => row.status, sortable: true },
  { label: 'Date Taken Out', name: 'outDate', isDate: true, selector: (row) => row.outDate, sortable: true },
  { label: 'Date Brought In', name: 'inDate', isDate: true, selector: (row) => row.inDate, sortable: true },
  { label: 'Publisher', name: 'publisher', selector: (row) => row.publisher, sortable: true },
  { label: 'Notes', name: 'notes', selector: (row) => row.notes },
]

function PublicStreetItem({
  street,
  token,
  mapId,
  striped,
}: {
  street: Street & { categories?: StreetCategory[] }
  token: string
  mapId: string
  striped: boolean
}) {
  const [completed, setCompleted] = useState(Boolean(street.isComplete))
  const [pending, setPending] = useState(false)

  useEffect(() => {
    setCompleted(Boolean(street.isComplete))
  }, [street.isComplete])

  function toggle() {
    if (pending) return
    const previous = completed
    const next = !previous
    setCompleted(next)
    setPending(true)
    router.put(
      `/view/map/${mapId}/street/${street.id}/toggle-complete?t=${encodeURIComponent(token)}`,
      {},
      {
        preserveScroll: true,
        onError: () => setCompleted(previous),
        onFinish: () => setPending(false),
      }
    )
  }

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
          onChange={toggle}
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
    </li>
  )
}

function PublicRuralItem({
  rural,
  token,
  mapId,
  striped,
}: {
  rural: Rural
  token: string
  mapId: string
  striped: boolean
}) {
  const [completed, setCompleted] = useState(Boolean(rural.isComplete))
  const [pending, setPending] = useState(false)

  useEffect(() => {
    setCompleted(Boolean(rural.isComplete))
  }, [rural.isComplete])

  function toggle() {
    if (pending) return
    const previous = completed
    const next = !previous
    setCompleted(next)
    setPending(true)
    router.put(
      `/view/map/${mapId}/rural/${rural.id}/toggle-complete?t=${encodeURIComponent(token)}`,
      {},
      {
        preserveScroll: true,
        onError: () => setCompleted(previous),
        onFinish: () => setPending(false),
      }
    )
  }

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
          onChange={toggle}
          className="mt-0.5 h-6 w-6 shrink-0 rounded text-slate-700 disabled:opacity-60"
        />
        <div className="flex min-w-0 max-w-full flex-col gap-0.5">
          <span className={`min-w-0 wrap-break-word ${completed ? 'line-through' : ''}`}>
            {rural.description}
          </span>
          <RuralMeta rural={rural} />
        </div>
      </div>
      <RuralExternalLinks rural={rural} />
    </li>
  )
}

function PublicMap({ map, imageUrl, token }: PublicMapProps) {
  const [messageToServant, setMessageToServant] = useState(map?.messageToServant ?? '')

  useEffect(() => {
    if (!map || !token) return
    if (messageToServant === (map.messageToServant ?? '')) return
    const timer = window.setTimeout(() => {
      router.put(
        `/view/map/${map.id}/messages/to-servant?t=${encodeURIComponent(token)}`,
        { message: messageToServant },
        { preserveScroll: true }
      )
    }, 1500)
    return () => window.clearTimeout(timer)
  }, [messageToServant, map, token])

  if (!map || !token) {
    return (
      <div className="mx-auto my-6 flex max-w-3xl items-center rounded-lg bg-red-600 p-4 text-white sm:p-6">
        <ExclamationTriangleIcon className="mr-6 h-14 w-14 shrink-0" aria-hidden />
        <div>
          <Head title="Territory Map" />
          <h1 className="mb-2 text-2xl font-bold">Invalid Map Link</h1>
          <p>Please contact your territory servant for a new link.</p>
        </div>
      </div>
    )
  }

  const rurals = map.rurals ?? []

  return (
    <>
      <div className="fixed top-0 w-full">
        <div className="bg-slate-700"></div>
        <header className="flex items-center justify-between gap-2 bg-white px-4 py-2 shadow-md sm:px-6 sm:py-4">
          <div className="overflow-x-scroll">
            <h1 className="whitespace-nowrap text-2xl font-bold text-slate-800 sm:text-3xl">
              {`${map.name} (${map.code})`}
            </h1>
          </div>
        </header>
      </div>
      <main className="mt-[48px] h-full flex-1 overflow-y-scroll sm:mt-[68px]">
        <Head title={`${map.name} (${map.code})`} />
        <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
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
          {map.messageFromServant && (
            <div className="flex flex-col gap-4 rounded-lg border border-amber-500 bg-amber-200 p-4 shadow-md sm:p-6 md:mb-6 md:flex-row md:gap-6">
              <InformationCircleIcon className="h-10 w-10 text-slate-800 sm:h-14 sm:w-14" aria-hidden />
              <div>
                <h2 className="mb-2 text-lg font-bold text-slate-800 sm:text-xl">
                  Message from Territory Servant
                </h2>
                <p className="whitespace-pre-wrap">{map.messageFromServant}</p>
              </div>
            </div>
          )}
          <Card externalHeading noContentPadding heading="Streets">
            {(map.streets ?? []).length == 0 ? (
              <p className="px-4 py-6 text-center text-sm sm:px-6">No Streets on this Map</p>
            ) : (
              <>
                <ul className="overflow-hidden rounded-lg">
                  {(map.streets ?? []).map((street, index) => (
                    <PublicStreetItem
                      key={street.id}
                      street={street}
                      token={token}
                      mapId={map.id}
                      striped={index % 2 === 1}
                    />
                  ))}
                </ul>
                <div className="flex items-center gap-2 px-4 py-4 text-sm text-slate-600 sm:px-6">
                  <QuestionMarkCircleIcon aria-hidden className="h-6 w-6 shrink-0" />
                  <span>
                    Check off the streets as you work the map. This will allow the Territory Servant
                    to see what&apos;s left to do and will help others if the map is passed on to
                    them half-completed.
                  </span>
                </div>
              </>
            )}
          </Card>
          {rurals.length > 0 && (
            <Card externalHeading noContentPadding heading="Rurals">
              <ul className="overflow-hidden rounded-lg">
                {rurals.map((rural, index) => (
                  <PublicRuralItem
                    key={rural.id}
                    rural={rural}
                    token={token}
                    mapId={map.id}
                    striped={index % 2 === 1}
                  />
                ))}
              </ul>
              <div className="flex items-center gap-2 px-4 py-4 text-sm text-slate-600 sm:px-6">
                <QuestionMarkCircleIcon aria-hidden className="h-6 w-6 shrink-0" />
                <span>
                  Check off the rurals as you work the map. Use the map buttons to open each
                  location.
                </span>
              </div>
            </Card>
          )}
          {(map.doNotCalls ?? []).length > 0 && (
            <Table
              heading="Do Not Calls"
              columns={dncTableColumns}
              data={map.doNotCalls ?? []}
              noDataMessage="No Do Not Calls on this Map"
              shadow
            />
          )}
          <Card externalHeading heading="Message to Territory Servant">
            <textarea
              rows={5}
              value={messageToServant}
              onChange={(e) => setMessageToServant(e.target.value)}
              className="w-full resize-y rounded-lg border border-slate-400 px-2 py-1 focus:border-slate-700 focus:ring-slate-700 sm:px-3 sm:py-2"
              placeholder="Leave a message for the Territory Servant about this map..."
            />
            <p className="mt-4 flex items-center gap-2 text-sm text-slate-600">
              <QuestionMarkCircleIcon aria-hidden className="h-6 w-6 shrink-0" />
              <span>
                Leave messages for your Territory Servant about this map e.g. new developments,
                necessary adjustments to streets etc.
              </span>
            </p>
          </Card>
          <Table
            heading="Activity"
            columns={activityTableColumns}
            data={map.activities ?? []}
            noDataMessage="No Activity on this Map"
            shadow
          />
        </div>
        <footer className="py-4 text-center text-xs text-slate-600 sm:py-6">
          <span>{map.congregation?.name} Territory</span>
        </footer>
      </main>
    </>
  )
}

PublicMap.layout = (page: React.ReactNode) => page
export default PublicMap
