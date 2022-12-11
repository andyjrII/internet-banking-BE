import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { PrismaModule } from './prisma/prisma.module';
import { TransactionModule } from './transaction/transaction.module';
import { ConfigModule } from '@nestjs/config';
import { AtGuard } from './common/guards/at.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    AuthModule, AccountModule, PrismaModule, TransactionModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard
    }
  ] 
})
export class AppModule {}
