import * as jwtManager from "../services/jwtManager";
import { Request, Response, NextFunction } from "express";

const BEARER = "Bearer ";
export async function authorize(req: Request, res: Response, next: NextFunction) {
  const bearerToken = req.headers.authorization;
  if (bearerToken && bearerToken.startsWith(BEARER)) {
    try {
      const token = bearerToken.slice(BEARER.length);
      // @ts-ignore
      req.locals.token = await jwtManager.readToken(token) as any;
      next();
    } catch (unknownErr) {
      const err = unknownErr as Error;

      if (err.name === "TokenExpiredError") {
        res.status(401).json({ error: "Authorization token expired" });
      } else {
        next(err);
      }
    }
  } else {
    res.status(401).json({ error: "Missing authorization token" });
  }
}
