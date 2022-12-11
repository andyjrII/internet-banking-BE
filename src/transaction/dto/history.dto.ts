import { Status, TransactionType } from '@prisma/client';
import { IsString, IsNotEmpty } from 'class-validator';

export class TransactionHistoryDto {
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  status: Status;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  transactionType: TransactionType;
}