import Congregation from '#models/congregation'
import { BaseCommand, args } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class CongregationResetPassword extends BaseCommand {
  static commandName = 'congregation:reset-password'
  static description = 'Reset a congregation password'
  static options: CommandOptions = { startApp: true }
  @args.string({ description: 'Congregation number', required: false }) declare number?: string
  @args.string({ description: 'New password', required: false }) declare password?: string
  async run() {
    const number = this.number ?? (await this.prompt.ask('Congregation number'))
    const password = this.password ?? (await this.prompt.secure('New password'))
    if (!number || !password) {
      this.logger.error('number and password are required')
      this.exitCode = 1
      return
    }
    const congregation = await Congregation.findOrFail(number)
    // Plain password — withAuthFinder hashes on save when dirty
    congregation.password = password
    await congregation.save()
    this.logger.success(`Password reset for congregation ${number}`)
  }
}
