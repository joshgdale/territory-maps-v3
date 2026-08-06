import StreetService from '#services/street_service'
import { CreateStreetValidator, UpdateStreetValidator } from '#validators/street'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
@inject()
export default class StreetsController {
  constructor(private streets: StreetService) {}
  async store({ params, request, response, auth }: HttpContext) { const d = await request.validateUsing(CreateStreetValidator); await this.streets.addStreetToMap({ congNumber: auth.user!.number, mapId: params.id, ...d }); return response.redirect().toRoute('maps.show', { id: params.id }) }
  async update({ params, request, response, auth }: HttpContext) { const d = await request.validateUsing(UpdateStreetValidator); await this.streets.updateStreet({ congNumber: auth.user!.number, mapId: params.id, streetId: params.streetId, ...d }); return response.redirect().toRoute('maps.show', { id: params.id }) }
  async destroy({ params, response, auth }: HttpContext) { await this.streets.deleteStreet({ congNumber: auth.user!.number, mapId: params.id, streetId: params.streetId }); return response.redirect().toRoute('maps.show', { id: params.id }) }
  async toggleComplete({ params, response, auth }: HttpContext) { await this.streets.toggleStreetComplete({ congNumber: auth.user!.number, mapId: params.id, streetId: params.streetId }); return response.redirect().toRoute('maps.show', { id: params.id }) }
  async toggleCompleteWithSecurityToken({ params, request, response }: HttpContext) { await this.streets.toggleCompleteWithSecurityToken({ mapId: params.id, streetId: params.streetId, securityToken: request.qs().t }); return response.redirect().back() }
}
