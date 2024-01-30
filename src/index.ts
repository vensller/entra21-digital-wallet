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



server.get("/user/:userId/transactions", async (request: Request, response: Response) => {
  try {
    const token = request.headers.authorization?.split(" ")[1];

    const sessionController = new SessionController();
    sessionController.verifyToken(token);

    const userIdParam = request.params.userId;
    console.log('Valor do userIdParam:', userIdParam);

   
    const userId = Number(userIdParam);
    console.log('Tipo do userId (antes da conversão):', typeof userId);

    if (isNaN(userId) || !Number.isInteger(userId)) {
      return response.status(400).json({
        error: 'O parâmetro userId não é um número válido.',
        receivedValue: userIdParam,
      });
    }

    console.log('Valor do userId (após a conversão):', userId);

    const walletController = new WalletController();
    const transactions = await walletController.getTransactionsByUserId(userId);
    return response.status(200).json(transactions);
  } catch (error) {
    console.error('Erro em rota /user/:userId/transactions:', error.message);
    return response.status(500).json({
      error: 'Erro interno do servidor ao buscar transações do usuário.',
    });
  }
});

server.use((req, res, next) => {
  console.log('URL requisitada:', req.url);
  console.log('Parâmetros:', req.params);
  next();
});






AppDataSource.initialize()
  .then(async () => {
    console.log("Banco de dados inicializado...");
    server.listen(SERVER_PORT, () => {
      console.log(`Servidor executando na porta ${SERVER_PORT}`);
    });
  })
  .catch((error) => console.log(error));

 