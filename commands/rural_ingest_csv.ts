import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import Map from '#models/map'
import Rural from '#models/rural'
import { nanoid } from '#config/database'
import { normalizeWhat3Words } from '#services/rural_service'
import { BaseCommand, args, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

const REQUIRED_HEADERS = ['Latitude', 'Longitude', 'What3Words', 'Map', 'Description'] as const

/**
 * One-time: ingest rural locations from a CSV into the Rural table.
 *
 * Expected headers: Latitude, Longitude, What3Words, Map, Description
 * (`Map` is the map code within the given congregation.)
 *
 * Usage:
 *   node ace rural:ingest ./rurals.csv --congregation=12345
 */
export default class RuralIngestCsv extends BaseCommand {
  static commandName = 'rural:ingest'
  static description = 'One-time: ingest rurals from a CSV (Latitude, Longitude, What3Words, Map, Description)'

  static options: CommandOptions = {
    startApp: true,
  }

  @args.string({ description: 'Path to the CSV file' })
  declare file: string

  @flags.string({
    description: 'Congregation number (required; map codes are scoped per congregation)',
    alias: 'c',
  })
  declare congregation?: string

  @flags.boolean({
    description: 'Do not write to the database; only validate and report',
    default: false,
  })
  declare dryRun: boolean

  async run() {
    const congregationNumber =
      this.congregation ?? (await this.prompt.ask('Congregation number'))

    if (!congregationNumber) {
      this.logger.error('Congregation number is required')
      this.exitCode = 1
      return
    }

    const absolutePath = resolve(this.file)
    let content: string
    try {
      content = await readFile(absolutePath, 'utf8')
    } catch {
      this.logger.error(`Could not read file: ${absolutePath}`)
      this.exitCode = 1
      return
    }

    const rows = parseCsv(content)
    if (rows.length === 0) {
      this.logger.error('CSV is empty')
      this.exitCode = 1
      return
    }

    const headers = rows[0]!.map((h) => h.trim())
    const missing = REQUIRED_HEADERS.filter((h) => !headers.includes(h))
    if (missing.length > 0) {
      this.logger.error(`Missing CSV headers: ${missing.join(', ')}`)
      this.logger.info(`Found headers: ${headers.join(', ')}`)
      this.exitCode = 1
      return
    }

    const index = Object.fromEntries(
      REQUIRED_HEADERS.map((h) => [h, headers.indexOf(h)])
    ) as Record<(typeof REQUIRED_HEADERS)[number], number>

    const maps = await Map.query().where('congregationNumber', congregationNumber)
    const mapByCode = new globalThis.Map(maps.map((m) => [m.code, m]))

    let created = 0
    let skipped = 0
    const errors: string[] = []

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]!
      if (row.every((cell) => cell.trim() === '')) continue

      const line = i + 1
      const latitude = Number(row[index.Latitude]?.trim())
      const longitude = Number(row[index.Longitude]?.trim())
      const what3words = normalizeWhat3Words(row[index.What3Words] ?? '')
      const mapCode = (row[index.Map] ?? '').trim()
      const description = (row[index.Description] ?? '').trim()

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        errors.push(`Line ${line}: invalid latitude/longitude`)
        skipped++
        continue
      }
      if (!what3words || !mapCode || !description) {
        errors.push(`Line ${line}: missing What3Words, Map, or Description`)
        skipped++
        continue
      }

      const map = mapByCode.get(mapCode)
      if (!map) {
        errors.push(`Line ${line}: no map with code "${mapCode}" in congregation ${congregationNumber}`)
        skipped++
        continue
      }

      if (this.dryRun) {
        created++
        continue
      }

      await Rural.create({
        id: nanoid(),
        mapId: map.id,
        latitude,
        longitude,
        what3words,
        description,
        isComplete: false,
      })
      created++
    }

    if (this.dryRun) {
      this.logger.info(`Dry run: ${created} row(s) would be created, ${skipped} skipped`)
    } else {
      this.logger.success(`Created ${created} rural(s), skipped ${skipped}`)
    }

    for (const error of errors.slice(0, 20)) {
      this.logger.warning(error)
    }
    if (errors.length > 20) {
      this.logger.warning(`…and ${errors.length - 20} more error(s)`)
    }

    if (errors.length > 0 && created === 0) {
      this.exitCode = 1
    }
  }
}

function parseCsv(content: string): string[][] {
  const normalized = content.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const rows: string[][] = []
  let current: string[] = []
  let cell = ''
  let inQuotes = false

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i]!
    const next = normalized[i + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"'
        i++
        continue
      }
      inQuotes = !inQuotes
      continue
    }

    if (char === ',' && !inQuotes) {
      current.push(cell)
      cell = ''
      continue
    }

    if (char === '\n' && !inQuotes) {
      current.push(cell)
      rows.push(current)
      current = []
      cell = ''
      continue
    }

    cell += char
  }

  if (cell.length > 0 || current.length > 0) {
    current.push(cell)
    rows.push(current)
  }

  return rows
}
