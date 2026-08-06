import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'Activity'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('mapId').notNullable()
      table.enum('status', ['IN', 'OUT']).defaultTo('IN')
      table.string('publisher').notNullable()
      table.dateTime('outDate').notNullable()
      table.dateTime('inDate').nullable()
      table.text('notes').nullable()
      table.foreign('mapId').references('Map.id').onDelete('CASCADE')
      table.index(['mapId'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
