import MapType from '#models/map_type'
import StreetCategory from '#models/street_category'
import MapService from '#services/map_service'
import { CreateMapValidator, UpdateMapMessageValidator, UpdateMapValidator } from '#validators/map'
import { inject } from '@adonisjs/core'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
@inject()
export default class MapsController {
  constructor(private maps: MapService) {}
  async index({ request, auth, inertia }: HttpContext) {
    const congNumber = auth.user!.number; const { s: sort = 'code', type, status } = request.qs()
    const [maps, mapTypes] = await Promise.all([this.maps.getAllMaps({ congNumber, sort, type, status }), MapType.query().where('congregationNumber', congNumber)])
    const limit = DateTime.now().minus({ months: 4 })
    return inertia.render('maps/index', { maps: maps.map(map => ({ ...map.serialize(), isOverdue: map.activities[0]?.status === 'OUT' && map.activities[0].outDate < limit })), mapTypes: mapTypes.map(t => t.serialize()), filters: { sort, type, status } })
  }
  async show({ params, request, auth, inertia }: HttpContext) {
    const congNumber = auth.user!.number; const { map, imageUrl } = await this.maps.getExtendedMapById({ congNumber, mapId: params.id })
    const shareableLink = await this.maps.getShareableLinkToMap({ request, mapId: map.id, congNumber })
    const [shareMessage, mapTypes, streetCategories] = await Promise.all([
      this.maps.getShareMessageToMap({ mapId: map.id, congNumber, link: shareableLink }),
      MapType.query().where('congregationNumber', congNumber),
      StreetCategory.query().where('congregationNumber', congNumber),
    ])
    return inertia.render('maps/show', {
      map: map.serialize(),
      imageUrl,
      mapTypes: mapTypes.map((t) => t.serialize()),
      streetCategories: streetCategories.map((c) => c.serialize()),
      isOverdue: map.activities[0]?.status === 'OUT' && map.activities[0].outDate < DateTime.now().minus({ months: 4 }),
      shareableLink,
      shareMessage,
    })
  }
  async store({ request, response, auth }: HttpContext) { const d = await request.validateUsing(CreateMapValidator); const map = await this.maps.createMap({ congNumber: auth.user!.number, ...d, image: d.image as unknown as MultipartFile }); return response.redirect().toRoute('maps.show', { id: map.id }) }
  async update({ params, request, response, auth }: HttpContext) { const d = await request.validateUsing(UpdateMapValidator); const map = await this.maps.updateMap({ congNumber: auth.user!.number, mapId: params.id, ...d, image: d.image as unknown as MultipartFile | undefined }); return response.redirect().toRoute('maps.show', { id: map.id }) }
  async destroy({ params, response, auth }: HttpContext) { await this.maps.deleteMap({ congNumber: auth.user!.number, mapId: params.id }); return response.redirect().toRoute('maps.index') }
  async messageFromServant({ params, request, response, auth }: HttpContext) { const { message } = await request.validateUsing(UpdateMapMessageValidator); await this.maps.updateMessageFromServant({ congNumber: auth.user!.number, mapId: params.id, message }); return response.redirect().toRoute('maps.show', { id: params.id }) }
  async deleteMessageFromServant({ params, response, auth }: HttpContext) { await this.maps.updateMessageFromServant({ congNumber: auth.user!.number, mapId: params.id, message: '' }); return response.redirect().toRoute('maps.show', { id: params.id }) }
  async deleteMessageToServant({ params, response, auth }: HttpContext) { await this.maps.updateMessageToServant({ congNumber: auth.user!.number, mapId: params.id, message: '' }); return response.redirect().toRoute('maps.show', { id: params.id }) }
}
