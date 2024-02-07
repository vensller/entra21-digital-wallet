import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class WalletTransaction {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  currency: string;
  @Column("decimal")
  amount: number;
  @Column("decimal")
  amountBRL: number;
  @Column()
  isCredit: boolean;
  @Column()
  createdAt: Date;
  @ManyToOne(() => User, (user) => user.transactions)
  user: User;
  @Column({default: false})
  isRefound: boolean
}
