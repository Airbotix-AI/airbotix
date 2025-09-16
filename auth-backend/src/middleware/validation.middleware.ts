import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError, ErrorCode } from '../types/errors';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      throw AppError.badRequest(
        ErrorCode.VALIDATION_ERROR,
        'Validation failed',
        details
      );
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};