import WhatsNewService from '#services/whats_new_service'
import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

/**
 * Create a global “What’s New” announcement for the dashboard banner.
 *
 * Usage:
 *   node ace whats-new:create
 *   node ace whats-new:create --content="New rural maps support"
 *
 * Interactive mode collects lines until an empty line is entered.
 */
export default class WhatsNewCreate extends BaseCommand {
  static commandName = 'whats-new:create'
  static description = 'Add a What’s New announcement (shown on dashboards for 30 days)'

  static options: CommandOptions = {
    startApp: true,
  }

  @flags.string({
    description: 'Announcement body (use \\n for line breaks)',
    alias: 'c',
  })
  declare content?: string

  async run() {
    const content = this.content ? unescapeNewlines(this.content) : await this.promptMultiline()

    if (!content.trim()) {
      this.logger.error('Content is required')
      this.exitCode = 1
      return
    }

    const service = new WhatsNewService()
    const item = await service.createAnnouncement(content)

    this.logger.success(`Created What’s New item ${item.id}`)
    this.logger.info(`Added at: ${item.addedAt.toISO()}`)
    this.logger.info('Visible on every congregation dashboard for 30 days.')
  }

  private async promptMultiline(): Promise<string> {
    this.logger.info('Enter announcement content (empty line to finish):')
    const lines: string[] = []

    while (true) {
      const line = await this.prompt.ask(lines.length === 0 ? 'Content' : '…')
      if (line === '') break
      lines.push(line)
    }

    return lines.join('\n')
  }
}

function unescapeNewlines(value: string) {
  return value.replace(/\\n/g, '\n')
}
