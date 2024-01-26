import { AppDataSource } from "../data-source";
import { UserDTO } from "../dto/UserDTO";
import { User } from "../model/User";
import bcrypt from "bcrypt"

export class UserController {
    constructor() {

    }

    async getUsers() {
        const userRepository = AppDataSource.getRepository(User);
        const usersList = await userRepository.find();
        return usersList.map((user: User) => UserDTO.fromModel(user));
    }

    async createUser(userDTO: UserDTO) {
        const userRepository = AppDataSource.getRepository(User);
        const userExists = await userRepository.existsBy({
            email: userDTO.email,
        })

        if(userExists){
            throw new Error(`O e-mail ${userDTO.email} já está cadastrado`) 
        }

        userDTO.password = await bcrypt.hash(userDTO.password, 10)
        const newUser = userDTO.toModel();
        const savedUser = await userRepository.save(newUser);
        return UserDTO.fromModel(savedUser);
    }
}