import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Global “What’s New” feature announcements shown on every congregation’s
 * dashboard for 30 days after addedAt.
 */
export default class extends BaseSchema {
  protected tableName = 'WhatsNew'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.text('content').notNullable()
      table.dateTime('addedAt').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
