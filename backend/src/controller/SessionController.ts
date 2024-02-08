import { AppDataSource } from "../data-source";
import { UnauthorizedException } from "../exceptions/UnauthorizedException";
import { User } from "../model/User";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = "minha-senha-ultra-secreta";
interface DecodedTokenPayLoad extends JwtPayload {
  userId: number;
}

export class SessionController {
  async login(email: string, password: string) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email });

    if (!user) {
      throw new Error("Usuário ou senha inválidos");
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new Error("Usuário ou senha inválidos");
    }

    return jwt.sign(
      {
        userId: user.id,
      },
      SECRET_KEY
    );
  }

  verifyToken(token?: string) {
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const jwtPayload = jwt.verify(token, SECRET_KEY) as DecodedTokenPayLoad;
      return jwtPayload;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
