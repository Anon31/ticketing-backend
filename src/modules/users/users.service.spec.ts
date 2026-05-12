import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';

// 1. Création d'un "Mock" sous forme de classe pour satisfaire le typage strict d'ESLint
class MockUserModel {
    public save: any;

    constructor(private dto: Partial<User>) {
        // On simule la méthode save() de Mongoose
        this.save = jest.fn().mockResolvedValue(this.dto);
    }

    // On simule la méthode statique findOne()
    static findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
        then: (resolve: (value: User | null) => void) => resolve(null),
    });
}

describe('UsersService', () => {
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                // 2. On injecte notre classe mockée à la place de la vraie DB !
                {
                    provide: getModelToken(User.name),
                    useValue: MockUserModel,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
