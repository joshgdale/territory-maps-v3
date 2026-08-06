import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Map from '#models/map'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class DoNotCall extends BaseModel {
  static table = 'DoNotCall'

  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'mapId' })
  declare mapId: string


  @column()
  declare address: string

  @column.dateTime({ columnName: 'lastCalled' })
  declare lastCalled: DateTime

  @belongsTo(() => Map, { foreignKey: 'mapId' })
  declare map: BelongsTo<typeof Map>
}
