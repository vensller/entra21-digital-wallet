import { BaseHttpException } from "./BaseHttpException";

export class UnauthorizedRefoundException extends BaseHttpException{
    constructor(message: string){
        super(403, "UNAUTHORIZED REFOUND", `Estorno não autorizado - ${message} `)
    }
}