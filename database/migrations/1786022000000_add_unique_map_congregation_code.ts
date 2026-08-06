import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'Map'

  async up() {
    // Collapse accidental duplicates before enforcing uniqueness
    // (keeps the oldest row by id per congregation+code).
    await this.db.rawQuery(`
      DELETE m1 FROM \`Map\` m1
      INNER JOIN \`Map\` m2
        ON m1.congregationNumber = m2.congregationNumber
        AND m1.code = m2.code
        AND m1.id > m2.id
    `)

    this.schema.alterTable(this.tableName, (table) => {
      table.unique(['congregationNumber', 'code'], 'map_congregation_code_unique')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique(['congregationNumber', 'code'], 'map_congregation_code_unique')
    })
  }
}
