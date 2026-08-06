import WorkingNote from '#models/working_note'
import MapService from '#services/map_service'
import { nanoid } from '#config/database'
import { inject } from '@adonisjs/core'

export type WorkingNoteColour = 'GRAY' | 'YELLOW' | 'GREEN' | 'ORANGE' | 'BLUE' | 'PURPLE' | 'PINK'

export type WorkingNoteDto = {
  id: string
  content: string
  colour: WorkingNoteColour
  lastUpdated: string
  congregationNumber: string
  formattedContent: string
}

@inject()
export default class WorkingNoteService {
  constructor(protected mapService: MapService) {}

  async getAllWorkingNotes(p: { congNumber: string }) {
    return WorkingNote.query()
      .where('congregationNumber', p.congNumber)
      .orderBy('lastUpdated', 'desc')
  }

  async getAllFormattedWorkingNotes(p: { congNumber: string }) {
    return this.formatWorkingNotes({
      congNumber: p.congNumber,
      notes: await this.getAllWorkingNotes(p),
    })
  }

  async getWorkingNoteById(p: { congNumber: string; id: string }) {
    return WorkingNote.query()
      .where('congregationNumber', p.congNumber)
      .where('id', p.id)
      .firstOrFail()
  }

  async formatWorkingNotes(p: {
    congNumber: string
    notes: WorkingNote[]
  }): Promise<WorkingNoteDto[]> {
    return Promise.all(
      p.notes.map(async (note) => {
        let formattedContent = note.content
        for (const token of note.content.match(/\{map (.*?)\}/gm) ?? []) {
          const code = token.slice(5, -1)
          const map = await this.mapService
            .getBasicMapByCode({ congNumber: p.congNumber, code })
            .catch(() => null)
          formattedContent = formattedContent.replace(
            token,
            map
              ? `<a href="/maps/${map.id}">${map.name} (${map.code})</a>`
              : `<span class="error">MAP ${code} NOT FOUND</span>`
          )
        }

        return {
          id: note.id,
          content: note.content,
          colour: note.colour,
          lastUpdated: note.lastUpdated.toISO()!,
          congregationNumber: note.congregationNumber,
          formattedContent,
        }
      })
    )
  }

  async createWorkingNote(p: {
    congNumber: string
    content: string
    colour: WorkingNoteColour
  }) {
    return WorkingNote.create({
      id: nanoid(),
      congregationNumber: p.congNumber,
      content: p.content,
      colour: p.colour,
    })
  }

  async updateWorkingNote(p: {
    congNumber: string
    id: string
    content: string
    colour: WorkingNoteColour
  }) {
    const note = await this.getWorkingNoteById(p)
    note.merge({ content: p.content, colour: p.colour })
    await note.save()
    return note
  }

  async deleteWorkingNote(p: { congNumber: string; id: string }) {
    await (await this.getWorkingNoteById(p)).delete()
  }
}
