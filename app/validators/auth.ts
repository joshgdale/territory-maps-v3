import vine from '@vinejs/vine'
export const LoginValidator = vine.create({ congNumber: vine.string().trim(), password: vine.string() })
