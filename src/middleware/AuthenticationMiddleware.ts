import { NextFunction, Request, Response } from "express";
import { SessionController } from "../controller/SessionController";

export interface AuthenticatedRequest extends Request {
  userId: number;
}

export class AuthenticationMiddleware {
  async validateAuthentication(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const token = request.headers.authorization?.split(" ")[1];
      const sessionController = new SessionController();
      const jwtPayload = sessionController.verifyToken(token);
      (request as AuthenticatedRequest).userId = jwtPayload.userId;
      next();
    } catch (error) {
      next(error);
    }
  }
}
