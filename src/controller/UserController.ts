import { AppDataSource } from "../data-source";
import { User } from "../model/User";
import bcrypt from "bcrypt";
import { WalletTransaction } from "../model/WalletTransaction";

export class UserController {
  async createUser(name: string, email: string, password: string) {
    const userRepository = AppDataSource.getRepository(User);
    const userExists = await userRepository.existsBy({
      email,
    });

    if (userExists) {
      throw new Error("Email já está cadastrado");
    }

    const user = new User();
    user.name = name;
    user.email = email;
    user.password = await bcrypt.hash(password, 10);
  
    return await userRepository.save(user);
  }
}
