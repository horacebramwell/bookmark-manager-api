import Joi from "joi"

export const createBookmarkSchema = Joi.object({
  title: Joi.string().required(),
  url: Joi.string().uri().required(),
  description: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  category: Joi.string().required(),
})

export const updateBookmarkSchema = Joi.object({
  title: Joi.string(),
  url: Joi.string().uri(),
  description: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  category: Joi.string(),
})
