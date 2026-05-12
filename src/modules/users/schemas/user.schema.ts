import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum TypeRole {
    CLIENT = 'CLIENT',
    INGENIEUR = 'INGENIEUR',
}

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ required: true })
    nom: string;

    @Prop({ required: true })
    prenom: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, enum: TypeRole, default: TypeRole.CLIENT })
    role: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
