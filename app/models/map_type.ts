import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Congregation from '#models/congregation'
import Map from '#models/map'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class MapType extends BaseModel {
  static table = 'MapType'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column({ columnName: 'congregationNumber' })
  declare congregationNumber: string

  @belongsTo(() => Congregation, { foreignKey: 'congregationNumber' })
  declare congregation: BelongsTo<typeof Congregation>

  @hasMany(() => Map, { foreignKey: 'typeId' })
  declare maps: HasMany<typeof Map>
}
