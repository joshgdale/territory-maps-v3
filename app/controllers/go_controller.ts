import type { HttpContext } from '@adonisjs/core/http'

export default class GoController {
  index({ request, response }: HttpContext) {
    const { m, t } = request.qs()
    if (typeof m === 'string' && typeof t === 'string' && m && t) {
      return response.redirect().toRoute('public.map', { id: m }, { qs: { t } })
    }
    // Invalid/missing share link params → login, not authenticated dashboard
    return response.redirect().toRoute('login.show')
  }
}
