import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class WhatsNew extends BaseModel {
  static table = 'WhatsNew'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare content: string

  @column.dateTime({ autoCreate: true, columnName: 'addedAt' })
  declare addedAt: DateTime
}
