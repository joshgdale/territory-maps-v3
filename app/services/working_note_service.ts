import WorkingNote from '#models/working_note'
import MapModel from '#models/map'
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

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

@inject()
export default class WorkingNoteService {
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
    const codes = new Set<string>()
    for (const note of p.notes) {
      for (const token of note.content.match(/\{map (.*?)\}/gm) ?? []) {
        codes.add(token.slice(5, -1))
      }
    }

    const mapsByCode = new Map<string, { id: string; name: string; code: string }>()
    if (codes.size > 0) {
      const maps = await MapModel.query()
        .where('congregationNumber', p.congNumber)
        .whereIn('code', [...codes])
        .select('id', 'name', 'code')
      for (const map of maps) {
        mapsByCode.set(map.code, { id: map.id, name: map.name, code: map.code })
      }
    }

    return p.notes.map((note) => {
      const tokens = note.content.match(/\{map (.*?)\}/gm) ?? []
      let cursor = 0
      let formattedContent = ''

      for (const token of tokens) {
        const index = note.content.indexOf(token, cursor)
        formattedContent += escapeHtml(note.content.slice(cursor, index))

        const code = token.slice(5, -1)
        const map = mapsByCode.get(code)
        formattedContent += map
          ? `<a href="/maps/${encodeURIComponent(map.id)}">${escapeHtml(map.name)} (${escapeHtml(map.code)})</a>`
          : `<span class="error">MAP ${escapeHtml(code)} NOT FOUND</span>`

        cursor = index + token.length
      }

      formattedContent += escapeHtml(note.content.slice(cursor))

      return {
        id: note.id,
        content: note.content,
        colour: note.colour,
        lastUpdated: note.lastUpdated.toISO()!,
        congregationNumber: note.congregationNumber,
        formattedContent,
      }
    })
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
