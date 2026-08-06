import Activity from '#models/activity'
import Congregation from '#models/congregation'
import Map from '#models/map'
import MapType from '#models/map_type'
import { nanoid } from '#config/database'
import env from '#start/env'
import { inject } from '@adonisjs/core'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import drive from '@adonisjs/drive/services/main'
import { errors } from '@vinejs/vine'
import { DateTime } from 'luxon'

function isUniqueViolation(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'ER_DUP_ENTRY'
  )
}

function mapCodeTakenError() {
  return new errors.E_VALIDATION_ERROR([
    { field: 'code', message: 'Map code already in use', rule: 'unique' },
  ])
}

@inject()
export default class MapService {
  async assertMapTypeBelongsToCongregation(p: { congNumber: string; typeId: string }) {
    const mapType = await MapType.query()
      .where('id', p.typeId)
      .where('congregationNumber', p.congNumber)
      .first()
    if (!mapType) {
      throw new errors.E_VALIDATION_ERROR([
        { field: 'type', message: 'Invalid map type', rule: 'exists' },
      ])
    }
    return mapType
  }

  async createMap(p: {
    congNumber: string
    name: string
    code: string
    type: string
    image: MultipartFile
  }) {
    if (
      await Map.query().where('congregationNumber', p.congNumber).where('code', p.code).first()
    ) {
      throw mapCodeTakenError()
    }
    await this.assertMapTypeBelongsToCongregation({ congNumber: p.congNumber, typeId: p.type })
    if (!p.image.extname) throw new Error('Uploaded file has no extension')
    const imageName = `file-${nanoid()}.${p.image.extname}`
    await p.image.moveToDisk(`uploads/${p.congNumber}/${imageName}`, 'spaces')
    try {
      return await Map.create({
        id: nanoid(),
        name: p.name,
        code: p.code,
        typeId: p.type,
        imageName,
        congregationNumber: p.congNumber,
      })
    } catch (error) {
      await drive
        .use('spaces')
        .delete(`uploads/${p.congNumber}/${imageName}`)
        .catch(() => undefined)
      if (isUniqueViolation(error)) throw mapCodeTakenError()
      throw error
    }
  }

  async updateMap(p: {
    congNumber: string
    mapId: string
    name: string
    code: string
    type: string
    image?: MultipartFile
  }) {
    const map = await Map.query()
      .where('congregationNumber', p.congNumber)
      .where('id', p.mapId)
      .firstOrFail()
    if (
      map.code !== p.code &&
      (await Map.query().where('congregationNumber', p.congNumber).where('code', p.code).first())
    ) {
      throw mapCodeTakenError()
    }
    await this.assertMapTypeBelongsToCongregation({ congNumber: p.congNumber, typeId: p.type })

    const previousImageName = map.imageName
    let imageName = map.imageName
    let uploadedNewImage = false

    if (p.image) {
      if (!p.image.extname) throw new Error('Uploaded file has no extension')
      imageName = `file-${nanoid()}.${p.image.extname}`
      await p.image.moveToDisk(`uploads/${p.congNumber}/${imageName}`, 'spaces')
      uploadedNewImage = true
    }

    try {
      map.merge({ name: p.name, code: p.code, typeId: p.type, imageName })
      await map.save()
    } catch (error) {
      if (uploadedNewImage && imageName) {
        await drive
          .use('spaces')
          .delete(`uploads/${p.congNumber}/${imageName}`)
          .catch(() => undefined)
      }
      if (isUniqueViolation(error)) throw mapCodeTakenError()
      throw error
    }

    if (uploadedNewImage && previousImageName && previousImageName !== imageName) {
      await drive
        .use('spaces')
        .delete(`uploads/${p.congNumber}/${previousImageName}`)
        .catch(() => undefined)
    }

    return map
  }
  async deleteMap(p: { congNumber: string; mapId: string }) {
    const map = await Map.query().where('congregationNumber', p.congNumber).where('id', p.mapId).firstOrFail()
    if (map.imageName) await drive.use('spaces').delete(`uploads/${p.congNumber}/${map.imageName}`).catch(() => undefined)
    await map.delete()
  }
  async getExtendedMapById(p: { congNumber: string; mapId: string }) {
    const map = await Map.query()
      .where('congregationNumber', p.congNumber)
      .where('id', p.mapId)
      .preload('activities', (q) => q.orderBy('outDate', 'desc'))
      .preload('doNotCalls', (q) => q.orderBy('lastCalled', 'desc'))
      .preload('streets', (q) => q.preload('categories'))
      .preload('rurals')
      .firstOrFail()
    return {
      map,
      imageUrl: map.imageName
        ? await drive.use('spaces').getUrl(`uploads/${p.congNumber}/${map.imageName}`)
        : null,
    }
  }
  async getShareableLinkToMap(p: { mapId: string; congNumber: string }) {
    const c = await Congregation.findByOrFail('number', p.congNumber)
    const base = env.get('APP_URL').replace(/\/$/, '')
    return `${base}/go?m=${p.mapId}&t=${encodeURIComponent(c.securityToken)}`
  }
  async getShareMessageToMap(p: { mapId: string; congNumber: string; link: string }) {
    const [c, map] = await Promise.all([Congregation.findByOrFail('number', p.congNumber), this.getBasicMapById(p)])
    return encodeURI((c.shareMessage || '').replaceAll('{name}', map.name).replaceAll('{code}', map.code).replaceAll('{link}', p.link)).replace(/\?/g, '%3F').replace(/&/g, '%26')
  }
  async getBasicMapById(p: { congNumber: string; mapId: string }) { return Map.query().where('congregationNumber', p.congNumber).where('id', p.mapId).firstOrFail() }
  async getBasicMapByCode(p: { congNumber: string; code: string }) { return Map.query().where('congregationNumber', p.congNumber).where('code', p.code).firstOrFail() }
  async getAllMaps(p: { congNumber: string; sort: string; type?: string; status?: string }) {
    const desc = p.sort?.startsWith('-'); const column = desc ? p.sort.slice(1) : p.sort
    const query = Map.query().where('congregationNumber', p.congNumber)
    if (p.type) query.whereIn('typeId', p.type.split(','))
    if (['name', 'code'].includes(column)) query.orderBy(column, desc ? 'desc' : 'asc')
    const maps = await query.preload('type').preload('activities', q => q.orderBy('outDate', 'desc'))
    return p.status ? maps.filter(m => p.status!.split(',').includes(m.activities[0]?.status)) : maps
  }
  async getAllOverdueMaps(p: { congNumber: string }) {
    return Activity.query()
      .whereHas('map', (q) => q.where('congregationNumber', p.congNumber))
      .where('status', 'OUT')
      .where('outDate', '<=', DateTime.now().minus({ months: 4 }).toSQLDate()!)
      .preload('map')
      .orderBy('outDate', 'asc')
  }

