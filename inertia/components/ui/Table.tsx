import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { router, usePage } from '@inertiajs/react'
import { format, isValid, parseISO } from 'date-fns'
import { type ReactNode } from 'react'
import { type ISelectOption } from './Select'
import { MultiSelect } from './MultiSelect'

export interface ITableColumn {
  label: string
  name: string
  isDate?: boolean
  selector?: (row: any) => any
  sortable?: boolean
  filterOptions?: ISelectOption[]
  widthClass?: string
}

export interface ITable {
  heading?: string
  renderHeadingRight?: ReactNode
  data: any[]
  columns: ITableColumn[]
  children?: ({
    row,
    searchParams,
  }: {
    row: any
    searchParams: URLSearchParams
  }) => {
    [key: string]: ReactNode
  }
  shadow?: boolean
  onRowClick?: (row: any) => void
  noDataMessage: string
  formatRow?: (row: any) => string
  onFilterChange?: (option: { column: string; options: ISelectOption[] }) => void
  sortLocally?: boolean
}

function useUrlSearchParams() {
  const { url } = usePage()
  return new URL(url, 'http://localhost').searchParams
}

export function Table(props: ITable) {
  const searchParams = useUrlSearchParams()
  const currentSort = searchParams.get('s')
  const pathname = new URL(usePage().url, 'http://localhost').pathname

  const someColumnsHaveFilters =
    props.columns.filter((c) => c.filterOptions).length == 0 ? false : true

  const sortedData = [...props.data]
  if (props.sortLocally !== false) {
    sortedData.sort((a, b) => {
      if (!currentSort) return 0

      const isDesc = currentSort[0] === '-'
      const currentSortName = isDesc ? currentSort.substring(1) : currentSort
      const column = props.columns.find((col) => col.name == currentSortName)

      if (!column?.selector) return 0

      const aRaw = column.selector(a)
      const bRaw = column.selector(b)

      // Empty values always sort last
      if (aRaw == null || aRaw === '') return bRaw == null || bRaw === '' ? 0 : 1
      if (bRaw == null || bRaw === '') return -1

      const aValue = typeof aRaw === 'string' ? aRaw : String(aRaw)
      const bValue = typeof bRaw === 'string' ? bRaw : String(bRaw)
      const result = aValue.localeCompare(bValue, undefined, {
        numeric: true,
        sensitivity: 'base',
      })

      return isDesc ? -result : result
    })
  }

  function onColumnSort(newSearchParams: string) {
    router.get(
      pathname,
      {
        ...Object.fromEntries(searchParams.entries()),
        s: newSearchParams,
      },
      { preserveState: true, preserveScroll: true }
    )
  }

  function onFilter(columnName: string, options: ISelectOption[]) {
    router.get(
      pathname,
      {
        ...Object.fromEntries(searchParams.entries()),
        [columnName]: options.map((o) => o.value).toString(),
      },
      { preserveState: true, preserveScroll: true }
    )
  }

  function getDefaultFilterOptions(columnName: string) {
    return Object.fromEntries(searchParams.entries())[columnName]
  }

  return (
    <div
      id={
        props.heading ? props.heading.toLocaleLowerCase().replace(' ', '_') : ''
      }
      className="scroll-mt-[92px]"
    >
      {(props.heading || props.renderHeadingRight) && (
        <div className="mb-2 flex items-center justify-between px-4 sm:mb-4 sm:px-6">
          {props.heading && (
            <h2 className="text-lg font-bold text-slate-800 sm:text-xl">{props.heading}</h2>
          )}
          {props.renderHeadingRight && props.renderHeadingRight}
        </div>
      )}
      {sortedData.length > 0 ? (
        <div className={`overflow-x-auto rounded-lg ${props.shadow && 'shadow-md'}`}>
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-slate-300 overflow-visible rounded-lg bg-white">
              <thead>
                <tr className="bg-slate-700 text-white">
                  {props.columns.map((column, i) => {
                    const identifier = column.name

                    let currentSortName = currentSort
                    if (currentSort && currentSort[0] === '-') {
                      currentSortName = currentSort.substring(1)
                    }

                    const isDesc = currentSort && currentSort[0] === '-' ? true : false

                    return (
                      <th
                        key={i}
                        scope="col"
                        className={`whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold ${column.widthClass}`}
                      >
                        {column.sortable ? (
                          <button
                            onClick={() =>
                              onColumnSort(
                                `${
                                  currentSort
                                    ? currentSortName === identifier
                                      ? isDesc
                                        ? ''
                                        : '-'
                                      : ''
                                    : ''
                                }${column.name}`
                              )
                            }
                            className="group inline-flex"
                          >
                            {column.label}
                            <span
                              className={`ml-3 flex-none rounded transition-colors ${
                                currentSortName == identifier
                                  ? 'bg-white text-slate-700 group-hover:bg-slate-200'
                                  : 'invisible rotate-180 text-slate-50 group-hover:visible group-focus:visible'
                              }`}
                            >
                              <ChevronDownIcon
                                className={`h-5 w-5 ${
                                  currentSortName == identifier && !isDesc && 'rotate-180'
                                }`}
                                aria-hidden="true"
                              />
                            </span>
                          </button>
                        ) : (
                          column.label
                        )}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {someColumnsHaveFilters && (
                  <tr>
                    {props.columns.map((column, i) => (
                      <td key={`filter-${i}`} className="relative overflow-visible align-top">
                        {column.filterOptions && (
                          <MultiSelect
                            name={`${column.name}-filter`}
                            options={column.filterOptions}
                            onChange={(options) => {
                              if (!options) return

                              props.onFilterChange
                                ? props.onFilterChange({
                                    column: column.name,
                                    options,
                                  })
                                : onFilter(column.name, options)
                            }}
                            defaultOptions={getDefaultFilterOptions(column.name)}
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                )}
                {sortedData.map((row, i) => (
                  <tr
                    key={i}
                    className={`transition-colors ${props.onRowClick && 'cursor-pointer'} ${
                      props.formatRow && props.formatRow(row)
                    }`}
                    onClick={() => props.onRowClick && props.onRowClick(row)}
                  >
                    {props.columns.map((column, j) => {
                      const isCustomField =
                        props.children &&
                        props.children({ row, searchParams }).hasOwnProperty(column.name)

                      const selector = column.selector ? column.selector(row) : null

                      return (
                        <td
                          key={j}
                          className="whitespace-nowrap py-6 pl-4 pr-3 text-sm font-medium sm:py-4"
                        >
                          {props.children && isCustomField
                            ? props.children({ row, searchParams })[column.name]
                            : column.isDate &&
                                typeof selector === 'string' &&
                                selector.length > 0 &&
                                isValid(parseISO(selector))
                              ? format(parseISO(selector), 'dd/MM/yyyy')
                              : selector}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div
          className={`flex w-full items-center justify-center rounded-lg bg-white py-8 ${
            props.shadow && 'shadow-md'
          }`}
        >
          <p className="text-sm">{props.noDataMessage}</p>
        </div>
      )}
    </div>
  )
}
