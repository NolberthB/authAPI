import Joi from 'joi'

export class AuthValidation {
  static registerSchema = Joi.object({
    username: Joi.string().min(3).required().messages({
      'string.base': 'Username must be a string',
      'string.empty': 'Username is required',
      'string.min': 'Username must be at least 3 characters long',
      'any.required': 'Username is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.base': 'Password must be a string',
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    }),
    role: Joi.string().valid('admin', 'user').required().messages({
      'any.only': 'Role must be admin or user',
      'any.required': 'Role is required'
    })
  })

  static loginSchema = Joi.object({
    username: Joi.string().required().messages({
      'string.base': 'Username must be a string',
      'string.empty': 'Username is required',
      'any.required': 'Username is required'
    }),
    password: Joi.string().required().messages({
      'string.base': 'Password must be a string',
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    }),
    role: Joi.string().valid('admin', 'user').required().messages({
      'any.only': 'Role must be admin or user',
      'any.required': 'Role is required'
    })
  })
}
