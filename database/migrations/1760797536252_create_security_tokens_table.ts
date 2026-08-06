import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'SecurityToken'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('value').primary()
      table.string('congregationNumber').unique().nullable()
      table.foreign('congregationNumber').references('Congregation.number').onDelete('SET NULL')
      table.index(['congregationNumber'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
