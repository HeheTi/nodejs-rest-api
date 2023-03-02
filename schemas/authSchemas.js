const Joi = require("joi");
const { EMAIL_REG_EXP } = require("../helpers/constants");

const authSchema = Joi.object({
  email: Joi.string().pattern(EMAIL_REG_EXP).required(),
  password: Joi.string().min(5).required(),
});

const changeSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = { authSchema, changeSubscriptionSchema, refreshSchema };
