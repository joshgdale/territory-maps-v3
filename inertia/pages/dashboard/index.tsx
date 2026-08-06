import { CheckIcon, EllipsisHorizontalIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { InformationCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { Head, Link, useForm } from '@inertiajs/react'
import { format, parseISO } from 'date-fns'
import { useState } from 'react'
import {
  Button,
  Card,
  ColumnLayout,
  Panel,
  Select,
  TextArea,
} from '~/components/ui'
import { formatDate } from '~/lib/format'
import {
  type Activity,
  type MapSummary,
  type NextMapToHandOut,
  type WhatsNewItem,
  type WorkingNote,
  type WorkingNoteColour,
} from '~/lib/types'
import {
  WORKING_NOTE_COLOUR_CLASS,
  WORKING_NOTE_COLOUR_OPTIONS,
} from '~/lib/working_note_colours'
import { withAppLayout } from '~/layouts/app'

interface DashboardProps {
  workingNotes: WorkingNote[]
  overdueMaps: Activity[]
  mapsWithMessages: MapSummary[]
  nextMapsToHandOut: NextMapToHandOut[]
  whatsNew: WhatsNewItem[]
}

function WorkingNotePanel({
  note,
  isOpen,
  onClose,
  onClosed,
}: {
  note?: WorkingNote
  isOpen: boolean
  onClose: () => void
  onClosed: () => void
}) {
  const isEdit = Boolean(note)
  const [isDeleting, setIsDeleting] = useState(false)
  const {
    data,
    setData,
    post,
    put,
    processing,
    errors,
    delete: destroy,
  } = useForm({
    content: note?.content ?? '',
    colour: (note?.colour ?? 'GRAY') as WorkingNoteColour,
  })

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (isEdit && note) {
      put(`/working-note/${note.id}`, { onSuccess: () => onClose() })
      return
    }
    post('/working-note', { onSuccess: () => onClose() })
  }

  function remove() {
    if (!note) return
    destroy(`/working-note/${note.id}`, { onSuccess: () => onClose() })
  }

  return (
    <Panel
      isOpen={isOpen}
      close={onClose}
      onClosed={onClosed}
      title={isDeleting ? 'Delete Working Note' : isEdit ? 'Update Working Note' : 'New Working Note'}
      footerSpaceClass={isDeleting ? 'justify-between' : isEdit ? 'justify-between' : 'justify-end'}
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
            <Button intent="primary" type="submit" hasIcon form="working-note-form" loading={processing}>
              <CheckIcon aria-hidden className="mr-2 h-5 w-5" />
              <span>Update</span>
            </Button>
          </>
        ) : (
          <Button intent="primary" type="submit" hasIcon form="working-note-form" loading={processing}>
            <CheckIcon aria-hidden className="mr-2 h-5 w-5" />
            <span>Create</span>
          </Button>
        )
      }
    >
      {isDeleting ? (
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 rounded-full bg-red-100 p-4">
            <QuestionMarkCircleIcon className="h-16 w-16 text-red-600" aria-hidden />
          </div>
          <h3 className="pb-4 text-2xl font-bold">Delete Working Note</h3>
          <p>
            Are you sure you want to permanently delete this working note?
            <br />
            This action cannot be undone.
          </p>
        </div>
      ) : (
        <form id="working-note-form" onSubmit={submit} className="space-y-4">
          <TextArea
            label="Content"
            name="content"
            value={data.content}
            onChange={(e) => setData('content', e.target.value)}
            required
            error={errors.content}
            rows={15}
          />
          <p className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <QuestionMarkCircleIcon aria-hidden className="h-6 w-6 shrink-0" />
            <span>
              Create rich map links with tokens using the map code.
              <br />
              {'Use the format: {map CODE}. e.g. {map OC-01}'}
            </span>
          </p>
          <Select
            label="Colour"
            name="colour"
            options={WORKING_NOTE_COLOUR_OPTIONS}
            defaultOption={data.colour}
            value={data.colour}
            onChange={(option) => setData('colour', (option?.option ?? 'GRAY') as WorkingNoteColour)}
            error={errors.colour}
          >
            {({ option }) => ({
              button: (
                <div className="flex items-center">
                  <div className={`mr-2 h-5 w-5 ${WORKING_NOTE_COLOUR_CLASS[option.option as WorkingNoteColour]}`} />
                  <span>{option.option}</span>
                </div>
              ),
              option: (
                <div className="flex items-center">
                  <div className={`mr-2 h-5 w-5 ${WORKING_NOTE_COLOUR_CLASS[option.option as WorkingNoteColour]}`} />
                  <span>{option.option}</span>
                </div>
              ),
            })}
          </Select>
        </form>
      )}
    </Panel>
  )
}

