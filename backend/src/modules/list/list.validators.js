import Joi from "joi";

export const createListSchema = Joi.object({
  title: Joi.string().trim().min(3).required(),
  color: Joi.string()
    .valid("green", "blue", "purple", "red", "yellow", "teal", "sky", "gray")
    .default("green"),
});

export const createListParamsSchema = Joi.object({
  boardId: Joi.string().length(24).hex().required()
});

export const getListParamsSchema = Joi.object({
  boardId: Joi.string().length(24).hex().required(),
  listId: Joi.string().length(24).hex().required()
});

export const updateListSchema = Joi.object({
  title: Joi.string().trim(),
  color: Joi.string()
    .valid("green", "blue", "purple", "red", "yellow", "teal", "sky", "gray")
    .default("green"),
});
