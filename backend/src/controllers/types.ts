import { Request, Response } from "express";

export type AppRequest = Request & {
  locals: {
    token: {
      personId: number
    }
  }
}
export type AppResponse = Response;
