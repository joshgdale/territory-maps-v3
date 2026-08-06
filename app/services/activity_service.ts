import Activity from '#models/activity'
import Congregation from '#models/congregation'
import Map from '#models/map'
import { nanoid } from '#config/database'
import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'

function toDateTime(value: Date | DateTime): DateTime {
  return DateTime.isDateTime(value) ? value : DateTime.fromJSDate(value)
}

@inject()
export default class ActivityService {
  async addActivityToMap(p: {
    congNumber: string
    mapId: string
    inDate: Date | DateTime | null
    notes: string | null
    outDate: Date | DateTime
    publisher: string
  }) {
    const map = await Map.query()
      .where('id', p.mapId)
      .where('congregationNumber', p.congNumber)
      .firstOrFail()
    const inDate = p.inDate ? toDateTime(p.inDate) : null
    return Activity.create({
      id: nanoid(),
      mapId: map.id,
      outDate: toDateTime(p.outDate),
      inDate,
      publisher: p.publisher,
      notes: p.notes,
      status: inDate ? 'IN' : 'OUT',
    })
  }

  async getActivity(p: { congNumber: string; mapId: string; activityId: string }) {
    await Map.query().where('id', p.mapId).where('congregationNumber', p.congNumber).firstOrFail()
    return Activity.query().where('id', p.activityId).where('mapId', p.mapId).firstOrFail()
  }

  async updateActivity(p: {
    congNumber: string
    mapId: string
    activityId: string
    inDate: Date | DateTime | null
    notes: string | null
    outDate: Date | DateTime
    publisher: string
  }) {
    const activity = await this.getActivity(p)
    const justBroughtBack = !activity.inDate && !!p.inDate
    const inDate = p.inDate ? toDateTime(p.inDate) : null
    activity.merge({
      outDate: toDateTime(p.outDate),
      inDate,
      publisher: p.publisher,
      notes: p.notes,
      status: inDate ? 'IN' : 'OUT',
    })
    await activity.save()
    return { activity, justBroughtBack }
  }

  async deleteActivity(p: { congNumber: string; mapId: string; activityId: string }) {
    await (await this.getActivity(p)).delete()
  }

  async getBroughtBackConfirmationMessage(p: { congNumber: string; mapId: string }) {
    const [congregation, map] = await Promise.all([
      Congregation.findByOrFail('number', p.congNumber),
      Map.query().where('id', p.mapId).where('congregationNumber', p.congNumber).firstOrFail(),
    ])
    const raw = congregation.broughtBackConfirmationMessage
      .replace('{name}', map.name)
      .replace('{code}', map.code)
    return { raw, encoded: encodeURI(raw).replace(/\?/g, '%3F').replace(/&/g, '%26') }
  }
}
