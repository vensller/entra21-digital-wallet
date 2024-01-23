import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
