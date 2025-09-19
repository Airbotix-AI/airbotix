import Joi from 'joi';
import { config } from '../config/env';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const requestOtpSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .pattern(EMAIL_REGEX)
    .max(255)
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.max': 'Email must not exceed 255 characters',
      'any.required': 'Email is required',
    }),
});

export const verifyOtpSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .pattern(EMAIL_REGEX)
    .max(255)
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.max': 'Email must not exceed 255 characters',
      'any.required': 'Email is required',
    }),
  code: Joi.string()
    .length(config.otp.length)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.length': `OTP code must be exactly ${config.otp.length} digits`,
      'string.pattern.base': 'OTP code must contain only numbers',
      'any.required': 'OTP code is required',
    }),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().optional().allow(''),
});