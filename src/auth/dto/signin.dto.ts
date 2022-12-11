import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class SigninDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string
}