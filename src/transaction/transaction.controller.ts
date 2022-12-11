import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { AirtimeDto } from './dto/airtime.dto';
import { TransactionHistoryDto } from './dto/history.dto';
import { TransferDto } from './dto/transfer.dto';
import { ValidateTransferAccountDto } from './dto/validate-transfer-account.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
    constructor(private transactionService: TransactionService) {}
    
    @Post('/transfer')
    @Public()
    @HttpCode(HttpStatus.OK)
    async makeTransfer(@Body() dto: TransferDto) {
        return await this.transactionService.makeTransfer(dto)
    }

    @Post('/airtime')
    @Public()
    @HttpCode(HttpStatus.OK) 
    async airtimeTopup(@Body() dto: AirtimeDto) {
        return await this.transactionService.airtimeTopup(dto)
    }

    @Post('/history')
    @Public()
    @HttpCode(HttpStatus.OK)
    async transactionHistory(@Body() dto: TransactionHistoryDto) {
        return await this.transactionService.transactionHistory(dto);
    }

    @Post('/validate')
    @HttpCode(HttpStatus.OK)
    async validateTransactionAccount(@Body() dto: ValidateTransferAccountDto) {
        return await this.transactionService.validateTransactionAccount(dto)
    }
}
