import { BaseHttpException } from "./BaseHttpException";

export class UnauthorizedException extends BaseHttpException {
  constructor() {
    super(401, "UNAUTHORIZED", "Usuário não está autenticado");
  }
}
