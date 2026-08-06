import vine from '@vinejs/vine'
const schema = { address: vine.string().trim(), lastCalled: vine.date() }
export const CreateDoNotCallValidator = vine.create(schema)
export const UpdateDoNotCallValidator = vine.create(schema)