function Dashboard({
  workingNotes,
  overdueMaps,
  mapsWithMessages,
  nextMapsToHandOut,
  whatsNew,
}: DashboardProps) {
  const [panel, setPanel] = useState<'create' | WorkingNote | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)

  function openPanel(next: 'create' | WorkingNote) {
    setPanel(next)
    setPanelOpen(true)
  }

  function closePanel() {
    setPanelOpen(false)
  }

  function handlePanelClosed() {
    setPanel(null)
  }

  return (
    <>
      <Head title="Dashboard" />

      {whatsNew.length > 0 && (
        <div className="mb-4 flex flex-col gap-4 rounded-lg border border-violet-500 bg-violet-200 p-4 shadow-md sm:mb-6 sm:p-6 md:flex-row md:gap-6">
          <InformationCircleIcon
            className="h-10 w-10 shrink-0 text-slate-800 sm:h-14 sm:w-14"
            aria-hidden
          />
          <div className="min-w-0 flex-1 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 sm:text-xl">What's New</h2>
            {whatsNew.map((item) => (
              <div key={item.id}>
                <p className="whitespace-pre-wrap">{item.content}</p>
                <p className="mt-2 text-xs text-slate-600">
                  {format(parseISO(item.addedAt), 'dd/MM/yyyy')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <ColumnLayout>
        <ColumnLayout.Column>
          <Card
            heading="Working Notes"
            renderHeadingRight={
              <button
                type="button"
                title="New Working Note"
                className="inline-flex items-center rounded-lg bg-slate-700 px-2 py-1.5 text-white transition-colors hover:bg-slate-600"
                onClick={() => openPanel('create')}
              >
                <PlusIcon aria-hidden className="h-5 w-5" />
              </button>
            }
          >
            <div className="space-y-4">
              {workingNotes.map((note) => (
                <div
                  key={note.id}
                  className={`relative rounded-lg p-4 sm:p-6 ${WORKING_NOTE_COLOUR_CLASS[note.colour]}`}
                >
                  <button
                    type="button"
                    title="Manage Working Note"
                    className={`absolute right-0 top-0 rounded-lg px-3 py-2 transition-all hover:brightness-90 ${WORKING_NOTE_COLOUR_CLASS[note.colour]}`}
                    onClick={() => openPanel(note)}
                  >
                    <EllipsisHorizontalIcon className="h-6 w-6" aria-hidden />
                  </button>
                  <p
                    className="notes mr-6 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: note.formattedContent ?? note.content }}
                  />
                  <p className="-mb-2 -mr-2 mt-4 text-right text-xs sm:-mb-3 sm:-mr-3">
                    {format(parseISO(note.lastUpdated), 'dd/MM/yyyy HH:mm')}
                  </p>
                </div>
              ))}
              {workingNotes.length == 0 && <p>No working notes to display</p>}
            </div>
          </Card>
        </ColumnLayout.Column>
        <ColumnLayout.Column>
          <Card heading="Overdue Maps">
            <div className="space-y-1">
              {overdueMaps.map((activity) => (
                <Link
                  href={`/maps/${activity.map?.id ?? activity.mapId}`}
                  key={activity.id}
                  className="-mx-2 flex items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-slate-100 sm:-mx-3 sm:px-3 sm:py-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span>
                      {activity.map?.name ?? 'Map'} ({activity.map?.code ?? '—'})
                    </span>
                    <span>•</span>
                    <span className="text-sm">Out: {formatDate(activity.outDate)}</span>
                    {activity.publisher && (
                      <>
                        <span>•</span>
                        <span className="text-sm">Publisher: {activity.publisher}</span>
                      </>
                    )}
                  </div>
                </Link>
              ))}
              {overdueMaps.length == 0 && <p>No maps have been out longer than 4 months</p>}
            </div>
            {overdueMaps.length != 0 && (
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                <QuestionMarkCircleIcon aria-hidden className="h-6 w-6 shrink-0" />
                <span>A map is overdue when it&apos;s been out for 4 months or more.</span>
              </div>
            )}
          </Card>

          <Card heading="Maps with Messages">
            <div className="space-y-1">
              {mapsWithMessages.map((map) => (
                <Link
                  href={`/maps/${map.id}`}
                  key={map.id}
                  className="-mx-2 flex items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-slate-100 sm:-mx-3 sm:px-3 sm:py-3"
                >
                  <div className="flex max-w-full items-center gap-2 whitespace-nowrap">
                    <span>
                      {map.name} ({map.code})
                    </span>
                    <span className="hidden md:block">•</span>
                    <span className="hidden truncate text-sm md:block">{map.messageToServant}</span>
                  </div>
                </Link>
              ))}
              {mapsWithMessages.length == 0 && <p>No maps have messages</p>}
            </div>
            {mapsWithMessages.length != 0 && (
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                <QuestionMarkCircleIcon aria-hidden className="h-6 w-6 shrink-0" />
                <span>Maps show here when a message has been left by the assigned Brother.</span>
              </div>
            )}
          </Card>

          <Card heading="Next Maps To Hand Out">
            <div className="space-y-1">
              {nextMapsToHandOut.map((map) => (
                <Link
                  href={`/maps/${map.id}?s=-inDate`}
                  key={map.id}
                  className="-mx-2 flex items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-slate-100 sm:-mx-3 sm:px-3 sm:py-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span>
                      {map.name} ({map.code})
                    </span>
                    {map.lastInDate && (
                      <>
                        <span>•</span>
                        <span className="text-sm">Last in: {formatDate(map.lastInDate)}</span>
                      </>
                    )}
                    {!map.lastInDate && (
                      <>
                        <span>•</span>
                        <span className="text-sm">Never assigned</span>
                      </>
                    )}
                  </div>
                </Link>
              ))}
              {nextMapsToHandOut.length === 0 && (
                <p>No maps currently available to hand out</p>
              )}
            </div>
            {nextMapsToHandOut.length !== 0 && (
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                <QuestionMarkCircleIcon aria-hidden className="h-6 w-6 shrink-0" />
                <span>
                  These are available maps whose last brought-in date is furthest in the past.
                </span>
              </div>
            )}
          </Card>
        </ColumnLayout.Column>
      </ColumnLayout>

      {panel !== null && (
        <WorkingNotePanel
          note={panel === 'create' ? undefined : panel}
          isOpen={panelOpen}
          onClose={closePanel}
          onClosed={handlePanelClosed}
        />
      )}
    </>
  )
}

Dashboard.layout = (page: React.ReactNode) => withAppLayout(page, 'Dashboard')
export default Dashboard
