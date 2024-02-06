import { BaseHttpException } from "./BaseHttpException";

export class NonexistentUserException extends BaseHttpException{
    constructor(){
        super(404, "NONEXISTENT USER", "Usuário não existe")
    }
}