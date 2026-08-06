import {
  CheckCircleIcon,
  DocumentArrowDownIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { Head, Link as InertiaLink, useForm } from '@inertiajs/react'
import { useMemo, useState } from 'react'
import { Button, Card, ColumnLayout, DownloadLink, Input, Switch } from '~/components/ui'
import { type BasicMap, type RecordsManagement } from '~/lib/types'
import { withAppLayout } from '~/layouts/app'

interface DocumentsProps {
  canDownload: boolean
  currentServiceYear: string
  previousServiceYear: string
  maps: BasicMap[]
  recordsManagement: RecordsManagement
}

function PdfServiceUnavailable() {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-red-500 bg-red-300 p-4 sm:p-6 md:flex-row md:gap-6">
      <ExclamationTriangleIcon className="h-10 w-10 sm:h-12 sm:w-12" aria-hidden />
      <div>
        <h2 className="mb-2 text-base font-bold sm:text-lg">PDF Services Unavailable</h2>
        <p>
          There seems to be a problem with Territory Maps&apos; PDF generation services.
          <br />
          Please try again later.
        </p>
      </div>
    </div>
  )
}

function S13({
  canDownload,
  currentServiceYear,
  previousServiceYear,
}: {
  canDownload: boolean
  currentServiceYear: string
  previousServiceYear: string
}) {
  return (
    <Card heading="S-13 (Territory Assignment Record)">
      {canDownload ? (
        <>
          <div className="flex flex-col items-start gap-2">
            <DownloadLink
              intent="outline"
              url="/documents/export/s-13"
              fileName="S-13 Current Service Year"
            >
              <DocumentArrowDownIcon className="mr-2 h-5 w-5" aria-hidden />
              <span>{`Current Service Year (${currentServiceYear})`}</span>
            </DownloadLink>
            <DownloadLink
              intent="outline"
              url="/documents/export/s-13?previousYear=true"
              fileName="S-13 Previous Service Year"
            >
              <DocumentArrowDownIcon className="mr-2 h-5 w-5" aria-hidden />
              <span>{`Previous Service Year (${previousServiceYear})`}</span>
            </DownloadLink>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <QuestionMarkCircleIcon aria-hidden className="h-6 w-6 shrink-0" />
            <span>The S-13 form can be given to the CO when he visits.</span>
          </div>
        </>
      ) : (
        <PdfServiceUnavailable />
      )}
    </Card>
  )
}

function DncWorksheet({ canDownload }: { canDownload: boolean }) {
  return (
    <Card heading="Do Not Calls Worksheet">
      {canDownload ? (
        <>
          <DownloadLink
            intent="outline"
            url="/documents/export/dnc-worksheet"
            fileName="Do Not Calls Worksheet"
          >
            <DocumentArrowDownIcon className="mr-2 h-5 w-5" aria-hidden />
            <span>Download Worksheet</span>
          </DownloadLink>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <QuestionMarkCircleIcon aria-hidden className="h-6 w-6 shrink-0" />
            <span>
              Lists Do Not Calls not worked this service year, grouped by map type, oldest first.
              Print and tick as you work them.
            </span>
          </div>
        </>
      ) : (
        <PdfServiceUnavailable />
      )}
    </Card>
  )
}

function S12({ canDownload, maps }: { canDownload: boolean; maps: BasicMap[] }) {
  const [query, setQuery] = useState('')
  const filteredMaps = useMemo(() => {
    const q = query.toLowerCase()
    return maps.filter(
      (map) => map.name.toLowerCase().includes(q) || map.code.toLowerCase().includes(q)
    )
  }, [maps, query])

  return (
    <Card heading="S-12 (Territory Map Card)">
      {canDownload ? (
        <>
          {maps.length !== 0 && (
            <>
              <Input
                label="Search"
                name="query"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <ul className="mt-4 max-h-64 divide-y divide-slate-300 overflow-scroll rounded-lg border border-slate-400">
                {filteredMaps.map((map) => (
                  <li
                    key={map.id}
                    className="group flex items-center justify-between px-4 py-2 transition-colors hover:bg-slate-100"
                  >
                    <span>{`${map.name} (${map.code})`}</span>
                    <DownloadLink
                      url={`/documents/export/s-12/${map.id}`}
                      fileName={`S-12 - ${map.code}`}
                      className="flex rounded-lg border border-slate-700 py-1 pl-3 pr-4 text-sm transition-colors hover:bg-slate-700 hover:text-white"
                    >
                      <DocumentArrowDownIcon className="mr-2 h-5 w-5" aria-hidden />
                      <span>Download</span>
                    </DownloadLink>
                  </li>
                ))}
                {filteredMaps.length === 0 && (
                  <p className="p-2 text-center">{`No Maps match "${query}"`}</p>
                )}
              </ul>
            </>
          )}
          {maps.length === 0 && <p className="p-2 text-center">No Maps to export</p>}
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <div>
              <QuestionMarkCircleIcon aria-hidden className="h-6 w-6" />
            </div>
            <span>
              The S-12 card can be printed out for use by those who are less comfortable with a
              digital system.
            </span>
          </div>
        </>
      ) : (
        <PdfServiceUnavailable />
      )}
    </Card>
  )
}

