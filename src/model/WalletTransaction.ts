import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class WalletTransaction {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  currency: string;
  @Column()
  amount: number;
  @Column()
  amountBRL: number;
  @Column()
  isCredit: boolean;
  @Column()
  createdAt: Date;
}
