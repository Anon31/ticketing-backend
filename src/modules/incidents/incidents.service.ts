import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Incident, TypeStatus } from './schemas/incident.schema';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UpdateIncidentDto } from './dto/update-incident.dto';

@Injectable()
export class IncidentsService {
    constructor(@InjectModel(Incident.name) private incidentModel: Model<Incident>) {}

    async findAll(): Promise<Incident[]> {
        // ".populate()" permet de remplacer les IDs MongoDB par les vraies infos des utilisateurs !
        return this.incidentModel.find().populate('client', 'nom prenom email role').populate('ingenieur', 'nom prenom email role').exec();
    }

    async findOne(id: string): Promise<Incident> {
        const incident = await this.incidentModel
            .findById(id)
            .populate('client', 'nom prenom email role')
            .populate('ingenieur', 'nom prenom email role')
            .exec();

        if (!incident) {
            throw new NotFoundException(`Incident avec l'ID ${id} non trouvé`);
        }

        return incident;
    }

    async update(id: string, updateIncidentDto: UpdateIncidentDto): Promise<Incident> {
        const incident = await this.incidentModel
            .findByIdAndUpdate(
                id,
                { $set: updateIncidentDto },
                { new: true }, // Renvoie le document après modification
            )
            .exec();

        if (!incident) {
            throw new NotFoundException(`Incident avec l'ID ${id} non trouvé`);
        }

        return incident;
    }

    async declarerIncident(clientId: string, createDto: CreateIncidentDto): Promise<Incident> {
        const nouvelIncident = new this.incidentModel({
            ...createDto,
            client: new Types.ObjectId(clientId),
            historique: [
                {
                    dateAction: new Date(),
                    typeStatus: TypeStatus.CREATION,
                    details: 'Incident déclaré par le client',
                },
            ],
        });
        return nouvelIncident.save();
    }

    async assignerIncident(incidentId: string, ingenieurId: string): Promise<Incident> {
        const incident = await this.incidentModel.findById(incidentId);
        if (!incident) throw new NotFoundException('Incident non trouvé');
        if (incident.ingenieur) throw new BadRequestException('Déjà assigné');

        incident.ingenieur = new Types.ObjectId(ingenieurId);
        // Ajout explicite de dateAction
        incident.historique.push({ dateAction: new Date(), typeStatus: TypeStatus.ASSIGNATION, details: `Assigné à ${ingenieurId}` });
        return incident.save();
    }

    async cloturerIncident(incidentId: string, ingenieurId: string): Promise<Incident> {
        const incident = await this.incidentModel.findById(incidentId);
        if (!incident) throw new NotFoundException('Incident non trouvé');

        // Vérification stricte du cahier des charges : seul l'ingénieur assigné peut clôturer
        if (incident.ingenieur?.toString() !== ingenieurId) {
            throw new BadRequestException('Vous ne pouvez clôturer que vos propres tickets');
        }

        incident.estCloture = true;
        incident.dateCloture = new Date();
        incident.historique.push({
            dateAction: new Date(),
            typeStatus: TypeStatus.CLOTURE,
            details: 'Incident clôturé',
        });

        return incident.save();
    }
}
