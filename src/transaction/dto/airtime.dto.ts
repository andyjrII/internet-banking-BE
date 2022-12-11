import { IsString, IsNotEmpty, IsNumberString } from 'class-validator';

export class AirtimeDto {
  @IsString()
  @IsNotEmpty()
  payFrom: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsNumberString()
  @IsNotEmpty()
  amount: number;

  @IsNumberString()
  @IsNotEmpty()
  pin: string
}