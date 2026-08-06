import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Map from '#models/map'

export default class Rural extends BaseModel {
  static table = 'Rural'

  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'mapId' })
  declare mapId: string

  @column()
  declare latitude: number

  @column()
  declare longitude: number

  @column({ columnName: 'what3words', serializeAs: 'what3words' })
  declare what3words: string

  @column()
  declare description: string

  @column({ columnName: 'isComplete' })
  declare isComplete: boolean

  @belongsTo(() => Map, { foreignKey: 'mapId' })
  declare map: BelongsTo<typeof Map>
}
