import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = '_StreetToStreetCategory'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('A').notNullable() // FK to Street.id
      table.string('B').notNullable() // FK to StreetCategory.id

      table.primary(['A', 'B'])

      table.foreign('A').references('Street.id').onDelete('CASCADE')

      table.foreign('B').references('StreetCategory.id').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
