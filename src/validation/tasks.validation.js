import Joi from "joi";

// add task validation schema

const addTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().max(300).required(),
  status: Joi.string().required(),
  dueDate: Joi.date().required(),
});

export const addTaskValidation = (body) => {
  return addTaskSchema.validate(body);
};
