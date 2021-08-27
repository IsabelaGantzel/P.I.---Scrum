import { Request, Response, NextFunction } from "express";

export function locals(req: Request, _res: Response, next: NextFunction) {
  // @ts-ignore
  req.locals = {};
  next();
}
