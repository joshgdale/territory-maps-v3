import ActivityService from '#services/activity_service'
import RuralService from '#services/rural_service'
import StreetService from '#services/street_service'
import { CreateActivityValidator, UpdateActivityValidator } from '#validators/activity'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ActivityController {
  constructor(
    private activities: ActivityService,
    private streets: StreetService,
    private rurals: RuralService
  ) {}

  async store({ params, request, response, auth }: HttpContext) {
    const d = await request.validateUsing(CreateActivityValidator)
    await this.activities.addActivityToMap({
      congNumber: auth.user!.number,
      mapId: params.id,
      ...d,
    })
    return response.redirect().toRoute('maps.show', { id: params.id })
  }

  async update({ params, request, response, auth, session }: HttpContext) {
    const d = await request.validateUsing(UpdateActivityValidator)
    const { activity, justBroughtBack } = await this.activities.updateActivity({
      congNumber: auth.user!.number,
      mapId: params.id,
      activityId: params.activityId,
      ...d,
    })
    if (justBroughtBack) {
      await this.streets.clearStreetStatusByMapId({ mapId: activity.mapId })
      await this.rurals.clearRuralStatusByMapId({ mapId: activity.mapId })
      const { encoded } = await this.activities.getBroughtBackConfirmationMessage({
        congNumber: auth.user!.number,
        mapId: activity.mapId,
      })
      session.flash({
        justBroughtBack: true,
        confirmationMessage: encoded,
        confirmationPublisher: activity.publisher,
      })
    }
    return response.redirect().toRoute('maps.show', { id: params.id })
  }

  async destroy({ params, response, auth }: HttpContext) {
    await this.activities.deleteActivity({
      congNumber: auth.user!.number,
      mapId: params.id,
      activityId: params.activityId,
    })
    return response.redirect().toRoute('maps.show', { id: params.id })
  }
}
