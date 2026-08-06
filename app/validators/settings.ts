import vine from '@vinejs/vine'

export const UpdateShareMessageValidator = vine.create({
  message: vine.string(),
})

export const UpdateConfirmationMessageValidator = vine.create({
  message: vine.string(),
})

export const AddMapTypeValidator = vine.create({
  name: vine.string().trim().minLength(1),
})

export const AddStreetCategoryValidator = vine.create({
  name: vine.string().trim().minLength(1),
})

export const RollSecurityTokenValidator = vine.create({
  confirm: vine.literal(true),
})
