import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// 1. Création d'un "Mock" du Service pour isoler totalement le Contrôleur
class MockAuthService {
    // On simule les méthodes appelées par les routes du contrôleur
    register = jest.fn().mockResolvedValue({
        access_token: 'token_jwt_simule',
        user: { id: '123', nom: 'Doe', prenom: 'John', role: 'CLIENT' },
    });

    login = jest.fn().mockResolvedValue({
        access_token: 'token_jwt_simule',
        user: { id: '123', nom: 'Doe', prenom: 'John', role: 'CLIENT' },
    });
}

describe('AuthController', () => {
    let controller: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                // 2. On indique à NestJS d'utiliser notre Faux Service au lieu du vrai
                {
                    provide: AuthService,
                    useClass: MockAuthService,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
