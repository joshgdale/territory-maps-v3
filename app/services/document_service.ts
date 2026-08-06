import Activity from '#models/activity'
import DoNotCall from '#models/do_not_call'
import { inject } from '@adonisjs/core'
import { add, format, isAfter } from 'date-fns'
import { DateTime } from 'luxon'

@inject()
export default class DocumentService {
  async getServiceYear({ previous }: { previous: boolean }) {
    const september1 = new Date()
    september1.setMonth(8, 1)
    const august31 = new Date()
    august31.setMonth(7, 31)
    let startOfServiceYear: Date
    let endOfServiceYear: Date
    if (isAfter(new Date(), september1)) {
      startOfServiceYear = september1
      endOfServiceYear = add(august31, { years: 1 })
    } else {
      startOfServiceYear = add(august31, { years: -1 })
      endOfServiceYear = september1
    }
    if (previous) {
      startOfServiceYear = add(startOfServiceYear, { years: -1 })
      endOfServiceYear = add(endOfServiceYear, { years: -1 })
    }
    return {
      startOfServiceYear,
      endOfServiceYear,
      serviceYearString: `${format(startOfServiceYear, 'yyyy')}-${format(endOfServiceYear, 'yy')}`,
    }
  }

  /**
   * Records may only be kept for the current and previous service years.
   * Compliance is based on inDate; still-OUT activities (null inDate) are ignored.
   * Cutoff matches S-13 year windows: inDate on or before previous.start is non-compliant.
   */
  async getRetentionCutoff() {
    const previous = await this.getServiceYear({ previous: true })
    return {
      cutoff: previous.startOfServiceYear,
      previousServiceYear: previous.serviceYearString,
    }
  }

  nonCompliantActivitiesQuery(congNumber: string, cutoff: Date) {
    const cutoffSql = DateTime.fromJSDate(cutoff).toSQL()!
    return Activity.query()
      .whereHas('map', (q) => q.where('congregationNumber', congNumber))
      .whereNotNull('inDate')
      .where('inDate', '<=', cutoffSql)
  }

  async getNonCompliantRecords(congNumber: string) {
    const { cutoff } = await this.getRetentionCutoff()
    const activities = await this.nonCompliantActivitiesQuery(congNumber, cutoff).preload('map')

    const mapsById = new Map<string, { id: string; name: string; code: string }>()
    for (const activity of activities) {
      if (!mapsById.has(activity.map.id)) {
        mapsById.set(activity.map.id, {
          id: activity.map.id,
          name: activity.map.name,
          code: activity.map.code,
        })
      }
    }

    const maps = [...mapsById.values()].sort((a, b) => a.code.localeCompare(b.code))

    return {
      recordCount: activities.length,
      mapCount: maps.length,
      maps,
    }
  }

  async deleteNonCompliantRecords(congNumber: string) {
    const { cutoff } = await this.getRetentionCutoff()
    const deleted = await this.nonCompliantActivitiesQuery(congNumber, cutoff).delete()
    return deleted
  }

  /**
   * Do Not Calls whose lastCalled is before the current service year start,
   * grouped by map type (category), oldest → newest within each category.
   */
  async getDncWorksheetData(congNumber: string) {
    const year = await this.getServiceYear({ previous: false })
    const cutoffSql = DateTime.fromJSDate(year.startOfServiceYear).toSQL()!

    const dncs = await DoNotCall.query()
      .whereHas('map', (q) => q.where('congregationNumber', congNumber))
      .where('lastCalled', '<', cutoffSql)
      .preload('map', (q) => q.preload('type'))
      .orderBy('lastCalled', 'asc')

    const byCategory = new Map<
      string,
      { address: string; lastCalled: string; mapName: string; mapCode: string }[]
    >()

    for (const dnc of dncs) {
      const category = dnc.map.type?.name ?? 'Uncategorised'
      const items = byCategory.get(category) ?? []
      items.push({
        address: dnc.address,
        lastCalled: format(dnc.lastCalled.toJSDate(), 'dd/MM/yy'),
        mapName: dnc.map.name,
        mapCode: dnc.map.code,
      })
      byCategory.set(category, items)
    }

    const categories = [...byCategory.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, items]) => ({ name, items }))

    return {
      serviceYear: year.serviceYearString,
      categories,
      totalCount: dncs.length,
    }
  }
}
