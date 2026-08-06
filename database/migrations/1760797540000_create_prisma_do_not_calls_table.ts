import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Matches v1 Prisma unused DoNotCall table present on production dumps.
 * Evolve migration consolidates Address into DoNotCall and drops this stub if empty.
 */
export default class extends BaseSchema {
  protected tableName = 'DoNotCall'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('mapId').notNullable()
      table.string('address').notNullable()
      table.dateTime('lastCalled').notNullable()
      table.foreign('mapId').references('Map.id').onDelete('CASCADE')
      table.index(['mapId'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
