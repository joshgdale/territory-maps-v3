import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'Address'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('mapId').notNullable()
      table.enum('type', ['DNC', 'FARM']).notNullable()
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
