import Congregation from '#models/congregation'
import { LoginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'

export default class LoginController {
  show({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }
  async store({ request, response, auth }: HttpContext) {
    const { congNumber, password } = await request.validateUsing(LoginValidator)
    try { await auth.use('web').login(await Congregation.verifyCredentials(congNumber, password)) }
    catch { throw new errors.E_VALIDATION_ERROR([{ field: 'congNumber', message: 'Invalid congregation number or password' }]) }
    return response.redirect().toRoute('dashboard.index')
  }
}
