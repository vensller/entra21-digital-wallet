import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from "typeorm"
import { User } from "./User";
import { Currency } from "./Currency";

@Entity()
export class Wallet {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @ManyToOne(() => Currency, (currency) => currency)
    currency: Currency;

    @ManyToOne(() => User, (user) => user)
    user: User;
}

