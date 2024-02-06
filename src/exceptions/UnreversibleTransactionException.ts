import { BaseHttpException } from "./BaseHttpException";

export class UnreversibleTransactionException extends BaseHttpException {
  constructor() {
    super(404, "UNREVERSIBLE", "A transação não pode ser estornada.");
  }
}
