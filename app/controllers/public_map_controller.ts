import MapService from '#services/map_service'
import { UpdateMapMessageValidator } from '#validators/map'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class PublicMapController {
  constructor(private maps: MapService) {}

  async show({ request, params, inertia }: HttpContext) {
    const token = typeof request.qs().t === 'string' ? request.qs().t : ''
    if (!token) {
      return inertia.render('public/map', { map: null, imageUrl: null, token: '' })
    }

    const { map, imageUrl } = await this.maps.getMapByIdWithSecurityToken({
      id: params.id,
      securityToken: token,
    })

    if (!map) {
      return inertia.render('public/map', { map: null, imageUrl: null, token })
    }

    // Explicit public DTO — never ship auth/settings fields even if model serialization changes
    const serialized = map.serialize()
    return inertia.render('public/map', {
      map: {
        ...serialized,
        congregation: map.congregation ? { name: map.congregation.name } : undefined,
      },
      imageUrl,
      token,
    })
  }

  async messageToServant({ request, params, response }: HttpContext) {
    const token = request.qs().t
    if (typeof token !== 'string' || !token) {
      return response.unauthorized('Missing security token')
    }

    const { message } = await request.validateUsing(UpdateMapMessageValidator)
    await this.maps.updateMessageToServantWithSecurityToken({
      mapId: params.id,
      securityToken: token,
      message,
    })
    return response.redirect().back()
  }
}