  /**
   * Maps currently available to hand out (latest activity is IN, or never assigned),
   * ordered by oldest last-brought-in date first.
   */
  async getNextMapsToHandOut(p: { congNumber: string; limit?: number }) {
    const limit = p.limit ?? 5
    const maps = await Map.query()
      .where('congregationNumber', p.congNumber)
      .preload('activities', (q) => q.orderBy('outDate', 'desc'))

    const available = maps
      .filter((map) => {
        const latest = map.activities[0]
        return !latest || latest.status === 'IN'
      })
      .map((map) => {
        const latest = map.activities[0]
        const lastInDate = latest?.inDate?.toISODate() ?? null
        return {
          id: map.id,
          name: map.name,
          code: map.code,
          lastInDate,
        }
      })
      .sort((a, b) => {
        // Never brought in → hand out first
        if (!a.lastInDate && !b.lastInDate) return a.code.localeCompare(b.code)
        if (!a.lastInDate) return -1
        if (!b.lastInDate) return 1
        return a.lastInDate.localeCompare(b.lastInDate)
      })

    return available.slice(0, limit)
  }

  async getAllMapsWithMessages(p: { congNumber: string }) {
    return Map.query().where('congregationNumber', p.congNumber).whereNot('messageToServant', '')
  }
  async searchMaps(p: { congNumber: string; query: string }) { const search = p.query.toLowerCase(); const maps = await Map.query().where('congregationNumber', p.congNumber).preload('activities', q => q.orderBy('outDate', 'desc')); return maps.filter(m => [m.name, m.code, m.activities[0]?.notes, m.activities[0]?.publisher].some(v => v?.toLowerCase().includes(search))).map(m => m.serialize()) }
  async updateMessageFromServant(p: { congNumber: string; mapId: string; message: string }) { const map = await this.getBasicMapById(p); map.messageFromServant = p.message; await map.save(); return map }
  async updateMessageToServant(p: { congNumber: string; mapId: string; message: string }) { const map = await this.getBasicMapById(p); map.messageToServant = p.message; await map.save(); return map }
  async updateMessageToServantWithSecurityToken(p: { mapId: string; securityToken: string; message: string }) { const map = await Map.query().where('id', p.mapId).andWhereHas('congregation', q => q.where('securityToken', p.securityToken)).firstOrFail(); map.messageToServant = p.message; await map.save(); return map }
  async getMapByIdWithSecurityToken(p: { id: string; securityToken: string }) {
    const map = await Map.query()
      .where('id', p.id)
      .andWhereHas('congregation', (q) => q.where('securityToken', p.securityToken))
      .preload('congregation')
      .preload('activities', (q) => q.orderBy('outDate', 'desc'))
      .preload('doNotCalls')
      .preload('streets', (q) => q.preload('categories'))
      .preload('rurals')
      .first()
    return {
      map,
      imageUrl: map?.imageName
        ? await drive.use('spaces').getUrl(`uploads/${map.congregationNumber}/${map.imageName}`)
        : null,
    }
  }
}
