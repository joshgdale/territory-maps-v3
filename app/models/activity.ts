import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Map from '#models/map'

export default class Activity extends BaseModel {
  static table = 'Activity'

  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'mapId' })
  declare mapId: string

  @column()
  declare status: 'IN' | 'OUT'

  @column()
  declare publisher: string

  @column.dateTime({ columnName: 'outDate' })
  declare outDate: DateTime

  @column.dateTime({ columnName: 'inDate' })
  declare inDate: DateTime | null

  @column()
  declare notes: string | null

  @belongsTo(() => Map, { foreignKey: 'mapId' })
  declare map: BelongsTo<typeof Map>
}
