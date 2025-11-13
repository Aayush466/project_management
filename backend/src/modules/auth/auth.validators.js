import Joi from "joi";

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const submitOtpSchema = Joi.object({
  otp: Joi.number().integer().min(100000).max(999999).required(),
  email: Joi.string().email().required(),
});

export const sendResetOtpSchema = Joi.object({
  email: Joi.string().email().required()
});

export const submitResetOtpSchema = Joi.object({
  otp: Joi.number().integer().min(100000).max(999999).required(),
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  otp: Joi.number().integer().min(100000).max(999999).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});
