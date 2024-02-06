import { BaseHttpException } from "./BaseHttpException";

export class UnexchangeableRateException extends BaseHttpException {
  constructor() {
    super(400, "UNEXCHANGEABLE", "Não é possível converter a moeda selecionada");
  }
}
