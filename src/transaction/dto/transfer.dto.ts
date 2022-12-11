import { IsString, IsNotEmpty, IsNumberString } from 'class-validator';

export class TransferDto {
  @IsString()
  @IsNotEmpty()
  transferFrom: string;

  @IsString()
  @IsNotEmpty()
  transferTo: string;

  @IsNumberString()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumberString()
  @IsNotEmpty()
  pin: string
}