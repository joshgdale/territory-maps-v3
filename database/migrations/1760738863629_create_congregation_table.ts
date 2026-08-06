import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'Congregation'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('number').primary()
      table.string('password').notNullable()
      table.string('name').notNullable()
      table
        .text('shareMessage')
        .defaultTo(
          'Hello,\n\nPlease find below the link to the {name} ({code}) map.\n\n{link}\n\nYour brothers'
        )
      table
        .text('broughtBackConfirmationMessage')
        .defaultTo(
          'Hello,\n\nThank you for completing the {name} ({code}) map.\n\nThis message is confirmation that the map has been completed and has now been returned. If this is not correct, please let us know.\n\nYour brothers'
        )
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
