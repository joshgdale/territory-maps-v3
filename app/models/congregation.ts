import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import Map from '#models/map'
import MapType from '#models/map_type'
import type { HasMany } from '@adonisjs/lucid/types/relations'

const AuthFinder = withAuthFinder(() => hash.use('bcrypt'), {
  uids: ['number'],
  passwordColumnName: 'password',
})

export default class Congregation extends compose(BaseModel, AuthFinder) {
  static table = 'Congregation'

  @column({ isPrimary: true })
  declare number: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare name: string

  @column({ columnName: 'shareMessage' })
  declare shareMessage: string

  @column({ columnName: 'broughtBackConfirmationMessage' })
  declare broughtBackConfirmationMessage: string

  @hasMany(() => Map, { foreignKey: 'congregationNumber' })
  declare maps: HasMany<typeof Map>

  @hasMany(() => MapType, { foreignKey: 'congregationNumber' })
  declare mapsTypes: HasMany<typeof MapType>

  @column({ columnName: 'securityToken', serializeAs: null })
  declare securityToken: string
}
