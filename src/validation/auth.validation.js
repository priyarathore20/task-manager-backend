import Joi from "joi";

// signup validation schema

const signupSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().required(),

  phoneNumber: Joi.string()
    .pattern(/^\d{10}$/)
    .required(),

  name: Joi.string().min(3).max(20).required(),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "in"] },
  }),
});

export const signupValidation = (body) => {
  return signupSchema.validate(body);
};

// login validation schema

const loginSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().required(),
});

export const loginValidation = (body) => {
  return loginSchema.validate(body);
};
