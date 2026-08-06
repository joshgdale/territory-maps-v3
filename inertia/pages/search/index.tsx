import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  MapIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'
import { Head, Link, useForm } from '@inertiajs/react'
import { Card, Button, Input } from '~/components/ui'
import { type DoNotCall, type MapSummary } from '~/lib/types'
import { withAppLayout } from '~/layouts/app'

interface SearchProps {
  query: string
  mapResults: MapSummary[]
  dncResults: DoNotCall[]
}

function SearchPage({ query, mapResults, dncResults }: SearchProps) {
  const { data, setData, get, processing } = useForm({ q: query })

  function submit(event: React.FormEvent) {
    event.preventDefault()
    get('/search', { preserveState: true })
  }

  return (
    <>
      <Head title="Search" />
      <div className="space-y-4 sm:space-y-6">
        <Card>
          <form onSubmit={submit} className="flex items-end gap-4 sm:gap-6">
            <Input
              className="flex-1"
              autoFocus
              label="Search for a map or an address"
              name="q"
              type="search"
              value={data.q}
              onChange={(e) => setData('q', e.target.value)}
            />
            <Button type="submit" iconOnly className="px-3" loading={processing}>
              <MagnifyingGlassIcon className="my-1 h-5 w-5" aria-hidden />
              <span className="sr-only">Search</span>
            </Button>
          </form>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <QuestionMarkCircleIcon aria-hidden className="h-6 w-6 shrink-0" />
            <span>
              You can search for a map by its name, code, the last name it was assigned to, or any
              notes on that activity.
            </span>
          </div>
        </Card>

        {query && (
          <Card heading="Search Results">
            {mapResults.length == 0 && dncResults.length == 0 ? (
              <p>No results found.</p>
            ) : (
              <div className="space-y-2">
                {mapResults.length > 0 && (
                  <div>
                    <h2 className="mb-2 inline-flex items-center gap-2 font-semibold text-slate-800 sm:text-lg">
                      <MapIcon className="h-6 w-6" aria-hidden />
                      <span>Maps</span>
                    </h2>
                    <div className="-mx-2 space-y-1 sm:-mx-3">
                      {mapResults.map((result) => (
                        <Link
                          href={`/maps/${result.id}?s=-inDate`}
                          key={result.id}
                          className="group flex items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-slate-100 sm:px-3 sm:py-3"
                        >
                          <span>{`${result.name} (${result.code})`}</span>
                          {result.activities?.[0]?.status && (
                            <span
                              className={`flex rounded-lg px-3 py-1.5 text-sm transition-colors ${
                                result.activities[0].status == 'OUT'
                                  ? 'bg-amber-500/50 group-hover:bg-amber-500/70'
                                  : 'bg-green-500/50 group-hover:bg-green-500/70'
                              }`}
                            >
                              {result.activities[0].status == 'OUT' ? (
                                <>
                                  <ArrowUpTrayIcon className="mr-2 h-5 w-5" aria-hidden />
                                  <span>Out</span>
                                </>
                              ) : (
                                <>
                                  <ArrowDownTrayIcon className="mr-2 h-5 w-5" aria-hidden />
                                  <span>In</span>
                                </>
                              )}
                            </span>
                          )}
                          {result.activities?.[0]?.publisher && (
                            <span className="text-sm">
                              Publisher: {result.activities[0].publisher}
                            </span>
                          )}
                          {result.activities?.[0]?.notes && (
                            <>
                              <span>•</span>
                              <span className="text-sm">Notes: {result.activities[0].notes}</span>
                            </>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {dncResults.length > 0 && (
                  <div>
                    <h2 className="mb-2 inline-flex items-center gap-2 font-semibold text-slate-800 sm:text-lg">
                      <MapIcon className="h-6 w-6" aria-hidden />
                      <span>Do Not Calls</span>
                    </h2>
                    <div className="-mx-2 sm:-mx-3">
                      {dncResults.map((result) => (
                        <Link
                          href={`/maps/${result.mapId}?s=-inDate#do_not_calls`}
                          key={result.id}
                          className="group flex items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-slate-100 sm:px-3 sm:py-3"
                        >
                          <span>{result.address}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}
      </div>
    </>
  )
}

SearchPage.layout = (page: React.ReactNode) => withAppLayout(page, 'Search')
export default SearchPage
