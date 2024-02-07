import { BaseHttpException } from "./BaseHttpException";

export class TransactionNotFoundException extends BaseHttpException{
    constructor(){
        super(404, "TRANSACTION NOT FOUND", "Transação não localizada.")
    }
}