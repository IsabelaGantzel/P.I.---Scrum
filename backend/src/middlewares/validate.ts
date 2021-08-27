import Joi from "joi";
import { Request, Response, NextFunction } from "express";

/**
 * Create a validation middleware by a Joi Schema model
 */
export function validate(schema: Joi.Schema, picker = (req: Request) => req.body) {
  return (req: Request, res: Response, next: NextFunction) => {
    const options = {
      abortEarly: false, // include all errors
    };
    const { error, value } = schema.validate(picker(req), options);
    if (error) {
      const errors = error.details.map((x) => x.message);
      res.status(400).json({
        error: `Validation error: ${errors.join(", ")}`,
        errors,
      });
    } else {
      req.body = value;
      next();
    }
  };
}
