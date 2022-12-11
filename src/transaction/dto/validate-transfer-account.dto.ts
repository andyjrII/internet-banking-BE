import { IsString, IsNotEmpty } from 'class-validator';

export class ValidateTransferAccountDto {
  @IsString()
  @IsNotEmpty()
  accountNumber: string
}