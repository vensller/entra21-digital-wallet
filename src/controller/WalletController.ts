import { AppDataSource } from "../data-source";
import { WalletDTO } from "../dto/WalletDTO";
import { Wallet } from "../model/Wallet";

export class WalletController {
    constructor() {

    }

    async getWallets() {
        const walletRepository = AppDataSource.getRepository(Wallet);
        const walletList = await walletRepository.find({relations:{
            user: true,
            currency: true
        }});

        return walletList.map((wallet: Wallet) => WalletDTO.fromModel(wallet));
    }

    async createWallet(walletDTO: WalletDTO) {
        const walletRepository = AppDataSource.getRepository(Wallet);
        const newWallet = walletDTO.toModel();
        const savedWallet = await walletRepository.save(newWallet);

        return WalletDTO.fromModel(savedWallet);
    }
}