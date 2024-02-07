import { BaseHttpException } from "./BaseHttpException";

export class UserNotFoundException extends BaseHttpException {
  constructor() {
    super(404, "USER_NOT_FOUND", "Usuário ou senha não existem.");
  }
}
