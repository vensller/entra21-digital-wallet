import express, { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { WalletController } from "./controller/WalletController";
// import axios from 'axios';

const SERVER_PORT = 3000;
const server = express();
server.use(express.json());

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

server.get("/wallet/statement", async (_: Request, response: Response) => {
  const walletController = new WalletController();
  const statement = await walletController.getStatement();
  return response.status(200).json(statement);
});

// server.get("/wallet", async (_: Request, response: Response) => {
//   const walletController = new WalletController();
//   const sumAmount = await walletController.getStatement();
//   return response.status(200).json(sumAmount);
// });

server.get("/wallet/sumAmountBRL", async (_: Request, response: Response) => {
  const walletController = new WalletController();
  const sumAmountBRL = await walletController.getSumAmountBRL();
  return response.status(200).json({ sumAmountBRL });
});


AppDataSource.initialize()
  .then(async () => {
    console.log("Banco de dados inicializado...");
    server.listen(SERVER_PORT, () => {
      console.log(`Servidor executando na porta ${SERVER_PORT}`);
    });
  })
  .catch((error) => console.log(error));
