import PdfGenService from '#services/pdf_gen_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

@inject()
export default class HealthcheckController {
  constructor(private pdf: PdfGenService) {}

  async handle({ response }: HttpContext) {
    let dbOk = false
    try {
      await db.rawQuery('SELECT 1')
      dbOk = true
    } catch {
      dbOk = false
    }

    const gotenberg = await this.pdf.checkHealth()
    const ok = dbOk && gotenberg.ok
    const payload = {
      status: ok ? 'ok' : 'error',
      db: dbOk ? 'ok' : 'error',
      gotenberg: gotenberg.ok ? 'ok' : 'error',
      ...(gotenberg.ok ? {} : { gotenbergError: gotenberg.error }),
    }

    return ok ? response.ok(payload) : response.serviceUnavailable(payload)
  }
}
