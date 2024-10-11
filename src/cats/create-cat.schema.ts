import * as Joi from 'joi';

export const createCatSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  age: Joi.number().integer().min(1).max(20).required(),
  breed: Joi.string().optional(),
});
