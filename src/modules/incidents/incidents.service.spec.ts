import { Test, TestingModule } from '@nestjs/testing';
import { IncidentsService } from './incidents.service';
import { getModelToken } from '@nestjs/mongoose';
import { Incident } from './schemas/incident.schema';

// 1. Création d'un "Mock" sous forme de classe (ESLint friendly)
class MockIncidentModel {
    public save: any;

    constructor(private dto: Partial<Incident>) {
        this.save = jest.fn().mockResolvedValue(this.dto);
    }

    // On simule find() avec ses méthodes chaînées
    static find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(), // mockReturnThis permet d'enchaîner un autre .populate()
        exec: jest.fn().mockResolvedValue([]),
    });

    // On simule findById() (qui est parfois await directement, parfois chaîné avec exec)
    static findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
        // Le "then" permet de simuler un await direct sans faire de .exec() (utilisé dans assignerIncident)
        then: (resolve: (value: Incident | null) => void) => resolve(null),
    });

    // On simule findByIdAndUpdate()
    static findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
    });
}

describe('IncidentsService', () => {
    let service: IncidentsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                IncidentsService,
                // 2. On injecte notre classe mockée à la place de la vraie DB !
                {
                    provide: getModelToken(Incident.name),
                    useValue: MockIncidentModel,
                },
            ],
        }).compile();

        service = module.get<IncidentsService>(IncidentsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
