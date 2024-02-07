import { BaseHttpException } from "./BaseHttpException";

export class UnauthorizedTransactionException extends BaseHttpException{
    constructor(){
        super(404, "UNAUTHORIZED TRANSACTION", "Transação não autorizada")
    }
}