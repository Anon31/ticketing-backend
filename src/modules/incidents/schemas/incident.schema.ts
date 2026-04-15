import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum TypeCriticite {
    FAIBLE = 'FAIBLE',
    MOYEN = 'MOYEN',
    HAUT = 'HAUT',
    CRITIQUE = 'CRITIQUE',
}
export enum TypeStatus {
    CREATION = 'CREATION',
    ASSIGNATION = 'ASSIGNATION',
    CLOTURE = 'CLOTURE',
    TRANSFERT = 'TRANSFERT',
}

@Schema({ _id: false })
export class FichierJoint {
    @Prop({ required: true })
    nom: string;

    @Prop({ required: true })
    type: string;

    @Prop({ required: true })
    urlTelechargement: string;
}

@Schema({ _id: false })
export class HistoriqueIncident {
    @Prop({ default: Date.now })
    dateAction: Date;

    @Prop({ required: true, enum: TypeStatus })
    typeStatus: string;

    @Prop()
    details: string;
}

@Schema({ timestamps: { createdAt: 'dateCreation', updatedAt: false } })
export class Incident extends Document {
    @Prop({ required: true })
    sujet: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true, enum: TypeCriticite })
    criticite: string;

    @Prop({ default: null })
    dateCloture: Date;

    @Prop({ default: false })
    estCloture: boolean;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    client: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', default: null })
    ingenieur: Types.ObjectId;

    @Prop({ type: [FichierJoint], default: [] })
    fichiers: FichierJoint[];

    @Prop({ type: [HistoriqueIncident], default: [] })
    historique: HistoriqueIncident[];
}
export const IncidentSchema = SchemaFactory.createForClass(Incident);
