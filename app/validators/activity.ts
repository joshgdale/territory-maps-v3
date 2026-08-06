import vine from '@vinejs/vine'
const schema = { outDate: vine.date(), publisher: vine.string().trim(), inDate: vine.date().nullable(), notes: vine.string().trim().nullable() }
export const CreateActivityValidator = vine.create(schema)
export const UpdateActivityValidator = vine.create(schema)
