import DoNotCall from '#models/do_not_call'
import Map from '#models/map'
import { inject } from '@adonisjs/core'
import { nanoid } from '#config/database'
import { DateTime } from 'luxon'

function toDateTime(value: Date | DateTime): DateTime {
  return DateTime.isDateTime(value) ? value : DateTime.fromJSDate(value)
}

@inject()
export default class DoNotCallService {
  async searchDoNotCalls(p: { congNumber: string; query: string }) {
    return DoNotCall.query()
      .select('id', 'address', 'mapId')
      .whereHas('map', (q) => q.where('congregationNumber', p.congNumber))
      .whereILike('address', `%${p.query}%`)
  }

  async addDncToMap(p: {
    congNumber: string
    mapId: string
    address: string
    lastCalled: Date | DateTime
  }) {
    const map = await Map.query()
      .where('id', p.mapId)
      .where('congregationNumber', p.congNumber)
      .firstOrFail()
    return DoNotCall.create({
      id: nanoid(),
      mapId: map.id,
      address: p.address,
      lastCalled: toDateTime(p.lastCalled),
    })
  }

  async getDnc(p: { congNumber: string; mapId: string; dncId: string }) {
    await Map.query().where('id', p.mapId).where('congregationNumber', p.congNumber).firstOrFail()
    return DoNotCall.query().where('id', p.dncId).where('mapId', p.mapId).firstOrFail()
  }

  async updateDnc(p: {
    congNumber: string
    mapId: string
    dncId: string
    address: string
    lastCalled: Date | DateTime
  }) {
    const dnc = await this.getDnc(p)
    dnc.merge({ address: p.address, lastCalled: toDateTime(p.lastCalled) })
    await dnc.save()
    return dnc
  }

  async deleteDnc(p: { congNumber: string; mapId: string; dncId: string }) {
    await (await this.getDnc(p)).delete()
  }
}
