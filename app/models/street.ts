import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Map from '#models/map'
import StreetCategory from '#models/street_category'

export default class Street extends BaseModel {
  static table = 'Street'

  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'mapId' })
  declare mapId: string

  @column()
  declare name: string

  @column({ columnName: 'isComplete' })
  declare isComplete: boolean

  @belongsTo(() => Map, { foreignKey: 'mapId' })
  declare map: BelongsTo<typeof Map>

  @manyToMany(() => StreetCategory, {
    pivotTable: '_StreetToStreetCategory',
    pivotForeignKey: 'A', // Street.id
    pivotRelatedForeignKey: 'B', // StreetCategory.id
  })
  declare categories: ManyToMany<typeof StreetCategory>
}
