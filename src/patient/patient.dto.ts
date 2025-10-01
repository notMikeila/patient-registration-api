import { IsEmail, IsNotEmpty, IsNumberString, IsString} from 'class-validator'

export class RegisterPatientDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNumberString()
    @IsNotEmpty()
    phone: string
}