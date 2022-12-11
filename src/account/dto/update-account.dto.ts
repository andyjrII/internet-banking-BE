import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class UpdateAccountDto {
  @IsNotEmpty()
  @IsString()
  id: string;
  
  @IsNumberString()
  @IsNotEmpty()
  oldPin: string;

  @IsNumberString()
  @IsNotEmpty()
  newPin: string;
}