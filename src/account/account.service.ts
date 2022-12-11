import { ForbiddenException, Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import { ValidateTransferAccountDto } from '../transaction/dto/validate-transfer-account.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountService {
    constructor(private prisma: PrismaService) {}
    
    async createAccount(dto: CreateAccountDto) {
        const accountNumber = (Math.floor(Math.random() * 10000000000) + 10000000000).toString().substring(1);
        const date = new Date(dto.dateOfBirth);
        const user = await this.prisma.user.create({
            data: {
                firstName: dto.firstName,
                lastName: dto.lastName,
                profilePicture: dto.profilePicture,
                dateOfBirth: date,
                gender: dto.gender,
                email: dto.email,
                phoneNumber: dto.phoneNumber,
                address: dto.address,
                account: {
                    create: {
                        accountType: dto.accountType,
                        pin: dto.pin,
                        accountNumber
                    }
                }
            },
            include: {
                account: true
            }
        })

        const number = user.account.accountNumber;

        return `Account Created! Your Account Number is ${number}.`;
    }

    async updateAccount(dto: UpdateAccountDto) {
        const account = await this.prisma.account.findUnique({
            where: { id: dto.id }
        })

        if(account.pin !== dto.oldPin) throw new ForbiddenException(`Invalid pin`)

        await this.prisma.account.update({
            where: { id: dto.id },
            data: { pin: dto.newPin }
        })

        return `Pin Successfully changed!`
    }

    async verifyAccount(accountNumber: string, pin: string) {
        const account = await this.prisma.account.findUnique({ 
            where: { accountNumber }
        });
        
        if(!account) throw new ForbiddenException(`${accountNumber} is an invalid account number!`)

        if(account.pin !== pin) throw new ForbiddenException(`Invalid pin!`)
        
        return account;
    }

    async validateAccount(accountNumber: string) {
        const account = await this.prisma.account.findUnique({ 
            where: { accountNumber: accountNumber }
        });
        
        if(!account) throw new ForbiddenException(`${accountNumber} is an invalid account number!`)
        return account
    }

    async getUserNamesFromAccount(account: Account) {
        const user = await this.prisma.user.findUnique({ 
            where: {
                id: account.userId
            },
        })

        return (`${user.lastName} ${user.firstName}`)
    }
}
