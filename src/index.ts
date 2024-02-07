import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { WalletController } from "./controller/WalletController";
import { UserController } from "./controller/UserController";
import { SessionController } from "./controller/SessionController";
import {
  AuthenticatedRequest,
  AuthenticationMiddleware,
} from "./middleware/AuthenticationMiddleware";
import { BaseHttpException } from "./exceptions/BaseHttpException";
import "express-async-errors";
import { request } from "http";

const SERVER_PORT = 3000;
const server = express();
server.use(express.json());

server.post(
  "/login",
  async (request: Request, response: Response, next: NextFunction) => {
    const sessionController = new SessionController();
    const token = await sessionController.login(
      request.body.email,
      request.body.password
    );
    return response.status(200).json({
      token,
    });
  }
);

server.post("/user", async (request: Request, response: Response) => {
  const userController = new UserController();
  try {
    const user = await userController.createUser(
      request.body.name,
      request.body.email,
      request.body.password
    );
    return response.status(201).json(user);
  } catch (e) {
    return response.status(400).json({
      error: e.message,
    });
  }
});

server.use(new AuthenticationMiddleware().validateAuthentication);

server.post(
  "/wallet/transaction",
  async (request: AuthenticatedRequest, response: Response) => {
    const userId = request.userId;

    const walletController = new WalletController();
    const transaction = await walletController.createTransaction(
      request.body.currency,
      request.body.amount,
      request.body.isCredit,
      userId
    );
    return response.status(201).json(transaction);
  }
);

server.get(
  "/wallet/statement",
  async (request: AuthenticatedRequest, response: Response) => {
    const userId = request.userId;
    const walletController = new WalletController();
    const statement = await walletController.getStatement(userId);
    return response.status(200).json(statement);
  }
);

server.get(
  "/wallet/amount",
  async (request: AuthenticatedRequest, response: Response) => {
    const userId = request.userId;
    const walletController = new WalletController();
    const amoutBRL = await walletController.getAmount(userId);
    return response.status(200).json(amoutBRL);
  }
);

server.post(
  "/wallet/:id/refound",
  async (request: AuthenticatedRequest, response: Response) => {
    const userId = request.userId;
    const transactionId = Number(request.params.id);
    const walletController = new WalletController();
    const amoutBRL = await walletController.refoundTransaction(userId, transactionId);
    return response.status(200).json(amoutBRL);
  }
);

server.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    const exception = err as BaseHttpException;

    if (exception.statusCode) {
      return response.status(exception.statusCode).json({
        error: exception.message,
        errorCode: exception.errorCode,
      });
    }

    return response.status(500).json({ error: exception.message });
  }
);

AppDataSource.initialize()
  .then(async () => {
    console.log("Banco de dados inicializado...");
    server.listen(SERVER_PORT, () => {
      console.log(`Servidor executando na porta ${SERVER_PORT}`);
    });
  })
  .catch((error) => console.log(error));
