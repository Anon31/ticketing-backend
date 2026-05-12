import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

// 1. Création d'un "Mock" du Service pour isoler totalement le Contrôleur
class MockUsersService {
    // On simule les méthodes potentiellement appelées par les routes du contrôleur
    create = jest.fn().mockResolvedValue({});
    findAll = jest.fn().mockResolvedValue([]);
    findOne = jest.fn().mockResolvedValue({});
    findByEmail = jest.fn().mockResolvedValue({});
    update = jest.fn().mockResolvedValue({});
    remove = jest.fn().mockResolvedValue({});
}

describe('UsersController', () => {
    let controller: UsersController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                // 2. On indique à NestJS d'utiliser notre Faux Service au lieu du vrai
                {
                    provide: UsersService,
                    useClass: MockUsersService,
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
