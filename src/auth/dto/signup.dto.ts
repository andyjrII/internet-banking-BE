import { IsString, IsNotEmpty, MinLength, MaxLength, Matches, IsNumberString } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty({message: 'Account Number cannot be empty'})
  @MinLength(10, {message: 'Password is too short. Minimal length is 8 characters.'})
  @MaxLength(10, { message: 'password is too long. Maximal length is 8 characters.'})
  accountNumber: string;

  @IsNumberString()
  pin: string;

  @IsString()
  @IsNotEmpty({message: 'password cannot be empty'})
  @MinLength(8, {message: 'Password is too short. Minimal length is 8 characters.'})
  @MaxLength(24, { message: 'password is too long. Maximal length is 20 characters.'})
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, 
    {message: 'Password must contain the following: a capital letter, a number and a special character.'})
  password: string
}