import { BaseHttpException } from "./BaseHttpException";

export class UnauthorizedTransactionException extends BaseHttpException{
    constructor(){
        super(403, "UNAUTHORIZED TRANSACTION", "Transação não autorizada")
    }
}