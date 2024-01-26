import { User } from "../model/User";

export class UserDTO {
    
    constructor(
        public id: number,
        public name: string,
        public document: number,
        public email: string,
        public password: string
    ) {}

    static fromModel(user: User): UserDTO {

        const userDTO = new UserDTO(
            user.id,
            user.name,
            user.document,
            user.email,
            undefined
        );

        return userDTO;
    }

    toModel(): User {

        let newUser = new User();
        newUser.name = this.name;
        newUser.document = this.document;
        newUser.email = this.email;
        newUser.password = this.password

        return newUser;
    }
}