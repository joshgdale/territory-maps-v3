import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('Congregation', (table) => {
      table.string('securityToken').nullable()
    })

    this.defer(async (db) => {
      const tokens = await db.from('SecurityToken').select('value', 'congregationNumber')
      for (const token of tokens) {
        if (token.congregationNumber) {
          await db
            .from('Congregation')
            .where('number', token.congregationNumber)
            .update({ securityToken: token.value })
        }
      }
    })

    this.schema.dropTable('SecurityToken')
  }

  async down() {
    this.schema.createTable('SecurityToken', (table) => {
      table.string('value').primary()
      table
        .string('congregationNumber')
        .nullable()
        .unique()
        .references('number')
        .inTable('Congregation')
        .onDelete('SET NULL')
      table.index(['congregationNumber'])
    })

    this.defer(async (db) => {
      const congregations = await db
        .from('Congregation')
        .whereNotNull('securityToken')
        .select('number', 'securityToken')

      for (const cong of congregations) {
        await db.table('SecurityToken').insert({
          value: cong.securityToken,
          congregationNumber: cong.number,
        })
      }
    })

    this.schema.alterTable('Congregation', (table) => {
      table.dropColumn('securityToken')
    })
  }
}
