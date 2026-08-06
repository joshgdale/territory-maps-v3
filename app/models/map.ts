import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Congregation from '#models/congregation'
import MapType from '#models/map_type'
import Activity from '#models/activity'
import DoNotCall from '#models/do_not_call'
import Street from '#models/street'
import Rural from '#models/rural'

export default class Map extends BaseModel {
  static table = 'Map'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare code: string

  @column()
  declare name: string

  @column({ columnName: 'imageName' })
  declare imageName: string

  @column({ columnName: 'messageFromServant' })
  declare messageFromServant: string

  @column({ columnName: 'messageToServant' })
  declare messageToServant: string

  @column({ columnName: 'typeId' })
  declare typeId: string

  @column({ columnName: 'congregationNumber' })
  declare congregationNumber: string

  @belongsTo(() => MapType, { foreignKey: 'typeId' })
  declare type: BelongsTo<typeof MapType>

  @belongsTo(() => Congregation, { foreignKey: 'congregationNumber' })
  declare congregation: BelongsTo<typeof Congregation>

  @hasMany(() => Activity, { foreignKey: 'mapId' })
  declare activities: HasMany<typeof Activity>

  @hasMany(() => DoNotCall, { foreignKey: 'mapId' })
  declare doNotCalls: HasMany<typeof DoNotCall>

  @hasMany(() => Street, { foreignKey: 'mapId' })
  declare streets: HasMany<typeof Street>

  @hasMany(() => Rural, { foreignKey: 'mapId' })
  declare rurals: HasMany<typeof Rural>
}
