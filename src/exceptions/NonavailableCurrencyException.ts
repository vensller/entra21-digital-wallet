import { BaseHttpException } from "./BaseHttpException";

export class NonavailableCurrencyException extends BaseHttpException{
    constructor(){
        super(404, "NONAVAILABLE CURRENCY", "Conversão para essa moeda não está disponível")
    }
}