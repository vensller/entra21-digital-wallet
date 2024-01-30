import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class WalletTransaction {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  currency: string;
  @Column('decimal')
  amount: number;
  @Column('decimal')
  amountBRL: number;
  @Column()
  isCredit: boolean;
  @Column()
  createdAt: Date;
  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
