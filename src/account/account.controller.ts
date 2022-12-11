import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('account')
export class AccountController {
    constructor(private accountService: AccountService) {}

    @Public()
    @Post('/create')
    @HttpCode(HttpStatus.CREATED)
    async createAccount(@Body() body: CreateAccountDto) {
        return await this.accountService.createAccount(body);
    }

    @Public()
    @Patch('/update')
    @HttpCode(HttpStatus.CREATED)
    async updateAccount(@Body() dto: UpdateAccountDto) {
        return await this.accountService.updateAccount(dto)
    }
}
