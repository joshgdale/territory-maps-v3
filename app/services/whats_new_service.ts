import WhatsNew from '#models/whats_new'
import { nanoid } from '#config/database'
import { DateTime } from 'luxon'

export type WhatsNewDto = {
  id: string
  content: string
  addedAt: string
}

const DISPLAY_DAYS = 30

export default class WhatsNewService {
  async getActiveAnnouncements(): Promise<WhatsNewDto[]> {
    const cutoff = DateTime.now().minus({ days: DISPLAY_DAYS })
    const items = await WhatsNew.query()
      .where('addedAt', '>=', cutoff.toSQL()!)
      .orderBy('addedAt', 'desc')

    return items.map((item) => ({
      id: item.id,
      content: item.content,
      addedAt: item.addedAt.toISO()!,
    }))
  }

  async createAnnouncement(content: string) {
    return WhatsNew.create({
      id: nanoid(),
      content: content.trim(),
      addedAt: DateTime.now(),
    })
  }
}
