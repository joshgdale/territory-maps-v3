import WorkingNoteService from '#services/working_note_service'
import { NewAndUpdateWorkingNoteValidator } from '#validators/working_note'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
@inject()
export default class WorkingNoteController {
  constructor(private notes: WorkingNoteService) {}
  async store({ request, response, auth }: HttpContext) { const data = await request.validateUsing(NewAndUpdateWorkingNoteValidator); await this.notes.createWorkingNote({ congNumber: auth.user!.number, ...data }); return response.redirect().toRoute('dashboard.index') }
  async update({ params, request, response, auth }: HttpContext) { const data = await request.validateUsing(NewAndUpdateWorkingNoteValidator); await this.notes.updateWorkingNote({ congNumber: auth.user!.number, id: params.id, ...data }); return response.redirect().toRoute('dashboard.index') }
  async destroy({ params, response, auth }: HttpContext) { await this.notes.deleteWorkingNote({ congNumber: auth.user!.number, id: params.id }); return response.redirect().toRoute('dashboard.index') }
}
