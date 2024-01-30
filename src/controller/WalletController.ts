// controller/WalletController.ts
import axios from 'axios';
import { AppDataSource } from "../data-source";
import { WalletTransaction } from "../model/WalletTransaction";
import { User } from "../model/User";

export class WalletController {
  async fetchExchangeRates(currency: string) {
    if (currency == "BRL") {
      return 1;
    } else try {
      const response = await axios.get(`https://economia.awesomeapi.com.br/last/${currency}-BRL`);
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

  async createTransaction(currency: string, amount: number, isCredit: boolean) {
    const transactionRepository = AppDataSource.getRepository(WalletTransaction);
    const transaction = new WalletTransaction();
    transaction.amount = amount;
    transaction.amountBRL = await this.convertCurrency(currency, amount);
    transaction.isCredit = isCredit;
    transaction.currency = currency;
    transaction.createdAt = new Date();

    
    const userId= 1; 
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({where:{id:userId}});

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    transaction.user = user;

    const savedTransaction = await transactionRepository.save(transaction);
    return savedTransaction;
  }

  async getStatement() {
    const transactionRepository = AppDataSource.getRepository(WalletTransaction);
    return await transactionRepository.find({
      order: {},
    });
  }

  async getAmount(): Promise<number> {
    const transactionRepository = AppDataSource.getRepository(WalletTransaction);

    try {
      const transactions = await transactionRepository.find();
      const allTransactions = transactions.filter(transaction => transaction.currency);

      let totalAmountBRL = 0;

      for (const transaction of allTransactions) {
        const totalBRLAmount = await this.convertCurrency(transaction.currency, transaction.amount);
        totalAmountBRL += totalBRLAmount;
      }

      return Number((totalAmountBRL).toFixed(2));

    } catch (error) {
      console.error('Error in getAmount', error);
      throw error;
    }
  }

  async getTransactionsByUserId(userId: number): Promise<WalletTransaction[]> {
    const userRepository = AppDataSource.getRepository(User);

    try {
        const user = await userRepository.findOne({
            where: { id: userId },
            relations: {transactions:true}
        });
        console.log(user);
        

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        return user.transactions || [];
    } catch (error) {
        console.error('Erro em getTransactionsByUserId:', error.message);
        throw new Error('Erro ao buscar transações do usuário');
    }
}
}