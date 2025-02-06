import Joi from "joi";

const userSignUpValidation = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(4).max(100).required(),
});

const userLoginValidation = Joi.object({
  email: Joi.string().trim().required(),
  password: Joi.string().min(4).max(100).required(),
});

export { userSignUpValidation, userLoginValidation };
