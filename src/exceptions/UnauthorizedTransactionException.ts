import { BaseHttpException } from "./BaseHttpException";

export class UnauthorizedTransactionException extends BaseHttpException {
  constructor() {
    super(401, "UNAUTHORIZED_TRANSACTION", "Transação não autorizada (saldo insuficiente)");
  }
}
