import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

// 1. Création des Mocks sous forme de classes pour satisfaire ESLint
class MockUsersService {
    // On simule les méthodes du UsersService appelées dans AuthService
    findByEmail = jest.fn();
    create = jest.fn();
}

class MockJwtService {
    // On simule la méthode de signature du token
    signAsync = jest.fn().mockResolvedValue('token_jwt_simule');
}

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                // 2. On injecte nos classes mockées pour remplacer les vrais services !
                {
                    provide: UsersService,
                    useClass: MockUsersService,
                },
                {
                    provide: JwtService,
                    useClass: MockJwtService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
