import RuralService from '#services/rural_service'
import { CreateRuralValidator, UpdateRuralValidator } from '#validators/rural'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class RuralsController {
  constructor(private rurals: RuralService) {}

  async store({ params, request, response, auth }: HttpContext) {
    const d = await request.validateUsing(CreateRuralValidator)
    await this.rurals.addRuralToMap({
      congNumber: auth.user!.number,
      mapId: params.id,
      ...d,
    })
    return response.redirect().toRoute('maps.show', { id: params.id })
  }

  async update({ params, request, response, auth }: HttpContext) {
    const d = await request.validateUsing(UpdateRuralValidator)
    await this.rurals.updateRural({
      congNumber: auth.user!.number,
      mapId: params.id,
      ruralId: params.ruralId,
      ...d,
    })
    return response.redirect().toRoute('maps.show', { id: params.id })
  }

  async destroy({ params, response, auth }: HttpContext) {
    await this.rurals.deleteRural({
      congNumber: auth.user!.number,
      mapId: params.id,
      ruralId: params.ruralId,
    })
    return response.redirect().toRoute('maps.show', { id: params.id })
  }

  async toggleComplete({ params, response, auth }: HttpContext) {
    await this.rurals.toggleRuralComplete({
      congNumber: auth.user!.number,
      mapId: params.id,
      ruralId: params.ruralId,
    })
    return response.redirect().toRoute('maps.show', { id: params.id })
  }

  async toggleCompleteWithSecurityToken({ params, request, response }: HttpContext) {
    const token = request.qs().t
    if (typeof token !== 'string' || !token) {
      return response.unauthorized('Missing security token')
    }
    await this.rurals.toggleCompleteWithSecurityToken({
      mapId: params.id,
      ruralId: params.ruralId,
      securityToken: token,
    })
    return response.redirect().back()
  }
}
