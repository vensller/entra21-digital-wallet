// model/User.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { WalletTransaction } from "./WalletTransaction";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => WalletTransaction, transaction => transaction.user)
  transactions: WalletTransaction[];
}
