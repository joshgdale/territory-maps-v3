import MapService from '#services/map_service'
import WhatsNewService from '#services/whats_new_service'
import WorkingNoteService from '#services/working_note_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class DashboardController {
  constructor(
    private maps: MapService,
    private notes: WorkingNoteService,
    private whatsNew: WhatsNewService
  ) {}

  async index({ auth, inertia }: HttpContext) {
    const congNumber = auth.user!.number
    const [workingNotes, overdueMaps, mapsWithMessages, nextMapsToHandOut, whatsNew] =
      await Promise.all([
        this.notes.getAllFormattedWorkingNotes({ congNumber }),
        this.maps.getAllOverdueMaps({ congNumber }),
        this.maps.getAllMapsWithMessages({ congNumber }),
        this.maps.getNextMapsToHandOut({ congNumber, limit: 5 }),
        this.whatsNew.getActiveAnnouncements(),
      ])

    return inertia.render('dashboard/index', {
      workingNotes,
      overdueMaps: overdueMaps.map((m) => m.serialize()),
      mapsWithMessages: mapsWithMessages.map((m) => m.serialize()),
      nextMapsToHandOut,
      whatsNew,
    })
  }
}
