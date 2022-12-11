import { IsString, MinLength, MaxLength, Matches, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  profilePicture: string;

  @IsOptional()
  @IsEmail()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  address: string;
  
  @IsOptional()
  @IsString()
  @MinLength(8, {message: 'Password is too short. Minimal length is 8 characters.'})
  @MaxLength(20, { message: 'password is too long. Maximal length is 20 characters.'})
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, 
    {message: 'Password must contain the following: a capital letter, a number and a special character.'})
  password: string
}