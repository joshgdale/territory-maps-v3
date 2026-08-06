import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import db from '@adonisjs/lucid/services/db'

/**
 * One-time: after restoring a v1 Prisma production dump into this database,
 * create Adonis migration bookkeeping and mark Batch A (create) migrations
 * as already applied so Batch B (evolve) can run via `node ace migration:run`.
 */
export default class DbBootstrapFromDump extends BaseCommand {
  static commandName = 'db:bootstrap-from-dump'
  static description =
    'One-time: wire adonis_schema for a restored v1 dump and mark create migrations applied'

  static options: CommandOptions = {
    startApp: true,
  }

  @flags.boolean({ description: 'Allow running when NODE_ENV=production', default: false })
  declare force: boolean

  /** Create migrations that mirror tables already present on a v1 dump (never run up() on dump). */
  private readonly createMigrations = [
    'database/migrations/1760738863629_create_congregation_table',
    'database/migrations/1760795937846_create_map_type_table',
    'database/migrations/1760796845823_create_maps_table',
    'database/migrations/1760797492310_create_activities_table',
    'database/migrations/1760797510192_create_addresses_table',
    'database/migrations/1760797518566_create_street_categories_table',
    'database/migrations/1760797523607_create_streets_table',
    'database/migrations/1760797523608_create_street_to_street_categories_pivot_table',
    'database/migrations/1760797528115_create_working_notes_table',
    'database/migrations/1760797536252_create_security_tokens_table',
    'database/migrations/1760797540000_create_prisma_do_not_calls_table',
    'database/migrations/1760797541000_create_rurals_table',
  ]

  private readonly requiredTables = [
    'Congregation',
    'Map',
    'MapType',
    'Activity',
    'Address',
    'Street',
    'StreetCategory',
    '_StreetToStreetCategory',
    'WorkingNote',
    'SecurityToken',
  ]

  async run() {
    if (process.env.NODE_ENV === 'production' && !this.force) {
      this.logger.error('Refusing to run in production without --force')
      this.exitCode = 1
      return
    }

    this.logger.info('Bootstrapping Adonis migrations from a restored v1 dump...')

    try {
      for (const table of this.requiredTables) {
        const result = await db.rawQuery(
          `
          SELECT COUNT(*) AS c
          FROM information_schema.tables
          WHERE table_schema = DATABASE() AND table_name = ?
        `,
          [table]
        )
        const count = Number(result[0][0].c)
        if (count === 0) {
          this.logger.error(`Expected dump table missing: ${table}`)
          this.exitCode = 1
          return
        }
      }
      this.logger.success('Verified core dump tables')

      await db.rawQuery(`
        CREATE TABLE IF NOT EXISTS adonis_schema (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          batch INT NOT NULL,
          migration_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)
      await db.rawQuery(`
        CREATE TABLE IF NOT EXISTS adonis_schema_versions (
          version INT NOT NULL
        )
      `)
      await db.rawQuery(`
        INSERT INTO adonis_schema_versions (version)
        SELECT 2 WHERE NOT EXISTS (SELECT 1 FROM adonis_schema_versions)
      `)
      this.logger.success('adonis_schema tables ready')

      for (const migration of this.createMigrations) {
        await db.rawQuery(
          `
          INSERT INTO adonis_schema (name, batch)
          VALUES (?, 1)
          ON DUPLICATE KEY UPDATE name = name
        `,
          [migration]
        )
      }
      this.logger.success(`Marked ${this.createMigrations.length} create migrations as applied (batch 1)`)

      const pending = await db.rawQuery(`
        SELECT name FROM adonis_schema ORDER BY id
      `)
      this.logger.info('Recorded migrations:')
      console.table(pending[0])

      this.logger.success('Bootstrap complete (one-time).')
      this.logger.info('Next: node ace migration:run')
      this.logger.info('That applies evolve migrations (security token + Address→DoNotCall).')
    } catch (error) {
      this.logger.error('Bootstrap failed')
      this.logger.error(error instanceof Error ? error.message : String(error))
      this.exitCode = 1
    }
  }
}
