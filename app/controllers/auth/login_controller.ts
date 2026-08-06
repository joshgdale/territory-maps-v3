import Congregation from '#models/congregation'
import { LoginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import limiter from '@adonisjs/limiter/services/main'
import { errors } from '@vinejs/vine'

export default class LoginController {
  show({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }

  async store({ request, response, auth }: HttpContext) {
    const { congNumber, password } = await request.validateUsing(LoginValidator)

    const loginLimiter = limiter.multi([
      {
        key: `login_ip_${request.ip()}`,
        requests: 20,
        duration: '1 min',
        blockDuration: '15 mins',
      },
      {
        key: `login_ip_cong_${request.ip()}_${congNumber}`,
        requests: 5,
        duration: '1 min',
        blockDuration: '20 mins',
      },
    ])

    const [throttleError, user] = await loginLimiter.penalize(() =>
      Congregation.verifyCredentials(congNumber, password)
    )

    if (throttleError) {
      throw new errors.E_VALIDATION_ERROR([
        {
          field: 'congNumber',
          message: `Too many login attempts. Try again in ${throttleError.response.availableIn} seconds`,
        },
      ])
    }

    await auth.use('web').login(user)
    return response.redirect().toRoute('dashboard.index')
  }
}
