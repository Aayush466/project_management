import Joi from "joi";

export const createBoardSchema = Joi.object({
  title: Joi.string().trim().min(3).required()
});

export const updateBoardSchema = Joi.object({
  title: Joi.string().trim().min(3).required()
});

export const getBoardSchema = Joi.object({
  boardId: Joi.string().length(24).hex().required()
});

