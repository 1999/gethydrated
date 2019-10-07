import { NextFunction, Request, RequestHandler, Response } from 'express';

export type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const asyncHandler = (asyncAction: AsyncHandler): RequestHandler => {
  return async (req, res, next) => {
    try {
      await asyncAction(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};
