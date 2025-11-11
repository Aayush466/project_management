import Joi from "joi";

export const createCardSchema = Joi.object({
  title: Joi.string().trim().min(3).required(),
});

export const createCardParamsSchema = Joi.object({
  boardId: Joi.string().length(24).hex().required(),
  listId: Joi.string().length(24).hex().required(),
});

export const getCardParamsSchema = Joi.object({
  boardId: Joi.string().length(24).hex().required(),
  listId: Joi.string().length(24).hex().required(),
  cardId: Joi.string().length(24).hex().required(),
});

export const getCardFileParamsSchema = Joi.object({
  boardId: Joi.string().length(24).hex().required(),
  listId: Joi.string().length(24).hex().required(),
  cardId: Joi.string().length(24).hex().required(),
  fileId: Joi.string()
  .pattern(/^[a-zA-Z0-9_-]+$/)
  .required(),
});

export const updateCardSchema = Joi.object({
  title: Joi.string().trim(),
  description: Joi.string().trim(),
  color: Joi.string()
    .valid("green", "blue", "purple", "red", "yellow", "teal", "sky", "gray")
    .default("green"),
  status: Joi.string().valid("none", "completed", "pending").default("none"),
  priority: Joi.string().valid("none", "high", "normal", "low").default("none"),
  dueDateTime: Joi.alternatives().try(
    Joi.string().valid("none").empty(""), // allow "none" or empty
    Joi.date().iso().min("now").messages({
      "date.base": "Due date must be a valid date.",
      "date.format": "Due date must be in ISO format.",
      "date.min": "Due date cannot be in the past.",
    })
  ),
  checkLists: Joi.string().custom((value, helpers) => {
    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) {
        return helpers.error("any.invalid");
      }
      // Optional: check that every element is a string
      if (!parsed.every((item) => typeof item === "string")) {
        return helpers.error("any.invalid");
      }
      return value; // Success: it is a JSON array string
    } catch (e) {
      return helpers.error("any.invalid");
    }
  }, "JSON array string")
,
});