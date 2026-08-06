import vine from '@vinejs/vine'

const schema = {
  latitude: vine.number(),
  longitude: vine.number(),
  what3words: vine.string().trim(),
  description: vine.string().trim(),
}

export const CreateRuralValidator = vine.create(schema)
export const UpdateRuralValidator = vine.create(schema)
