import { Request, Response, NextFunction } from 'express';

/**
 * Middleware de validation des paramètres requis
 */
export const validateRequiredFields = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missingFields: string[] = [];

    for (const field of fields) {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields',
        missingFields,
      });
      return;
    }

    next();
  };
};

/**
 * Middleware de validation des paramètres d'URL
 */
export const validateParam = (param: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.params[param]) {
      res.status(400).json({
        success: false,
        error: `Missing required parameter: ${param}`,
      });
      return;
    }

    next();
  };
};
