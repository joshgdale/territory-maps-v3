import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import Congregation from '#models/congregation'
import Street from '#models/street'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'

export default class StreetCategory extends BaseModel {
  static table = 'StreetCategory'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column({ columnName: 'congregationNumber' })
  declare congregationNumber: string

  @belongsTo(() => Congregation, { foreignKey: 'congregationNumber' })
  declare congregation: BelongsTo<typeof Congregation>

  @manyToMany(() => Street, {
    pivotTable: '_StreetToStreetCategory',
    pivotForeignKey: 'B', // StreetCategory.id
    pivotRelatedForeignKey: 'A', // Street.id
  })
  declare streets: ManyToMany<typeof Street>
}
