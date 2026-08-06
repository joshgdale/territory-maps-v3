import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'Street'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('mapId').notNullable()
      table.string('name').notNullable()
      table.boolean('isComplete').defaultTo(false)
      table.foreign('mapId').references('Map.id').onDelete('CASCADE')
      table.index(['mapId'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
