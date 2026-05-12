import { Controller, Get, Post, Body, Param, Put, Req, UseGuards, Patch } from '@nestjs/common';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { Roles } from '../../core/decorators/roles.decorator';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { RolesGuard } from '../../core/guards/roles.guard';
import { TypeRole } from '../users/schemas/user.schema';
import { IncidentsService } from './incidents.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

interface RequestWithUser extends Request {
    user: { sub: string; email: string; role: string };
}

@Controller('incidents')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class IncidentsController {
    constructor(private readonly incidentsService: IncidentsService) {}

    @Get()
    async findAll() {
        return this.incidentsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.incidentsService.findOne(id);
    }

    @Post()
    async create(@Body() createIncidentDto: CreateIncidentDto, @Req() req: RequestWithUser) {
        const clientId = req.user.sub;
        return this.incidentsService.declarerIncident(clientId, createIncidentDto);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateIncidentDto: UpdateIncidentDto) {
        return this.incidentsService.update(id, updateIncidentDto);
    }

    @Put(':id/assigner')
    @Roles(TypeRole.INGENIEUR)
    async assigner(@Param('id') id: string, @Req() req: RequestWithUser) {
        const ingenieurId = req.user.sub;
        return this.incidentsService.assignerIncident(id, ingenieurId);
    }

    @Put(':id/cloturer')
    @Roles(TypeRole.INGENIEUR)
    async cloturer(@Param('id') id: string, @Req() req: RequestWithUser) {
        const ingenieurId = req.user.sub;
        return this.incidentsService.cloturerIncident(id, ingenieurId);
    }
}
