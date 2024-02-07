import { BaseHttpException } from "./BaseHttpException";

export class UnauthorizedRefoundException extends BaseHttpException{
    constructor(){
        super(404, "UNAUTHORIZED REFOUND", "Estorno não autorizado")
    }
}