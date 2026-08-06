import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Congregation from './congregation.js'

export default class WorkingNote extends BaseModel {
  static table = 'WorkingNote'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare content: string

  @column()
  declare colour: 'GRAY' | 'YELLOW' | 'GREEN' | 'ORANGE' | 'BLUE' | 'PURPLE' | 'PINK'

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'lastUpdated' })
  declare lastUpdated: DateTime

  @column({ columnName: 'congregationNumber' })
  declare congregationNumber: string

  @belongsTo(() => Congregation, { foreignKey: 'congregationNumber' })
  declare congregation: BelongsTo<typeof Congregation>
}
