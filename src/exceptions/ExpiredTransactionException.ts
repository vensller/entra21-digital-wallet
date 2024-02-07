import { BaseHttpException } from "./BaseHttpException";

export class ExpiredTransactionException extends BaseHttpException {
  constructor() {
    super(400, "EXPIRED_TRANSACTION", "A transação não pode ser estornada (data expirada).");
  }
}
