import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Recreate Rural as a first-class map feature (geo points + completion),
 * after the consolidate evolve dropped the unused Prisma Rural stub.
 *
 * mapId must match Map.id length + collation. Dump DBs use Prisma's
 * varchar(191)/utf8mb4_unicode_ci; Lucid defaults (255 / server collation)
 * cause errno 150 on the FK.
 */
export default class extends BaseSchema {
  protected tableName = 'Rural'

  async up() {
    this.defer(async (db) => {
      // Knex creates the table then ALTER-adds the FK; a prior failed run
      // can leave Rural without the constraint.
      await db.rawQuery('DROP TABLE IF EXISTS `Rural`')

      const result = await db.rawQuery(`
        SELECT CHARACTER_MAXIMUM_LENGTH AS len, COLLATION_NAME AS coll
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'Map'
          AND COLUMN_NAME = 'id'
      `)
      const mapId = result[0][0] as { len: number | string; coll: string }
      const len = Number(mapId.len) || 255
      const coll = /^[A-Za-z0-9_]+$/.test(mapId.coll) ? mapId.coll : 'utf8mb4_unicode_ci'

      await db.rawQuery(`
        CREATE TABLE \`Rural\` (
          \`id\` varchar(${len}) COLLATE ${coll} NOT NULL,
          \`mapId\` varchar(${len}) COLLATE ${coll} NOT NULL,
          \`latitude\` double NOT NULL,
          \`longitude\` double NOT NULL,
          \`what3words\` varchar(${len}) COLLATE ${coll} NOT NULL,
          \`description\` text COLLATE ${coll} NOT NULL,
          \`isComplete\` tinyint(1) NOT NULL DEFAULT 0,
          PRIMARY KEY (\`id\`),
          KEY \`rural_mapid_index\` (\`mapId\`),
          CONSTRAINT \`rural_mapid_foreign\`
            FOREIGN KEY (\`mapId\`) REFERENCES \`Map\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=${coll}
      `)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
