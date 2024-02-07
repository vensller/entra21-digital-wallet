import axios from "axios";
import { AppDataSource } from "../data-source";
import { WalletTransaction } from "../model/WalletTransaction";
import { error, log } from "console";
import { Session } from "inspector";
import { SessionController } from "./SessionController";
import { User } from "../model/User";
import { NonavailableCurrencyException } from "../exceptions/NonavailableCurrencyException";
import { UnauthorizedTransactionException } from "../exceptions/UnauthorizedTransactionException";
import { get } from "http";
import { UnauthorizedRefoundException } from "../exceptions/UnauthorizedRefoundException";
import moment from "moment";

export class WalletController {
  async fetchExchangeRates(currency: string) {
    if (currency == "BRL") {
      return 1;
    } else
      try {
        const response = await axios.get(
          `https://economia.awesomeapi.com.br/last/${currency}-BRL`
        );
        const exchangedRate = response.data?.[`${currency}BRL`]?.ask;

        if (exchangedRate) {
          return parseFloat(exchangedRate);
        }
        if (!exchangedRate) {
          throw new NonavailableCurrencyException();
        }
      } catch (error) {
        throw new NonavailableCurrencyException();
      }
  }

  async convertCurrency(currency: string, amount: number): Promise<number> {
    const exchangedRate = await this.fetchExchangeRates(currency);

    if (exchangedRate) {
      const convertedAmount = amount * exchangedRate;
      return Number(convertedAmount.toFixed(2));
    } else {
      throw new NonavailableCurrencyException();
    }
  }
  async createTransaction(
    currency: string,
    amount: number,
    isCredit: boolean,
    userId: any
  ) {
    const transactionRepository =
      AppDataSource.getRepository(WalletTransaction);
    const convertedAmountBRL: number = await this.convertCurrency(
      currency,
      amount
    );
    const transaction = new WalletTransaction();
    transaction.amount = amount;
    transaction.amountBRL = convertedAmountBRL;
    transaction.isCredit = isCredit;
    transaction.currency = currency;
    transaction.createdAt = new Date();
    transaction.user = userId;

    if (isCredit == false) {
      const currentAmout = this.getAmount(userId);
      if ((await currentAmout) < convertedAmountBRL) {
        throw new UnauthorizedTransactionException();
      }
    }

    const savedTransaction = await transactionRepository.save(transaction);
    return savedTransaction;
  }

  async getStatement(userId: number) {
    const transactionRepository =
      AppDataSource.getRepository(WalletTransaction);
    return await transactionRepository.find({
      where: { user: { id: userId } },
      order: {},
    });
  }

  async getAmount(userId: number): Promise<number> {
    const transactionRepository =
      AppDataSource.getRepository(WalletTransaction);

    try {
      const transactions = await transactionRepository.find({
        where: { user: { id: userId } },
      });
      const allTransactions = transactions.filter(
        (transaction) => transaction.currency
      );

      let totalAmountBRL = 0;

      for (const transaction of allTransactions) {
        const totalBRLAmount = await this.convertCurrency(
          transaction.currency,
          transaction.amount
        );

        if (transaction.isCredit == true) {
          totalAmountBRL += totalBRLAmount;
        } else if (transaction.isCredit == false) {
          totalAmountBRL -= totalBRLAmount;
        }
      }

      return Number(totalAmountBRL.toFixed(2));
    } catch (error) {
      console.error("Error in getAmount");
      throw error;
    }
  }

  async refoundTransaction(userId: number, transactionId: number) {
    const userStatements = await this.getStatement(userId);
    const foundTransaction = userStatements.find(
      (WalletTransaction) => WalletTransaction.id == transactionId
    );
    if (!foundTransaction) {
      throw new UnauthorizedRefoundException("");
    }
    if (foundTransaction.isRefound == true) {
      throw new UnauthorizedRefoundException("Transação já estornada");
    }
    if (foundTransaction && !foundTransaction.isRefound) {
      const transactionDate: moment.Moment = moment(foundTransaction.createdAt);
      const expiredTransaction = moment().subtract(0, "days");

      if(transactionDate.isBefore(expiredTransaction)){
        throw new UnauthorizedRefoundException("Transação foi feita há mais de 7 dias");
      }
      foundTransaction.isRefound = true;
      const transactionRepository =
        AppDataSource.getRepository(WalletTransaction);
      await transactionRepository.save(foundTransaction);
  
      this.createTransaction(
        foundTransaction.currency,
        foundTransaction.amount,
        !foundTransaction.isCredit,
        userId
      );
    }
    
  }
}