function RecordsManagementCard({
  recordsManagement,
  currentServiceYear,
  previousServiceYear,
}: {
  recordsManagement: RecordsManagement
  currentServiceYear: string
  previousServiceYear: string
}) {
  const form = useForm({ confirm: false })
  const isCompliant = recordsManagement.recordCount === 0

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!form.data.confirm) {
      form.setError('confirm', 'You must confirm this action')
      return
    }
    form.post('/documents/records/delete-non-compliant', {
      preserveScroll: true,
      onSuccess: () => {
        form.setData('confirm', false)
      },
    })
  }

  return (
    <Card heading="Records Management">
      {isCompliant ? (
        <div className="flex flex-col gap-4 rounded-lg border border-slate-400 bg-slate-100 p-4 sm:p-6 md:flex-row md:gap-6">
          <CheckCircleIcon className="h-10 w-10 shrink-0 text-slate-700 sm:h-12 sm:w-12" aria-hidden />
          <div>
            <h2 className="mb-1 text-base font-bold sm:text-lg">Records are compliant</h2>
            <p className="text-sm text-slate-700">
              No assignment records fall outside the allowed retention period.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 rounded-lg border border-amber-500 bg-amber-200 p-4 shadow-md sm:p-6 md:flex-row md:gap-6">
            <ExclamationTriangleIcon
              className="h-10 w-10 shrink-0 text-slate-800 sm:h-12 sm:w-12"
              aria-hidden
            />
            <div>
              <h2 className="mb-1 text-base font-bold text-slate-800 sm:text-lg">
                Non-compliant records found
              </h2>
              <p className="text-sm text-slate-800">
                {recordsManagement.recordCount} non-compliant{' '}
                {recordsManagement.recordCount === 1 ? 'record' : 'records'} on{' '}
                {recordsManagement.mapCount}{' '}
                {recordsManagement.mapCount === 1 ? 'map' : 'maps'}.
              </p>
            </div>
          </div>

          <ul className="mt-4 max-h-64 divide-y divide-slate-300 overflow-scroll rounded-lg border border-slate-400">
            {recordsManagement.maps.map((map) => (
              <li key={map.id}>
                <InertiaLink
                  href={`/maps/${map.id}?s=-inDate`}
                  className="flex items-center justify-between px-4 py-2 transition-colors hover:bg-slate-100"
                >
                  <span>{`${map.name} (${map.code})`}</span>
                  <span className="text-sm text-slate-600">View</span>
                </InertiaLink>
              </li>
            ))}
          </ul>

          <form onSubmit={submit} className="mt-4 flex flex-col items-end space-y-4">
            <Switch
              label="Yes, I want to permanently delete all non-compliant assignment records. This cannot be undone."
              name="confirm"
              required
              checked={form.data.confirm}
              onChange={(value) => form.setData('confirm', value)}
              error={form.errors.confirm}
            />
            <Button type="submit" intent="danger" hasIcon loading={form.processing}>
              <TrashIcon aria-hidden className="mr-2 h-5 w-5" />
              <span>Permanently Delete Non-Compliant Data</span>
            </Button>
          </form>
        </>
      )}
      <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
        <QuestionMarkCircleIcon aria-hidden className="h-6 w-6 shrink-0" />
        <span>
          Per the Shepherd Addendum, territory assignment records may only be kept for the current
          and previous service years ({previousServiceYear} and {currentServiceYear}). Compliance is
          based on the date a map was brought in.
        </span>
      </div>
    </Card>
  )
}

function Documents({
  canDownload,
  currentServiceYear,
  previousServiceYear,
  maps,
  recordsManagement,
}: DocumentsProps) {
  return (
    <>
      <Head title="Documents" />
      <ColumnLayout>
        <ColumnLayout.Column>
          <S13
            canDownload={canDownload}
            currentServiceYear={currentServiceYear}
            previousServiceYear={previousServiceYear}
          />
          <S12 canDownload={canDownload} maps={maps} />
        </ColumnLayout.Column>
        <ColumnLayout.Column>
          <DncWorksheet canDownload={canDownload} />
          <RecordsManagementCard
            recordsManagement={recordsManagement}
            currentServiceYear={currentServiceYear}
            previousServiceYear={previousServiceYear}
          />
        </ColumnLayout.Column>
      </ColumnLayout>
    </>
  )
}

Documents.layout = (page: React.ReactNode) => withAppLayout(page, 'Documents')
export default Documents
