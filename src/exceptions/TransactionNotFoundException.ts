import { BaseHttpException } from "./BaseHttpException";

export class TransactionNotFoundException extends BaseHttpException {
  constructor() {
    super(404, "TRANSACTION_NOT_FOUND", "A transação informada não foi encontrada para este usuário.");
  }
}
