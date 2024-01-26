import { Currency } from "../model/Currency";
import { User } from "../model/User";
import { Wallet } from "../model/Wallet";

export class WalletDTO {
    
    constructor(
        public id: number,
        public name: string,
        public user: User,
        public currency: Currency,
    ) {}

    static fromModel(wallet: Wallet): WalletDTO {

        const walletDTO = new WalletDTO(
            wallet.id,
            wallet.name,
            wallet.user,
            wallet.currency
        );

        return walletDTO;
    }

    toModel(): Wallet {

        let newWallet = new Wallet();
        newWallet.name = this.name;
        newWallet.user = this.user;
        newWallet.currency = this.currency;

        return newWallet;
    }
}