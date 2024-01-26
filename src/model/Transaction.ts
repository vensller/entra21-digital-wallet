import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Wallet } from "./Wallet";
import { Currency } from "./Currency";

@Entity()
export class WalletTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Currency, (currency) => currency)
  currency: Currency;

  @ManyToOne(() => Wallet, (wallet) => wallet)
  wallet: Wallet;

  @Column({type: "numeric"})
  amount: number

  @Column({type: "numeric"})
  amountBRL: number

  @Column()
  isCredit: boolean;

  @Column()
  createdAt: Date;
}
