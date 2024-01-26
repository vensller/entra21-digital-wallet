import express, { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { WalletController } from "./controller/WalletController";
import { UserController } from "./controller/UserController";
import { SessionController } from "./controller/SessionController";

const SERVER_PORT = 3000;
const server = express();
server.use(express.json());

server.post("/login", async (request: Request, response: Response) => {
  const sessionController = new SessionController();
  try {
    const token = await sessionController.login(
      request.body.email,
      request.body.password
    );
    return response.status(200).json({
      token,
    });
  } catch (e) {
    return response.status(400).json({
      error: e.message,
    });
  }
});

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

server.post(
  "/wallet/transaction",
  async (request: Request, response: Response) => {
    const walletController = new WalletController();
    const transaction = await walletController.createTransaction(
      request.body.currency,
      request.body.amount,
      request.body.isCredit
    );
    return response.status(201).json(transaction);
  }
);

server.get(
  "/wallet/statement",
  async (request: Request, response: Response) => {
    try {
      const token = request.headers.authorization?.split(" ")[1];
      const sessionController = new SessionController();
      sessionController.verifyToken(token);
    } catch (error) {
      return response.status(401).json({
        error: error.message,
      });
    }
    const walletController = new WalletController();
    const statement = await walletController.getStatement();
    return response.status(200).json(statement);
  }
);


server.get("/wallet/amount", async (_: Request, response: Response) => {
  const walletController = new WalletController();
  const amoutBRL = await walletController.getAmount();
  return response.status(200).json(amoutBRL);
});



AppDataSource.initialize()
  .then(async () => {
    console.log("Banco de dados inicializado...");
    server.listen(SERVER_PORT, () => {
      console.log(`Servidor executando na porta ${SERVER_PORT}`);
    });
  })
  .catch((error) => console.log(error));
