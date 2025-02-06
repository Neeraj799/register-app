import Joi from "joi";

const bookValidationSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  author: Joi.string().min(3).max(100).required(),
  ISBN: Joi.string().required(),
  publishedYear: Joi.number(),
  availableCopies: Joi.number(),
});

export { bookValidationSchema };
