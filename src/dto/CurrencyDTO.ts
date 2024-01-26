import { Currency } from "../model/Currency";

export class CurrencyDTO {
    
    constructor(
        public id: number,
        public name: string,
        public acronym: string,
    ) {}

    static fromModel(currency: Currency): CurrencyDTO {

        const currencyDTO = new CurrencyDTO(
            currency.id,
            currency.name,
            currency.acronym
        );

        return currencyDTO;
    }

    toModel(): Currency {

        let newCurrency = new Currency();
        newCurrency.name = this.name;
        newCurrency.acronym = this.acronym;

        return newCurrency;
    }
}