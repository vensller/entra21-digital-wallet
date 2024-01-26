import "reflect-metadata"
import { AppDataSource } from "./data-source"
import express, { Request, Response, json } from 'express';
import { UserController } from "./controller/UserController";
import { UserDTO } from "./dto/UserDTO";
import { CurrencyController } from "./controller/CurrencyController";
import { CurrencyDTO } from "./dto/CurrencyDTO";
import { WalletController } from "./controller/WalletController";
import { WalletDTO } from "./dto/WalletDTO";
import { WalletTransactionController} from "./controller/TransactionController";
import { TransactionDTO } from "./dto/TransactionDTO";
import { SessionController } from "./controller/SessionController";
import { log } from "console";

type Token = {
  userId: number,
  iat: number,
}

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

server.get("", (request: Request, response: Response) => {
  return response.send("O servidor está funcionando");
});

server.get("/users", async (request: Request, response: Response) => {
  const userController = new UserController();
  return response.json(await userController.getUsers());
});

server.post("/users", async (request: Request, response: Response) => {
  try{
    const userController = new UserController();
    const newUser = await userController.createUser(new UserDTO(
      null,
      request.body.name,
      request.body.document,
      request.body.email,
      request.body.password
    ));
    
    return response.status(201).json(newUser);
  } catch (error){
    console.log(error);
    
    return response.status(400).json(error.message)
  }

});

server.get("/currencys", async (request: Request, response: Response) => {
  const currencyController = new CurrencyController();
  return response.json(await currencyController.getCurrencys());
});

server.post("/currency", async (request: Request, response: Response) => {
  const currencyController = new CurrencyController();
  const newCurrency = await currencyController.createCurrency(new CurrencyDTO(
    null,
    request.body.name,
    request.body.acronym,
  ));

  return response.status(201).json(newCurrency);
});

server.get("/wallets", async (request: Request, response: Response) => {
  const walletController = new WalletController();
  return response.json(await walletController.getWallets());
});

server.post("/wallet", async (request: Request, response: Response) => {
  const walletController = new WalletController();
  const newWallet = await walletController.createWallet(new WalletDTO(
    null,
    request.body.name,
    request.body.user,
    request.body.currency
  ));

  return response.status(201).json(newWallet);
});

server.post("/wallet/transaction", async (request: Request, response: Response) => {
    const walletTransactionController = new WalletTransactionController();
    const transaction = await walletTransactionController.createTransaction(new TransactionDTO(
      null,
      request.body.amount,
      null,
      request.body.isCredit,
      request.body.currency,
      request.body.wallet,
      new Date()
    ));

    return response.status(201).json(transaction);
});

server.get("/wallet/statement", async (request: Request, response: Response) => {
  try {
    const token = request.headers.authorization?.split(" ")[1];
    const sessionController = new SessionController();
    let userId = sessionController.verifyToken(token).userId;    
    const walletTransactionController = new WalletTransactionController();
    const statement = await walletTransactionController.getStatementByUser(userId);
    return response.status(200).json(statement);
  } catch (error) {
    return response.status(401).json({
      error: error.message,
    });
  }
});

server.get("/wallet/statement/currency/:currencyId", async (request: Request, response: Response) => {
  try {
    const currencyId = Number(request.params.currencyId);
    const token = request.headers.authorization?.split(" ")[1];
    const sessionController = new SessionController();
    let userId = sessionController.verifyToken(token).userId;    
    const walletTransactionController = new WalletTransactionController();
    const statement = await walletTransactionController.getStatementByUserAndCurrency(userId,currencyId);
    return response.status(200).json(statement);
  } catch (error) {
    return response.status(401).json({
      error: error.message,
    });
  }
});

server.get("/wallet/statement/inCurrency/:currencyId", async (request: Request, response: Response) => {
  try {
    const currencyId = Number(request.params.currencyId);
    const token = request.headers.authorization?.split(" ")[1];
    const sessionController = new SessionController();
    let userId = sessionController.verifyToken(token).userId;    
    const walletTransactionController = new WalletTransactionController();
    const statement = await walletTransactionController.getStatementInCurrency(userId, currencyId);
    return response.status(200).json(statement);
  } catch (error) {
    return response.status(401).json({
      error: error.message,
    });
  }
});

AppDataSource.initialize()
  .then(async () => {
    console.log("Banco de dados inicializado...");
    server.listen(SERVER_PORT, () => {
      console.log(`Servidor executando na porta ${SERVER_PORT}`);
    });
  })
  .catch((error) => console.log(error));
