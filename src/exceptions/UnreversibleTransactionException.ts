import { BaseHttpException } from "./BaseHttpException";

export class UnreversibleTransactionException extends BaseHttpException {
  constructor() {
    super(400, "UNREVERSIBLE", "A transação não pode ser estornada (já houve estorno).");
  }
}
