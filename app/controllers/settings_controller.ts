import Congregation from '#models/congregation'
import MapType from '#models/map_type'
import StreetCategory from '#models/street_category'
import { nanoid } from '#config/database'
import {
  AddMapTypeValidator,
  AddStreetCategoryValidator,
  RollSecurityTokenValidator,
  UpdateConfirmationMessageValidator,
  UpdateShareMessageValidator,
} from '#validators/settings'
import type { HttpContext } from '@adonisjs/core/http'

export default class SettingsController {
  async index({ auth, inertia }: HttpContext) {
    const congregation = auth.user!
    const [mapTypes, streetCategories] = await Promise.all([
      MapType.query().where('congregationNumber', congregation.number).preload('maps'),
      StreetCategory.query().where('congregationNumber', congregation.number).preload('streets'),
    ])

    return inertia.render('settings/index', {
      congregation: {
        number: congregation.number,
        name: congregation.name,
        shareMessage: congregation.shareMessage,
        broughtBackConfirmationMessage: congregation.broughtBackConfirmationMessage,
        securityToken: congregation.securityToken,
      },
      mapTypes: mapTypes.map((type) => ({
        ...type.serialize(),
        canDelete: type.maps.length === 0,
      })),
      streetCategories: streetCategories.map((category) => ({
        ...category.serialize(),
        canDelete: category.streets.length === 0,
      })),
    })
  }

  async updateShareMessage({ auth, request, response }: HttpContext) {
    const { message } = await request.validateUsing(UpdateShareMessageValidator)
    const congregation = await Congregation.findOrFail(auth.user!.number)
    congregation.shareMessage = message
    await congregation.save()
    return response.redirect().toRoute('settings.index')
  }

  async updateConfirmationMessage({ auth, request, response }: HttpContext) {
    const { message } = await request.validateUsing(UpdateConfirmationMessageValidator)
    const congregation = await Congregation.findOrFail(auth.user!.number)
    congregation.broughtBackConfirmationMessage = message
    await congregation.save()
    return response.redirect().toRoute('settings.index')
  }

  async addMapType({ auth, request, response }: HttpContext) {
    const { name } = await request.validateUsing(AddMapTypeValidator)
    await MapType.create({
      id: nanoid(),
      name,
      congregationNumber: auth.user!.number,
    })
    return response.redirect().toRoute('settings.index')
  }

  async deleteMapType({ auth, params, response }: HttpContext) {
    const mapType = await MapType.query()
      .where('congregationNumber', auth.user!.number)
      .where('id', params.id)
      .preload('maps')
      .firstOrFail()

    if (mapType.maps.length > 0) {
      return response.status(400).redirect().back()
    }

    await mapType.delete()
    return response.redirect().toRoute('settings.index')
  }

  async addStreetCategory({ auth, request, response }: HttpContext) {
    const { name } = await request.validateUsing(AddStreetCategoryValidator)
    await StreetCategory.create({
      id: nanoid(),
      name,
      congregationNumber: auth.user!.number,
    })
    return response.redirect().toRoute('settings.index')
  }

  async deleteStreetCategory({ auth, params, response }: HttpContext) {
    const category = await StreetCategory.query()
      .where('congregationNumber', auth.user!.number)
      .where('id', params.id)
      .preload('streets')
      .firstOrFail()

    if (category.streets.length > 0) {
      return response.status(400).redirect().back()
    }

    await category.delete()
    return response.redirect().toRoute('settings.index')
  }

  async rollSecurityToken({ auth, request, response, session }: HttpContext) {
    await request.validateUsing(RollSecurityTokenValidator)
    const congregation = await Congregation.findOrFail(auth.user!.number)
    congregation.securityToken = nanoid()
    await congregation.save()
    session.flash('success', 'Security token refreshed')
    return response.redirect().toRoute('settings.index')
  }
}
