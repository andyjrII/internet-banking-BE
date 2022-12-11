import { ForbiddenException, Injectable } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { PrismaService } from '../prisma/prisma.service';
import { AirtimeDto } from './dto/airtime.dto';
import { TransactionHistoryDto } from './dto/history.dto';
import { TransferDto } from './dto/transfer.dto';
import { ValidateTransferAccountDto } from './dto/validate-transfer-account.dto';

@Injectable()
export class TransactionService {
    constructor(
        private prisma: PrismaService, 
        private accountService: AccountService
    ) {}

    async makeTransfer(dto: TransferDto) {
        const transferFrom = await this.accountService.verifyAccount(dto.transferFrom, dto.pin)
        const transferTo = await this.accountService.validateAccount(dto.transferTo)
        if(!transferTo) throw new ForbiddenException("Invalid Account Number")
        
        let fromBalance = Number(transferFrom.accountBalance)
        let toBalance = Number(transferTo.accountBalance)

        let status: string;
        
        //If balance is insufficient
        // Update User's Account
        if(dto.amount > fromBalance) {
            await this.prisma.account.update({
                where: { id: transferFrom.id},
                data: { 
                    transactions: {
                        create: {
                            transactionType: "DEBIT",
                            transferTo: transferTo.accountNumber,
                            amount: dto.amount,
                            status: "FAILED",
                            description: dto.description,
                            particulars: `TR/${dto.transferFrom}/${dto.transferTo}/${dto.amount}`
                        }  
                    }
                },
                include: {
                    transactions: true
                }
            })
            // Update Beneficiary's account
            await this.prisma.account.update({
                where: { id: transferTo.id},
                data: { 
                    transactions: {
                        create: {
                            transactionType: "CREDIT",
                            transferTo: transferTo.accountNumber,
                            amount: dto.amount,
                            status: "FAILED",
                            description: dto.description,
                            particulars: `TR/${dto.transferFrom}/${dto.transferTo}/${dto.amount}`
                        }  
                    }
                },
                include: {
                    transactions: true
                }
            })
            status = `#${dto.amount} transfer from ${dto.transferFrom} to ${dto.transferTo} failed! Insufficent balance`
            throw new ForbiddenException("Transaction failed! Insufficient Balance.")
        } 
        
        // If balance is sufficient
        fromBalance = fromBalance - dto.amount
        toBalance = Number(toBalance) + Number(dto.amount)
        // Update User's account
        await this.prisma.account.update({
            where: { id: transferFrom.id},
            data: { 
                accountBalance: fromBalance,
                transactions: {
                    create: {
                        transactionType: "DEBIT",
                        transferTo: transferTo.accountNumber,
                        amount: dto.amount,
                        status: "SUCCESSFUL",
                        description: dto.description,
                        particulars: `TR/${dto.transferFrom}/${dto.transferTo}/${dto.amount}`
                    }  
                }
            },
            include: {
                transactions: true
            }
        })
        // Update Beneficiary's account
        await this.prisma.account.update({
            where: { id: transferTo.id},
            data: { 
                accountBalance: toBalance,
                transactions: {
                    create: {
                        transactionType: "CREDIT",
                        transferTo: transferTo.accountNumber,
                        amount: dto.amount,
                        status: "SUCCESSFUL",
                        description: dto.description,
                        particulars: `TR/${dto.transferFrom}/${dto.transferTo}/${dto.amount}`
                    }  
                }
            },
            include: {
                transactions: true
            }
        })

        status = `#${dto.amount} transfer from ${dto.transferFrom} to ${dto.transferTo} was succesfull!`
        return {status, fromBalance}        
    }

    async airtimeTopup(dto: AirtimeDto) {
        const transferFrom = await this.accountService.verifyAccount(dto.payFrom, dto.pin)
        console.log(transferFrom)
        
        let fromBalance = Number(transferFrom.accountBalance)
        let status: string;
        
        // If balance is insufficient
        // Update User's Account
        if(dto.amount > fromBalance) {
            await this.prisma.account.update({
                where: { id: transferFrom.id},
                data: { 
                    transactions: {
                        create: {
                            transactionType: "DEBIT",
                            transferTo: dto.phoneNumber,
                            amount: dto.amount,
                            status: "FAILED",
                            description: "Airtime Top-up",
                            particulars: `TR/${dto.payFrom}/${dto.phoneNumber}/#${dto.amount}`
                        }  
                    }
                },
                include: {
                    transactions: true
                }
            })
            status = `#${dto.amount} airtime top-up from ${dto.payFrom} to ${dto.phoneNumber} failed! Insufficient balance`
            throw new ForbiddenException("Transaction failed! Insufficient Balance.")
        } 
        
        //If balance is sufficient, delete the amount from the User's Account Balance
        fromBalance = fromBalance - dto.amount
        // Update User's account
        await this.prisma.account.update({
            where: { id: transferFrom.id},
            data: { 
                accountBalance: fromBalance,
                transactions: {
                    create: {
                        transactionType: "DEBIT",
                        transferTo: dto.phoneNumber,
                        amount: dto.amount,
                        status: "SUCCESSFUL",
                        description: "Airtime Top-up",
                        particulars: `TR/${dto.payFrom}/${dto.phoneNumber}/#${dto.amount}`
                    }  
                }
            },
            include: {
                transactions: true
            }
        })

        status = `#${dto.amount} airtime top-up from ${dto.payFrom} to ${dto.phoneNumber} was successfull!`
        
        return {status, fromBalance};
    }

    async transactionHistory(dto: TransactionHistoryDto) {
        const account = await this.accountService.validateAccount(dto.accountNumber)
        const transactionHistory = await this.prisma.transaction.findMany({
            where: {
                accountId: account.id,
                status: dto.status,
                transactionType: dto.transactionType,
                transactionDate: {
                    gte: new Date(dto.startDate),
                    lte: new Date(dto.endDate)
                }
            }
        })
        
        return transactionHistory
    }

    async validateTransactionAccount(dto: ValidateTransferAccountDto) {
        const account = await this.accountService.validateAccount(dto.accountNumber)
        const user = await this.accountService.getUserNamesFromAccount(account)
        return user
    }
}
