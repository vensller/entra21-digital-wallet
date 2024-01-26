import { AppDataSource } from "../data-source";
import { CurrencyDTO } from "../dto/CurrencyDTO";
import { Currency } from "../model/Currency";

export class CurrencyController {
    constructor() {

    }

    async getCurrencys() {
        const currencyRepository = AppDataSource.getRepository(Currency);
        const currencyList = await currencyRepository.find();

        return currencyList.map((currency: Currency) => CurrencyDTO.fromModel(currency));
    }

    async createCurrency(currencyDTO: CurrencyDTO) {
        const currencyRepository = AppDataSource.getRepository(Currency);
        const newCurrency = currencyDTO.toModel();
        const savedCurrency = await currencyRepository.save(newCurrency);
        
        return CurrencyDTO.fromModel(savedCurrency);
    }
}