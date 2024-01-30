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
  @OneToMany(() => WalletTransaction, (WalletTransaction) => WalletTransaction.id)
  walletTransaction: WalletTransaction[];
}