import Congregation from '#models/congregation'
import { nanoid } from '#config/database'
import { BaseCommand, args } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

const DEFAULT_SHARE_MESSAGE =
  'Hello,\n\nPlease find below the link to the {name} ({code}) map.\n\n{link}\n\nYour brothers'
const DEFAULT_CONFIRMATION_MESSAGE =
  'Hello,\n\nThank you for completing the {name} ({code}) map.\n\nThis message is confirmation that the map has been completed and has now been returned. If this is not correct, please let us know.\n\nYour brothers'

export default class CongregationCreate extends BaseCommand {
  static commandName = 'congregation:create'
  static description = 'Create a congregation with a generated public-map security token'
  static options: CommandOptions = { startApp: true }
  @args.string({ description: 'Congregation number', required: false }) declare number?: string
  @args.string({ description: 'Congregation name', required: false }) declare name?: string
  @args.string({ description: 'Password', required: false }) declare password?: string
  async run() {
    const number = this.number ?? (await this.prompt.ask('Congregation number'))
    const name = this.name ?? (await this.prompt.ask('Congregation name'))
    const password = this.password ?? (await this.prompt.secure('Password'))
    if (!number || !name || !password) {
      this.logger.error('number, name, and password are required')
      this.exitCode = 1
      return
    }
    if (await Congregation.find(number)) {
      this.logger.error(`Congregation ${number} already exists`)
      this.exitCode = 1
      return
    }
    await Congregation.create({
      number,
      name,
      password,
      securityToken: nanoid(),
      shareMessage: DEFAULT_SHARE_MESSAGE,
      broughtBackConfirmationMessage: DEFAULT_CONFIRMATION_MESSAGE,
    })
    this.logger.success(`Created congregation ${number}`)
  }
}
