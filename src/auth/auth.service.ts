import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { AccountService } from '../account/account.service';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types/token.type';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from './dto/signin.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService, 
        private accountService: AccountService,
        private jwtService: JwtService
    ) {}
    
    async signup(dto: SignupDto): Promise<Tokens> {
        const account = await this.accountService.verifyAccount(dto.accountNumber, dto.pin)
        const userId = account.userId
        const hash = await this.hashData(dto.password)
        const user = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password: hash
            }
        });

        const tokens = await this.getTokens(user.id, user.email)
        await this.updateRTHash(user.id, tokens.refreshToken)
        return tokens
    }

    async signin(dto: SigninDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }   
        })

        if(!user) throw new ForbiddenException("Access denied!")

        const id = user.id;

        const passwordMatches = await bcrypt.compare(dto.password, user.password)
        if(!passwordMatches) throw new ForbiddenException("Access denied!")
        
        const tokens = await this.getTokens(user.id, user.email)
        await this.updateRTHash(user.id, tokens.refreshToken)
        
        return {tokens, id}
    }

    async logout(id: string) {
        await this.prisma.user.updateMany({
            where: {
                id,
                refreshToken: {
                    not: null
                }
            },
            data: {
                refreshToken: null
            }
        })
    }

    async refresh(refreshToken: string, id: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id
            }
        })

        if(!user || !user.refreshToken) throw new ForbiddenException("Access Denied!")

        const rtMatches = await bcrypt.compare(refreshToken, user.refreshToken)
        if(!rtMatches) throw new ForbiddenException("Access Denied!")

        const tokens = await this.getTokens(user.id, user.email)
        await this.updateRTHash(user.id, tokens.refreshToken)
        return tokens
    }

    async updateUser(id: string, dto: UpdateUserDto) {
        const user = await this.prisma.user.update({
            where: {
                id
            },
            data: {
                profilePicture: dto.profilePicture  != null ? dto.profilePicture: undefined,
                email: dto.email != null ? dto.email: undefined,
                phoneNumber: dto.phoneNumber != null ? dto.phoneNumber: undefined,
                address: dto.address != null ? dto.address: undefined,
                password: dto.password != null ? dto.password: undefined
            }
        })

        return user
    } 

    async getUser(id: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id
            },
            include: {
                account: true
            }       
        })

        if(!user) throw new ForbiddenException("User does not exist!")
        
        return user;
    }

    /*
     * Utility Functions
    */
    async hashData(data: string) {
        return bcrypt.hash(data, 10);
    }

    async getTokens(userId: string, email: string): Promise<Tokens> {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                email
            }, {
                secret: process.env.AT_SECRET,
                expiresIn: 60*15, 
            }),
            this.jwtService.signAsync({
                sub: userId,
                email
            }, {
                secret: process.env.RT_SECRET,
                expiresIn: 60*60*24*7, 
            })
        ])
        return {
            accessToken: at,
            refreshToken: rt,
        }
    } 

    async updateRTHash(userId: string, rt: string) {
        const hash = await this.hashData(rt)
        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                refreshToken: hash
            }
        })
    }
}
