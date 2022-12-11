import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountService } from '../account/account.service';
import { AccountModule } from '../account/account.module';
import { AtStrategy } from './strategies/at.strategy';
import { RtStrategy } from './strategies/rt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [AccountModule, JwtModule.register({}), HttpModule],
  providers: [AuthService, AccountService, AtStrategy, RtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
