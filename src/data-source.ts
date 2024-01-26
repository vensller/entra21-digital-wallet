import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./model/User";
import { WalletTransaction } from "./model/Transaction";
import { Wallet } from "./model/Wallet";
import { Currency } from "./model/Currency";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "Senac@2021",
  database: "carteira-digital",
  synchronize: true,
  logging: false,
  entities: [User, WalletTransaction, Wallet, Currency],
  migrations: [],
  subscribers: [],
});
