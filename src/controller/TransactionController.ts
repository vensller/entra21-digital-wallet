import { AppDataSource } from "../data-source";
import { Currency } from "../model/Currency";
import { WalletTransaction } from "../model/Transaction";
import axios from "axios";
import { TransactionDTO } from "../dto/TransactionDTO";

type currencyQuote = {
  from: string,
  to: string,
  bid: number,
}

export class WalletTransactionController {
  
  async getStatements() {
    const transactionRepository = AppDataSource.getRepository(WalletTransaction);
    const statementList = await transactionRepository.find({
      relations: {
        currency: true,
        wallet: true
      },
      order: {
        createdAt: "DESC"
      },
    });

    return statementList.map((transaction: WalletTransaction) => TransactionDTO.fromModel(transaction))
  }

  async getStatementByUser(userId: number) {
    const transactionRepository = AppDataSource.getRepository(WalletTransaction);
    const statementList = await transactionRepository.find({
      relations: {
        currency: true,
        wallet: true
      },
      where: {
        wallet: {
          user: {
            id: userId
          }
        }
      },
      order: {
        createdAt: "DESC"
      },
    });
    
    return statementList.map((transaction: WalletTransaction) => TransactionDTO.fromModel(transaction))
  }

  async getStatementByUserAndCurrency(userId: number, currencyId: number) {
    const transactionRepository = AppDataSource.getRepository(WalletTransaction);
    const statementList = await transactionRepository.find({
      relations: {
        currency: true,
        wallet: true
      },
      where: {
        wallet: {
          user: {
            id: userId
          },
          currency: {
            id: currencyId
          }
        }
      },
      order: {
        createdAt: "DESC"
      },
    })

    return statementList.map((transaction: WalletTransaction) => TransactionDTO.fromModel(transaction))
  }

  async getStatementInCurrency(userId: number, currencyId: number) {
    const transactionRepository = AppDataSource.getRepository(WalletTransaction);
    const statementList = await transactionRepository.find({
      select: {
        amount: true,
        currency: { acronym: true }
      },
      relations: {
        currency: true
      },
      where: {
        wallet: {
          user: {
            id: userId
          }
        }
      }
    })
    const amountList = [];
    const currencyRepository = AppDataSource.getRepository(Currency);
    const inCurrency = await currencyRepository.findOneBy({id : currencyId})

    for (let i = 0; i < statementList.length; i++) {
      const statement = statementList[i];

      let amountInCurrency = await convertCurrencys(statement.currency.id, currencyId, statement.amount)
      console.log('amountInCurrency', amountInCurrency);
      console.log('amountList', amountList);
      
      amountList.push(amountInCurrency)
      
    }

    let statementInCurrency: WalletTransaction = {
      id: undefined,
      wallet: undefined,
      amountBRL: undefined,
      isCredit: undefined,
      createdAt: undefined,
      amount: amountList.reduce((a, b)=> a + b ),
      currency: inCurrency
    }

    console.log();
    

    return TransactionDTO.fromModelWithSum(statementInCurrency)
  }

  async createTransaction(transactionDTO: TransactionDTO) {
    try{
      const transactionRepository = AppDataSource.getRepository(WalletTransaction)
      const currencyRepository = AppDataSource.getRepository(Currency);
      const fromCurrency: Currency = await currencyRepository.findOneBy({ acronym: "BRL" });
      let amountBRL: number = await convertCurrencys(transactionDTO.currency,fromCurrency.id,transactionDTO.amount)
      transactionDTO.amountBRL = amountBRL
      const newTransaction = transactionDTO.toModel()
      const savedTransaction = await transactionRepository.save(newTransaction)
      return savedTransaction
    }catch(error){
      return error.message
    }

  }
}

async function convertCurrencys(FromCurrency, ToCurrency, amount: number) {
  try {
    const currencyRepository = AppDataSource.getRepository(Currency);
    const fromCurrency: Currency = await currencyRepository.findOneBy({ id: FromCurrency });  
    const toCurrency: Currency = await currencyRepository.findOneBy({ id: ToCurrency });  

    const req = axios.create({
        baseURL: 'https://economia.awesomeapi.com.br/json/',
    })
    
    if(fromCurrency.acronym != toCurrency.acronym){
      const response = await req.get(`/${fromCurrency.acronym}-${toCurrency.acronym}`)

      let amountResponse: currencyQuote = {
        from: response.data[0].code,
        to: response.data[0].codein,
        bid: response.data[0].bid,
      }    
    
      return (amount * amountResponse.bid);
    }

    if(fromCurrency.acronym === toCurrency.acronym){
      return Number(amount)
    }

    
  } 
  catch(error) {
    throw new Error(`Impossível converter de ${FromCurrency} para ${ToCurrency}`)
  }
}