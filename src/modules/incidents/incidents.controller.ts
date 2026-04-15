import { Controller, Post, Body, Param, Put, Req, UseGuards } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { AuthGuard } from '@nestjs/passport'; // Protection par JWT

@Controller('incidents')
@UseGuards(AuthGuard('jwt')) // BLOQUE TOUS LES APPELS NON AUTHENTIFIÉS SUR CE CONTRÔLEUR
export class IncidentsController {
    constructor(private readonly incidentsService: IncidentsService) {}

    @Post()
    async create(@Body() createIncidentDto: CreateIncidentDto, @Req() req: any) {
        // 💡 Bonnes Pratiques: On ne fait jamais confiance au client.
        // L'ID est extrait de manière sécurisée depuis le JWT (req.user), et non du Body falsifiable.
        const clientId = req.user.sub;
        return this.incidentsService.declarerIncident(clientId, createIncidentDto);
    }

    @Put(':id/assigner')
    async assigner(@Param('id') id: string, @Req() req: any) {
        const ingenieurId = req.user.sub;
        return this.incidentsService.assignerIncident(id, ingenieurId);
    }
}