import vine from '@vinejs/vine'
const colours = ['GRAY', 'YELLOW', 'GREEN', 'ORANGE', 'BLUE', 'PURPLE', 'PINK'] as const
export const NewAndUpdateWorkingNoteValidator = vine.create({ content: vine.string().trim(), colour: vine.enum(colours) })
