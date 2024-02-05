import { NextFunction, Request, Response } from "express";

export default async (
  request: Request,
  response: Response,
  next: NextFunction,
  action: Function
) => {
  try {
    await action(request, response, next);
  } catch (error) {
    next(error);
  }
};
