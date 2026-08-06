import { CheckIcon, PlusIcon } from '@heroicons/react/20/solid'
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChatBubbleBottomCenterTextIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { Head, router, useForm } from '@inertiajs/react'
import { add, isAfter, parseISO } from 'date-fns'
import { useMemo, useState } from 'react'
import {
  AppBarTools,
  Button,
  FileInput,
  Input,
  Panel,
  Select,
  Table,
  type ITableColumn,
} from '~/components/ui'
import { type MapFilters, type MapListItem, type MapType } from '~/lib/types'
import { withAppLayout } from '~/layouts/app'

interface MapsIndexProps {
  maps: MapListItem[]
  mapTypes: MapType[]
  filters: MapFilters
}

const tableColumns: ITableColumn[] = [
  {
    label: 'Code',
    name: 'code',
    selector: (row) => row.code,
    sortable: true,
    widthClass: 'w-28',
  },
  {
    label: 'Name',
    name: 'name',
    selector: (row) => row.name,
    sortable: true,
    widthClass: 'w-80',
  },
  {
    label: 'Type',
    name: 'type',
    selector: (row) => row.type?.name,
    sortable: true,
    widthClass: 'w-52',
  },
  {
    label: 'Status',
    name: 'status',
    selector: (row) => row.activities[0]?.status,
    sortable: true,
  },
  {
    label: 'Last Taken Out',
    name: 'lastOut',
    isDate: true,
    selector: (row) => row.activities?.[0]?.outDate ?? null,
    sortable: true,
  },
  {
    label: 'Last Brought In',
    name: 'lastIn',
    isDate: true,
    selector: (row) => {
      const value = row.activities?.[0]?.inDate ?? row.activities?.[1]?.inDate
      return typeof value === 'string' ? value : value ?? null
    },
    sortable: true,
  },
  {
    label: 'Publisher',
    name: 'publisher',
    selector: (row) => row.activities[0]?.publisher,
    sortable: true,
  },
  {
    label: 'Notes',
    name: 'notes',
    selector: (row) => row.activities[0]?.notes,
  },
]

function CreateMapPanel({
  mapTypes,
  isOpen,
  onClose,
}: {
  mapTypes: MapType[]
  isOpen: boolean
  onClose: () => void
}) {
  const typeOptions = useMemo(
    () => mapTypes.map((t) => ({ value: t.id, option: t.name })),
    [mapTypes]
  )
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    code: '',
    type: mapTypes[0]?.id ?? '',
    image: null as File | null,
  })

  function submit(event: React.FormEvent) {
    event.preventDefault()
    post('/maps', {
      forceFormData: true,
      onSuccess: () => {
        reset()
        onClose()
      },
    })
  }

  return (
    <Panel
      isOpen={isOpen}
      close={onClose}
      onClosed={() => {}}
      title="New Map"
      footerSpaceClass="justify-end"
      footer={
        <Button intent="primary" type="submit" hasIcon form="create-map-form" loading={processing}>
          <CheckIcon aria-hidden className="mr-2 h-5 w-5" />
          <span>Create</span>
        </Button>
      }
    >
      <form id="create-map-form" onSubmit={submit} className="space-y-4">
        <Input
          label="Name"
          name="name"
          value={data.name}
          onChange={(e) => setData('name', e.target.value)}
          required
          error={errors.name}
        />
        <Input
          label="Code"
          name="code"
          value={data.code}
          onChange={(e) => setData('code', e.target.value)}
          required
          error={errors.code}
        />
        <Select
          label="Type"
          name="type"
          options={typeOptions}
          emptyOptionsMessage="No Map Types"
          value={data.type}
          onChange={(option) => setData('type', option?.value ?? '')}
          required
          error={errors.type}
        />
        <FileInput
          label="Image"
          name="image"
          required
          error={errors.image}
          onFileChange={(file) => setData('image', file)}
        />
      </form>
    </Panel>
  )
}

function MapsIndex({ maps, mapTypes }: MapsIndexProps) {
  const [createOpen, setCreateOpen] = useState(false)

  const columns = useMemo(() => {
    return tableColumns.map((col) => {
      if (col.name == 'type') {
        return {
          ...col,
          filterOptions: mapTypes.map((t) => ({ value: t.id, option: t.name })),
        }
      }
      if (col.name == 'status') {
        return {
          ...col,
          filterOptions: [
            { option: 'In', value: 'IN' },
            { option: 'Out', value: 'OUT' },
          ],
        }
      }
      return col
    })
  }, [mapTypes])

  return (
    <>
      <Head title="Maps" />
      <AppBarTools>
        <Button hasIcon onClick={() => setCreateOpen(true)}>
          <PlusIcon aria-hidden className="mr-2 h-5 w-5" />
          <span>New</span>
        </Button>
      </AppBarTools>

      <Table
        data={maps}
        columns={columns}
        onRowClick={(row) => router.visit(`/maps/${row.id}?s=-inDate`)}
        noDataMessage="No Maps to show. Create one using the New button at the top right."
        formatRow={(row) =>
          row.activities[0]?.status == 'IN'
            ? 'text-green-700 hover:text-green-900 bg-green-100 hover:bg-green-200'
            : row.activities[0]?.status == 'OUT' &&
                isAfter(new Date(), add(parseISO(row.activities[0]?.outDate), { months: 4 }))
              ? 'text-red-700 hover:text-red-900 bg-red-100 hover:bg-red-200'
              : row.activities[0]?.status == 'OUT'
                ? 'text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200'
                : 'hover:bg-slate-100'
        }
        shadow
      >
        {({ row }) => ({
          status: (
            <div className="flex gap-4 sm:gap-6">
              {row.activities[0]?.status == 'IN' ? (
                <div className="flex">
                  <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
                  <span>In</span>
                </div>
              ) : row.activities[0]?.status == 'OUT' ? (
                <div className="flex">
                  <ArrowUpTrayIcon className="mr-2 h-5 w-5" />
                  <span>Out</span>
                </div>
              ) : null}
              {row.activities[0]?.status == 'OUT' &&
                isAfter(new Date(), add(parseISO(row.activities[0]?.outDate), { months: 4 })) && (
                  <div className="flex">
                    <ClockIcon className="mr-2 h-5 w-5" />
                    <span>Over 4 months</span>
                  </div>
                )}
              {row.messageToServant && (
                <div className="flex">
                  <ChatBubbleBottomCenterTextIcon className="mr-2 h-5 w-5" />
                  <span>Message</span>
                </div>
              )}
            </div>
          ),
        })}
      </Table>

      <CreateMapPanel
        mapTypes={mapTypes}
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </>
  )
}

MapsIndex.layout = (page: React.ReactNode) => withAppLayout(page, 'Maps')
export default MapsIndex
