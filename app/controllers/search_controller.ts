import DoNotCallService from '#services/do_not_call_service'
import MapService from '#services/map_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
@inject()
export default class SearchController {
  constructor(private maps: MapService, private dncs: DoNotCallService) {}
  async index({ request, auth, inertia }: HttpContext) {
    const query = request.qs().q as string | undefined
    if (!query) return inertia.render('search/index', { query: '', mapResults: [], dncResults: [] })
    const [mapResults, dncResults] = await Promise.all([this.maps.searchMaps({ congNumber: auth.user!.number, query }), this.dncs.searchDoNotCalls({ congNumber: auth.user!.number, query })])
    return inertia.render('search/index', { query, mapResults, dncResults: dncResults.map(d => d.serialize()) })
  }
}
