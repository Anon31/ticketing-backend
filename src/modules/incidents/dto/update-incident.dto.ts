import { IsString, IsEnum, IsOptional, IsArray } from 'class-validator';
import { TypeCriticite } from '../schemas/incident.schema';

export class UpdateIncidentDto {
    @IsOptional()
    @IsString()
    sujet?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(TypeCriticite)
    criticite?: TypeCriticite;

    @IsOptional()
    @IsArray()
    fichiers?: any[];
}
