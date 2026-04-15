import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray } from 'class-validator';
import { TypeCriticite } from '../schemas/incident.schema';

export class CreateIncidentDto {
    @IsString()
    @IsNotEmpty()
    sujet: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEnum(TypeCriticite)
    criticite: TypeCriticite;

    @IsOptional()
    @IsArray()
    fichiers?: any[];
}
