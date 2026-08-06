import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'Map'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('code').notNullable()
      table.string('name').notNullable()
      table.string('imageName').unique().notNullable()
      table.string('typeId').notNullable()
      table.string('congregationNumber').notNullable()
      table.text('messageFromServant').defaultTo('')
      table.text('messageToServant').defaultTo('')
      table.foreign('typeId').references('MapType.id').onDelete('RESTRICT')
      table.foreign('congregationNumber').references('Congregation.number').onDelete('CASCADE')
      table.index(['typeId'])
      table.index(['congregationNumber'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
