import DoNotCallService from '#services/do_not_call_service'
import { CreateDoNotCallValidator, UpdateDoNotCallValidator } from '#validators/do_not_call'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
@inject()
export default class DoNotCallController {
  constructor(private dncs: DoNotCallService) {}
  async store({ params, request, response, auth }: HttpContext) { const d = await request.validateUsing(CreateDoNotCallValidator); await this.dncs.addDncToMap({ congNumber: auth.user!.number, mapId: params.id, ...d }); return response.redirect().toRoute('maps.show', { id: params.id }) }
  async update({ params, request, response, auth }: HttpContext) { const d = await request.validateUsing(UpdateDoNotCallValidator); await this.dncs.updateDnc({ congNumber: auth.user!.number, mapId: params.id, dncId: params.dncId, ...d }); return response.redirect().toRoute('maps.show', { id: params.id }) }
  async destroy({ params, response, auth }: HttpContext) { await this.dncs.deleteDnc({ congNumber: auth.user!.number, mapId: params.id, dncId: params.dncId }); return response.redirect().toRoute('maps.show', { id: params.id }) }
}
