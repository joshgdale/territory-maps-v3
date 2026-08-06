import vine from '@vinejs/vine'

export const DeleteNonCompliantRecordsValidator = vine.create({
  confirm: vine.literal(true),
})
