import { AppDataSource } from "../data-source";
import { WalletTransaction } from "../model/WalletTransaction";

export class WalletController {
  async createTransaction(currency: string, amount: number, isCredit: boolean) {
    const transactionRepository =
      AppDataSource.getRepository(WalletTransaction);
    const transaction = new WalletTransaction();
    transaction.amount = amount;
    transaction.amountBRL = amount;
    transaction.isCredit = isCredit;
    transaction.currency = currency;
    transaction.createdAt = new Date();
    const savedTransaction = await transactionRepository.save(transaction);
    return savedTransaction;
  }

  async getStatement() {
    const transactionRepository =
      AppDataSource.getRepository(WalletTransaction);
    return await transactionRepository.find({
      order: {},
    });
  }
}
