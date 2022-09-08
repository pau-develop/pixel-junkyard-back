import { Joi } from "express-validation";

export const registerSchema = Joi.object({
  userName: Joi.string().min(3).max(12).required(),
  password: Joi.string().min(5).max(20).required(),
  email: Joi.string().min(10).max(25).required(),
});

export const loginSchema = Joi.object({
  userName: Joi.string().min(3).max(12).required(),
  password: Joi.string().min(5).max(20).required(),
});

export const createDrawingSchema = Joi.object({
  name: Joi.string().min(3).max(12).required(),
  description: Joi.string().max(100),
  image: Joi.string(),
  artist: Joi.string(),
  resolution: Joi.string(),
  userId: Joi.string(),
});
