import Map from '#models/map'
import DocumentService from '#services/document_service'
import PdfGenService from '#services/pdf_gen_service'
import { DeleteNonCompliantRecordsValidator } from '#validators/documents'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import drive from '@adonisjs/drive/services/main'
import { timingSafeEqual } from 'node:crypto'
import { format, isAfter, isBefore } from 'date-fns'
import env from '#start/env'

@inject()
export default class DocumentsController {
  constructor(
    private pdf: PdfGenService,
    private documents: DocumentService
  ) {}

  async index({ auth, inertia }: HttpContext) {
    const [{ ok: canDownload }, current, previous, maps, recordsManagement] = await Promise.all([
      this.pdf.checkHealth(),
      this.documents.getServiceYear({ previous: false }),
      this.documents.getServiceYear({ previous: true }),
      Map.query()
        .where('congregationNumber', auth.user!.number)
        .orderBy('code')
        .select('id', 'name', 'code'),
      this.documents.getNonCompliantRecords(auth.user!.number),
    ])

    return inertia.render('documents/index', {
      canDownload,
      currentServiceYear: current.serviceYearString,
      previousServiceYear: previous.serviceYearString,
      maps: maps.map((map) => ({ id: map.id, name: map.name, code: map.code })),
      recordsManagement,
    })
  }

  async deleteNonCompliantRecords({ auth, request, response, session }: HttpContext) {
    await request.validateUsing(DeleteNonCompliantRecordsValidator)
    await this.documents.deleteNonCompliantRecords(auth.user!.number)
    session.flash('success', 'Non-compliant records permanently deleted')
    return response.redirect().toRoute('documents.index')
  }

  async exportS13({ auth, request, response }: HttpContext) {
    const previous = request.qs().previousYear === 'true'
    const year = await this.documents.getServiceYear({ previous })
    const maps = await Map.query()
      .where('congregationNumber', auth.user!.number)
      .orderBy('code')
      .preload('activities', (q) => q.orderBy('outDate'))
    const data = {
      congregation: { name: auth.user!.name, number: auth.user!.number },
      serviceYear: year.serviceYearString,
      maps: maps.map((map) => ({
        code: map.code,
        lastCompleted: '',
        activities: map.activities
          .filter(
            (a) =>
              (isAfter(a.outDate.toJSDate(), year.startOfServiceYear) &&
                isBefore(a.outDate.toJSDate(), year.endOfServiceYear)) ||
              (a.inDate &&
                isAfter(a.inDate.toJSDate(), year.startOfServiceYear) &&
                isBefore(a.inDate.toJSDate(), year.endOfServiceYear))
          )
          .map((a) => ({
            publisher: a.publisher,
            outDate: format(a.outDate.toJSDate(), 'dd/MM/yy'),
            inDate: a.inDate ? format(a.inDate.toJSDate(), 'dd/MM/yy') : '',
          })),
      })),
    }
    for (const entry of data.maps) {
      entry.lastCompleted = entry.activities.filter((a) => a.inDate).at(-1)?.inDate ?? ''
    }
    const jobId = this.pdf.createJob(data)
    const buffer = await this.pdf.triggerGeneration({ request, template: 's-13', jobId })
    return response
      .header('Content-Type', 'application/pdf')
      .header(
        'Content-Disposition',
        `attachment; filename="${year.serviceYearString} Territory Assignment Record.pdf"`
      )
      .send(buffer)
  }

  async exportS12({ auth, params, request, response }: HttpContext) {
    const map = await Map.query()
      .where('id', params.id)
      .where('congregationNumber', auth.user!.number)
      .firstOrFail()
    const imageUrl = map.imageName
      ? await drive.use('spaces').getUrl(`uploads/${auth.user!.number}/${map.imageName}`)
      : ''
    const jobId = this.pdf.createJob({ locality: auth.user!.name, terrNo: map.code, imageUrl })
    const buffer = await this.pdf.triggerGeneration({ request, template: 's-12', jobId })
    return response
      .header('Content-Type', 'application/pdf')
      .header('Content-Disposition', `attachment; filename="${map.code} Territory Map Card.pdf"`)
      .send(buffer)
  }

  async exportDncWorksheet({ auth, request, response }: HttpContext) {
    const worksheet = await this.documents.getDncWorksheetData(auth.user!.number)
    const jobId = this.pdf.createJob(worksheet)
    const buffer = await this.pdf.triggerGeneration({
      request,
      template: 'dnc-worksheet',
      jobId,
    })
    return response
      .header('Content-Type', 'application/pdf')
      .header(
        'Content-Disposition',
        `attachment; filename="Do Not Calls Worksheet ${worksheet.serviceYear}.pdf"`
      )
      .send(buffer)
  }

  renderTemplate({ request, params, response, view }: HttpContext) {
    const token = request.qs().t
    const expected = env.get('GOTENBERG_SECRET')
    if (typeof token !== 'string' || token.length !== expected.length) {
      return response.unauthorized('Invalid token')
    }

    const tokenBuf = Buffer.from(token)
    const expectedBuf = Buffer.from(expected)
    if (!timingSafeEqual(tokenBuf, expectedBuf)) {
      return response.unauthorized('Invalid token')
    }

    if (!['s-12', 's-13', 'dnc-worksheet'].includes(params.template)) {
      return response.notFound('Template not found')
    }

    const job = this.pdf.getJob(params.jobId)
    if (!job) {
      return response.notFound('Job not found')
    }

    return view.render(`pages/pdf/${params.template}`, job.data as Record<string, unknown>)
  }
}
