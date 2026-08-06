import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Matches v1 Prisma unused Rural table present on production dumps.
 * Dropped by the consolidate evolve migration.
 */
export default class extends BaseSchema {
  protected tableName = 'Rural'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
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
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
