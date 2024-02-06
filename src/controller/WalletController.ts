import axios from "axios";
import { AppDataSource } from "../data-source";
import { WalletTransaction } from "../model/WalletTransaction";
import { log } from "console";
import { Session } from "inspector";
import { SessionController } from "./SessionController";
import { User } from "../model/User";

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
          throw new Error(`Conversion rate not available for ${currency}.`);
        }
      } catch (error) {
        throw new Error(`Failed to fetch exchange rates: ${error}`);
      }
  }

  async convertCurrency(currency: string, amount: number): Promise<number> {
    const exchangedRate = await this.fetchExchangeRates(currency);

    if (exchangedRate) {
      const convertedAmount = amount * exchangedRate;
      return Number(convertedAmount.toFixed(2));
    } else {
      throw new Error(`Conversion rate not available for ${currency}`);
    }
  }

  async createTransaction(currency: string, amount: number, isCredit: boolean, userId: any) {
    const transactionRepository =
      AppDataSource.getRepository(WalletTransaction);
    const transaction = new WalletTransaction();
    transaction.amount = amount;
    transaction.amountBRL = await this.convertCurrency(currency, amount);
    transaction.isCredit = isCredit;
    transaction.currency = currency;
    transaction.createdAt = new Date();
    transaction.user = userId;

    const savedTransaction = await transactionRepository.save(transaction);
    return savedTransaction;
  }

  async getStatement(userId: number) {
    const transactionRepository =
      AppDataSource.getRepository(WalletTransaction);
    return await transactionRepository.find({
      where: {user: {id: userId}},
      order: {},
    });
  }

  async getAmount(userId: number): Promise<number> {
    const transactionRepository =
      AppDataSource.getRepository(WalletTransaction);

    try {
      const transactions = await transactionRepository.find({
        where: {user: {id: userId}}});
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
}
