import vine from '@vinejs/vine'
const schema = { name: vine.string().trim(), categories: vine.string().nullable() }
export const CreateStreetValidator = vine.create(schema)
export const UpdateStreetValidator = vine.create(schema)
