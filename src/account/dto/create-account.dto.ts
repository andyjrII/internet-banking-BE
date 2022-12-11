import { AccountType, Gender } from '@prisma/client'
import {IsEmail, IsString, MinLength, MaxLength, IsNotEmpty, IsNumberString} from 'class-validator'

export class CreateAccountDto {
    @IsString()
    @IsNotEmpty({message: 'First name cannot be empty'})
    firstName: string

    @IsString()
    @IsNotEmpty({message: 'Last name cannot be empty'})
    lastName: string

    @IsString()
    profilePicture: string

    @IsNotEmpty({message: 'Date of Birth cannot be empty'})
    dateOfBirth: Date

    @IsString()
    @IsNotEmpty({message: 'Gender cannot be empty'})
    gender: Gender

    @IsEmail()
    @IsString()
    @IsNotEmpty({message: 'Email Address cannot be empty'})
    email: string

    @IsString()
    @IsNotEmpty({message: 'Phone Number cannot be empty'})
    phoneNumber: string

    @IsNotEmpty({message: 'Address cannot be empty'})
    address: string

    @IsString()
    @IsNotEmpty({message: 'Account Type cannot be empty'})
    accountType: AccountType

    @IsNumberString()
    @IsNotEmpty({message: 'Pin cannot be empty'})
    @MinLength(4, 
        {message: 'Pin is too short. Must be 4 digits.'}
    )
    @MaxLength(4, 
        { message: 'Pin is too long. Must be 4 digits.'}
    )
    pin: string
}