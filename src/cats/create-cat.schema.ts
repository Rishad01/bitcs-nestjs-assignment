import * as Joi from 'joi';

export const createCatSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),            // 'name' must be a string and is required
  age: Joi.number().integer().min(1).max(20).required(),  // 'age' must be an integer between 1 and 20
  breed: Joi.string().optional(),           // 'breed' must be a string but is optional
});