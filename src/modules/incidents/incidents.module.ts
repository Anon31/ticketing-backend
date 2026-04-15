import { Incident, IncidentSchema } from './schemas/incident.schema';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

@Module({
    // Enregistrement du Schéma pour ce module précis
    imports: [MongooseModule.forFeature([{ name: Incident.name, schema: IncidentSchema }])],
    controllers: [IncidentsController],
    providers: [IncidentsService],
})
export class IncidentsModule {}
