import { AppDataSource } from "../data-source";
import { WalletTransaction } from "../model/WalletTransaction";
import axios from 'axios';

interface ApiResponse {
  [key: string]: any;
  // aqui permite que qualquer propriedade seja acessada dinamicamente (vindo da API)
}

export class WalletController {

  private static readonly API_URL = "https://economia.awesomeapi.com.br/last/";

  async createTransaction(currency: string, amount: number, isCredit: boolean) {

    const transactionRepository =
      AppDataSource.getRepository(WalletTransaction);
    const transaction = new WalletTransaction();
    transaction.amount = amount;
    transaction.amountBRL = await this.convertToBRL(currency, amount); //aqui vai a função para converter, utilizando a conversão da API (e multiplicar pelo amount)
    transaction.isCredit = isCredit;
    transaction.currency = currency;
    transaction.createdAt = new Date();
    const savedTransaction = await transactionRepository.save(transaction);
    return savedTransaction;
  }



  async convertToBRL(currency: string, amount: number): Promise<number> {
    if (currency == "BRL")

      return amount;

    const response = await axios.get(`${WalletController.API_URL}${currency}-BRL`);

    const currencyToBRLObj = response.data[`${currency}BRL`];

    console.log(amount);

    if (currencyToBRLObj) {
      const exchangeRate = currencyToBRLObj.bid
      const amountBRL = amount * exchangeRate;

      console.log(amountBRL);

      return amountBRL;
    } else {

      throw new Error(`Failed to retrieve exchange rate for ${currency}-BRL`);
    }
  }

  async getStatement() {
    const transactionRepository =
      AppDataSource.getRepository(WalletTransaction);
    return await transactionRepository.find({
      order: {},
    });
  }

  //------------------

  async getSumAmountBRL() {
    const transactionRepository = AppDataSource.getRepository(WalletTransaction);
    const transactions = await transactionRepository.find({
      order: {},
    });

    // Soma dos montantes convertidos para BRL
    let sumAmountBRL = 0;

    // Iterar sobre as transações e calcular a soma
    for (const transaction of transactions) {
      const amountBRL = await this.convertToBRL(transaction.currency, transaction.amount);
      sumAmountBRL += amountBRL;
    }

    return sumAmountBRL;
  }
}