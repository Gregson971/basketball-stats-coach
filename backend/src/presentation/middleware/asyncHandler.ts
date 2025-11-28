import { Request, Response, NextFunction } from 'express';

/**
 * Type pour les handlers async
 */
type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

/**
 * Wrapper pour gérer les erreurs async dans les controllers
 */
export const asyncHandler = (fn: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
