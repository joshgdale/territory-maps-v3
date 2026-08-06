import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'StreetCategory'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('name').notNullable()
      table.string('congregationNumber').notNullable()
      table.foreign('congregationNumber').references('Congregation.number').onDelete('CASCADE')
      table.index(['congregationNumber'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
