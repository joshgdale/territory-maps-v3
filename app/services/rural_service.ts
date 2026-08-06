import Map from '#models/map'
import Rural from '#models/rural'
import { nanoid } from '#config/database'
import { inject } from '@adonisjs/core'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

@inject()
export default class RuralService {
  async getRural(p: { congNumber: string; mapId: string; ruralId: string }) {
    await Map.query().where('id', p.mapId).where('congregationNumber', p.congNumber).firstOrFail()
    return Rural.query().where('id', p.ruralId).where('mapId', p.mapId).firstOrFail()
  }

  async getRuralWithSecurityToken(p: {
    mapId: string
    securityToken: string
    ruralId: string
  }) {
    await Map.query()
      .where('id', p.mapId)
      .andWhereHas('congregation', (q) => q.where('securityToken', p.securityToken))
      .firstOrFail()
    return Rural.query().where('id', p.ruralId).where('mapId', p.mapId).firstOrFail()
  }

  async addRuralToMap(p: {
    congNumber: string
    mapId: string
    latitude: number
    longitude: number
    what3words: string
    description: string
  }) {
    const map = await Map.query()
      .where('id', p.mapId)
      .where('congregationNumber', p.congNumber)
      .firstOrFail()

    return Rural.create({
      id: nanoid(),
      mapId: map.id,
      latitude: p.latitude,
      longitude: p.longitude,
      what3words: normalizeWhat3Words(p.what3words),
      description: p.description,
      isComplete: false,
    })
  }

  async updateRural(p: {
    congNumber: string
    mapId: string
    ruralId: string
    latitude: number
    longitude: number
    what3words: string
    description: string
  }) {
    const rural = await this.getRural(p)
    rural.merge({
      latitude: p.latitude,
      longitude: p.longitude,
      what3words: normalizeWhat3Words(p.what3words),
      description: p.description,
    })
    await rural.save()
    return rural
  }

  async deleteRural(p: { congNumber: string; mapId: string; ruralId: string }) {
    await (await this.getRural(p)).delete()
  }

  async toggleRuralComplete(p: { congNumber: string; mapId: string; ruralId: string }) {
    const rural = await this.getRural(p)
    rural.isComplete = !rural.isComplete
    await rural.save()
    return rural
  }

  async toggleCompleteWithSecurityToken(p: {
    mapId: string
    securityToken: string
    ruralId: string
  }) {
    const rural = await this.getRuralWithSecurityToken(p)
    rural.isComplete = !rural.isComplete
    await rural.save()
    return rural
  }

  async clearRuralStatusByMapId(p: { mapId: string; trx?: TransactionClientContract }) {
    await Rural.query({ client: p.trx }).where('mapId', p.mapId).update({ isComplete: false })
  }
}

export function normalizeWhat3Words(value: string) {
  return value.trim().replace(/^\/+/, '')
}
