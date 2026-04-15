import { IsString, IsEmail, IsNotEmpty, IsEnum, MinLength } from 'class-validator';
import { TypeRole } from '../schemas/user.schema';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    nom: string;

    @IsString()
    @IsNotEmpty()
    prenom: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsEnum(TypeRole)
    role: TypeRole;
}
