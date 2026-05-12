import { Test, TestingModule } from '@nestjs/testing';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';

// 1. Création d'un "Mock" du Service pour isoler totalement le Contrôleur
class MockIncidentsService {
    // On simule toutes les méthodes appelées par les routes du contrôleur
    findAll = jest.fn().mockResolvedValue([]);
    findOne = jest.fn().mockResolvedValue({});
    declarerIncident = jest.fn().mockResolvedValue({});
    update = jest.fn().mockResolvedValue({});
    assignerIncident = jest.fn().mockResolvedValue({});
    cloturerIncident = jest.fn().mockResolvedValue({});
}

describe('IncidentsController', () => {
    let controller: IncidentsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [IncidentsController],
            providers: [
                // 2. On indique à NestJS d'utiliser notre Faux Service au lieu du vrai
                {
                    provide: IncidentsService,
                    useClass: MockIncidentsService,
                },
            ],
        }).compile();

        controller = module.get<IncidentsController>(IncidentsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
