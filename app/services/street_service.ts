import Map from '#models/map'
import Street from '#models/street'
import StreetCategory from '#models/street_category'
import { inject } from '@adonisjs/core'
import { nanoid } from '#config/database'
import { errors } from '@vinejs/vine'

@inject()
export default class StreetService {
  async assertCategoriesBelongToCongregation(p: { congNumber: string; categoryIds: string[] }) {
    if (p.categoryIds.length === 0) return
    const found = await StreetCategory.query()
      .where('congregationNumber', p.congNumber)
      .whereIn('id', p.categoryIds)
    if (found.length !== p.categoryIds.length) {
      throw new errors.E_VALIDATION_ERROR([
        { field: 'categories', message: 'Invalid street categories', rule: 'exists' },
      ])
    }
  }

  async addStreetToMap(p: {
    congNumber: string
    mapId: string
    name: string
    categories: string | null
  }) {
    const map = await Map.query()
      .where('id', p.mapId)
      .where('congregationNumber', p.congNumber)
      .firstOrFail()
    const categoryIds = p.categories ? p.categories.split(',').filter(Boolean) : []
    await this.assertCategoriesBelongToCongregation({
      congNumber: p.congNumber,
      categoryIds,
    })
    const street = await Street.create({
      id: nanoid(),
      mapId: map.id,
      name: p.name,
      isComplete: false,
    })
    if (categoryIds.length > 0) await street.related('categories').attach(categoryIds)
    return street
  }

  async getStreet(p: { congNumber: string; mapId: string; streetId: string }) {
    await Map.query().where('id', p.mapId).where('congregationNumber', p.congNumber).firstOrFail()
    return Street.query()
      .where('id', p.streetId)
      .where('mapId', p.mapId)
      .preload('categories')
      .firstOrFail()
  }

  async getStreetWithSecurityToken(p: {
    mapId: string
    securityToken: string
    streetId: string
  }) {
    await Map.query()
      .where('id', p.mapId)
      .andWhereHas('congregation', (q) => q.where('securityToken', p.securityToken))
      .firstOrFail()
    return Street.query()
      .where('id', p.streetId)
      .where('mapId', p.mapId)
      .preload('categories')
      .firstOrFail()
  }

  async updateStreet(p: {
    congNumber: string
    mapId: string
    streetId: string
    name: string
    categories: string | null
  }) {
    const street = await this.getStreet(p)
    const categoryIds = p.categories ? p.categories.split(',').filter(Boolean) : []
    await this.assertCategoriesBelongToCongregation({
      congNumber: p.congNumber,
      categoryIds,
    })
    street.name = p.name
    await street.save()
    await street.related('categories').sync(categoryIds)
    return street
  }

  async deleteStreet(p: { congNumber: string; mapId: string; streetId: string }) {
    await (await this.getStreet(p)).delete()
  }

  async toggleStreetComplete(p: { congNumber: string; mapId: string; streetId: string }) {
    const street = await this.getStreet(p)
    street.isComplete = !street.isComplete
    await street.save()
    return street
  }

  async toggleCompleteWithSecurityToken(p: {
    mapId: string
    securityToken: string
    streetId: string
  }) {
    const street = await this.getStreetWithSecurityToken(p)
    street.isComplete = !street.isComplete
    await street.save()
    return street
  }

  async clearStreetStatusByMapId(p: { mapId: string }) {
    await Street.query().where('mapId', p.mapId).update({ isComplete: false })
  }
}
