const Joi = require("joi");

const registerSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      "string.min": "Name must be at least 2 characters",
      "any.required": "Name is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
    college: Joi.string().optional().allow(""),
    department: Joi.string().optional().allow(""),
  }),
};

const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const firebaseLoginSchema = {
  body: Joi.object({
    idToken: Joi.string().required().messages({
      "any.required": "Firebase ID token is required",
    }),
    name: Joi.string().optional().allow(""),
  }),
};

const updateProfileSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    bio: Joi.string().max(200).optional().allow(""),
    college: Joi.string().optional().allow(""),
    department: Joi.string().optional().allow(""),
    avatar: Joi.string().uri().optional().allow(""),
  }),
};

module.exports = { registerSchema, loginSchema, firebaseLoginSchema, updateProfileSchema };
