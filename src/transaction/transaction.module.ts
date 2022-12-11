import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { AccountModule } from '../account/account.module';
import { AccountService } from '../account/account.service';

@Module({
  imports: [AccountModule],
  providers: [TransactionService, AccountService],
  controllers: [TransactionController]
})
export class TransactionModule {}
