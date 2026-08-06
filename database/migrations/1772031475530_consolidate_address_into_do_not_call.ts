import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Production dumps have BOTH Prisma `DoNotCall` (unused) and `Address` (active DNC|FARM).
 * This migration:
 * 1. Merges any Prisma DoNotCall rows into Address-shaped data path
 * 2. Drops the Prisma DoNotCall stub table
 * 3. Renames Address → DoNotCall and drops the type column
 * 4. Drops unused Rural
 */
export default class extends BaseSchema {
  async up() {
    this.defer(async (db) => {
      const hasPrismaDnc = await db.rawQuery(`
        SELECT COUNT(*) AS c
        FROM information_schema.tables
        WHERE table_schema = DATABASE() AND table_name = 'DoNotCall'
      `)
      const dncExists = Number(hasPrismaDnc[0][0].c) > 0

      if (dncExists) {
        // Preserve any unexpected rows by copying into Address (as DNC) before drop
        const rows = await db.from('DoNotCall').select('*')
        for (const row of rows) {
          const existing = await db.from('Address').where('id', row.id).first()
          if (!existing) {
            await db.table('Address').insert({
              id: row.id,
              mapId: row.mapId,
              type: 'DNC',
              address: row.address,
              lastCalled: row.lastCalled,
            })
          }
        }
        await db.rawQuery('DROP TABLE `DoNotCall`')
      }
    })

    this.schema.renameTable('Address', 'DoNotCall')

    this.schema.alterTable('DoNotCall', (table) => {
      table.dropColumn('type')
    })

    this.defer(async (db) => {
      const hasRural = await db.rawQuery(`
        SELECT COUNT(*) AS c
        FROM information_schema.tables
        WHERE table_schema = DATABASE() AND table_name = 'Rural'
      `)
      if (Number(hasRural[0][0].c) > 0) {
        await db.rawQuery('DROP TABLE `Rural`')
      }
    })
  }

  async down() {
    this.schema.createTable('Rural', (table) => {
      table.string('id').primary()
      table.string('mapId').notNullable()
      table.string('address').notNullable()
      table.float('latitude').notNullable()
      table.float('longitude').notNullable()
      table.string('what3words').notNullable()
      table.string('description').notNullable()
      table.foreign('mapId').references('Map.id').onDelete('CASCADE')
      table.index(['mapId'])
    })

    this.schema.alterTable('DoNotCall', (table) => {
      table.enum('type', ['DNC', 'FARM']).notNullable().defaultTo('DNC')
    })

    this.schema.renameTable('DoNotCall', 'Address')
  }
}
