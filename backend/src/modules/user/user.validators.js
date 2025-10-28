import Joi from "joi";

export const createUserSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const sendInviteSchema = Joi.object({
  email: Joi.string().email().required()
});

export const acceptInviteSchema = Joi.object({
  email: Joi.string().email().required()
});

export const rejectInviteSchema = Joi.object({
  email: Joi.string().email().required()
});
