import { nanoid } from '#config/database'
import env from '#start/env'
import { inject } from '@adonisjs/core'
import app from '@adonisjs/core/services/app'
import type { HttpRequest } from '@adonisjs/core/http'
import { Chromiumly, System, UrlConverter } from 'chromiumly'
import type { PageProperties } from 'chromiumly/dist/chromium/interfaces/converter.types.js'
import { format } from 'date-fns'
import { readFile, unlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

interface Job {
  id: string
  data: unknown
}

function configureGotenberg() {
  const endpoint = env.get('GOTENBERG_URL') ?? env.get('GOTENBERG_ENDPOINT')
  if (!endpoint) {
    throw new Error('Set GOTENBERG_URL (or GOTENBERG_ENDPOINT) in the environment')
  }
  Chromiumly.configure({
    endpoint,
    username: env.get('GOTENBERG_API_BASIC_AUTH_USERNAME'),
    password: env.get('GOTENBERG_API_BASIC_AUTH_PASSWORD'),
  })
  return endpoint
}

let jobQueue: Job[] = []

@inject()
export default class PdfGenService {
  async checkHealth() {
    try {
      configureGotenberg()
      await System.getHealth()
      return { ok: true }
    } catch (error) {
      const message =
        error instanceof Error
          ? [error.message, error.cause instanceof Error ? error.cause.message : null]
              .filter(Boolean)
              .join(': ')
          : 'Cannot connect to Gotenberg instance'
      return { ok: false, error: message }
    }
  }

  createJob(data: unknown) {
    const id = nanoid()
    jobQueue.push({ id, data })
    return id
  }

  getJob(id: string) {
    return jobQueue.find((job) => job.id === id)
  }

  completeJob(id: string) {
    jobQueue = jobQueue.filter((job) => job.id !== id)
  }

  async triggerGeneration(p: {
    request: HttpRequest
    template: 's-12' | 's-13' | 'dnc-worksheet'
    jobId: string
  }) {
    let dncFooterPath: string | undefined
    try {
      configureGotenberg()
      const converter = new UrlConverter()
      const url = `${this.appUrlForGotenberg(p.request)}/api/pdf/${p.template}/${p.jobId}?t=${encodeURIComponent(env.get('GOTENBERG_SECRET'))}`

      if (p.template === 'dnc-worksheet') {
        const footerTemplate = await readFile(
          app.makePath('resources/views/pages/pdf/dnc-worksheet-footer.html'),
          'utf8'
        )
        dncFooterPath = join(tmpdir(), `dnc-worksheet-footer-${p.jobId}.html`)
        await writeFile(
          dncFooterPath,
          footerTemplate.replaceAll('{{printedAt}}', format(new Date(), 'dd/MM/yyyy'))
        )
      }

      return await converter.convert({
        url,
        properties: this.getTemplateProperties(p),
        ...(p.template === 's-13'
          ? { footer: app.makePath('resources/views/pages/pdf/s-13-footer.html') }
          : {}),
        ...(dncFooterPath ? { footer: dncFooterPath } : {}),
      })
    } finally {
      if (dncFooterPath) {
        await unlink(dncFooterPath).catch(() => {})
      }
      this.completeJob(p.jobId)
    }
  }

  /**
   * URL Gotenberg (often in Docker) uses to fetch the HTML template from this app.
   * Rewrites loopback hosts to host.docker.internal so the container can reach the host.
   */
  private appUrlForGotenberg(request: HttpRequest) {
    const configured = env.get('APP_URL')?.replace(/\/$/, '')
    const base = configured || `${request.protocol()}://${request.host()}`
    try {
      const parsed = new URL(base)
      if (['localhost', '127.0.0.1', '::1', '0.0.0.0'].includes(parsed.hostname)) {
        parsed.hostname = 'host.docker.internal'
      }
      return parsed.origin
    } catch {
      return base
    }
  }

  getTemplateProperties(p: { template: 's-12' | 's-13' | 'dnc-worksheet' }): PageProperties {
    if (p.template === 's-12') {
      return {
        size: { height: 4.13, width: 5.83 },
        margins: { left: 0.4, right: 0.4, top: 0.3, bottom: 0.3 },
        scale: 1,
      }
    }
    // A4 portrait — S-13 and DNC worksheet
    return {
      size: { height: 11.7, width: 8.27 },
      margins: { left: 0.475, right: 0.475, top: 0.78, bottom: 0.5 },
      scale: 0.8,
    }
  }
}
