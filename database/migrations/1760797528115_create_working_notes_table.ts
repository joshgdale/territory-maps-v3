import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'WorkingNote'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.text('content').defaultTo('')
      table
        .enum('colour', ['GRAY', 'YELLOW', 'GREEN', 'ORANGE', 'BLUE', 'PURPLE', 'PINK'])
        .defaultTo('GRAY')
      table.dateTime('lastUpdated').notNullable()
      table.string('congregationNumber').notNullable()
      table.foreign('congregationNumber').references('Congregation.number').onDelete('CASCADE')
      table.index(['congregationNumber'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
