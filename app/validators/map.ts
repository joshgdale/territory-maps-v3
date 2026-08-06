import vine from '@vinejs/vine'
export const CreateMapValidator = vine.create({ name: vine.string().trim(), code: vine.string().trim(), type: vine.string().trim(), image: vine.file({ size: '5mb', extnames: ['jpg', 'jpeg', 'png'] }) })
export const UpdateMapValidator = vine.create({ name: vine.string().trim(), code: vine.string().trim(), type: vine.string().trim(), image: vine.file({ size: '5mb', extnames: ['jpg', 'jpeg', 'png'] }).optional() })
export const UpdateMapMessageValidator = vine.create({ message: vine.string().trim() })
