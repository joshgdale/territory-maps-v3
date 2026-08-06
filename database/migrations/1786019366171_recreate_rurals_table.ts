import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Recreate Rural as a first-class map feature (geo points + completion),
 * after the consolidate evolve dropped the unused Prisma Rural stub.
 */
export default class extends BaseSchema {
  protected tableName = 'Rural'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('mapId').notNullable()
      table.double('latitude').notNullable()
      table.double('longitude').notNullable()
      table.string('what3words').notNullable()
      table.text('description').notNullable()
      table.boolean('isComplete').notNullable().defaultTo(false)
      table.foreign('mapId').references('Map.id').onDelete('CASCADE')
      table.index(['mapId'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
