import { Currency } from "../model/Currency"
import { Wallet } from "../model/Wallet"
import { WalletTransaction } from "../model/Transaction"

export class TransactionDTO {
    
    constructor(        
        public id : number,
        public amount: number,
        public amountBRL: number,
        public isCredit: boolean,
        public currency: Currency,
        public wallet: Wallet,
        public createdAt: Date,
    ){}

    static fromModel(transaction: WalletTransaction): TransactionDTO {
        const transactionDTO = new TransactionDTO(
            transaction.id,
            transaction.amount,
            transaction.amountBRL,
            transaction.isCredit,
            transaction.currency,
            transaction.wallet,
            transaction.createdAt
        )

        return transactionDTO
    }

    static fromModelWithSum(transaction: WalletTransaction): TransactionDTO {

        const transactionDTO = new TransactionDTO(
            undefined,
            transaction.amount,
            undefined,
            undefined,
            transaction.currency,
            undefined,
            undefined,
        )

        return transactionDTO
    }

    toModel(): WalletTransaction {

        let newWalletTransaction = new WalletTransaction();
        newWalletTransaction.amount = this.amount,
        newWalletTransaction.amountBRL = this.amountBRL,
        newWalletTransaction.isCredit = this.isCredit,
        newWalletTransaction.currency = this.currency,
        newWalletTransaction.wallet = this.wallet,
        newWalletTransaction.createdAt = this.createdAt

        return newWalletTransaction;
    }

}

