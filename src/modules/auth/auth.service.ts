import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Identifiants invalides');
        }

        // Vérification du mot de passe haché
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Identifiants invalides');
        }

        // Création du Payload JWT (Ne jamais y mettre de données sensibles comme le mot de passe)
        const payload = { sub: user._id, email: user.email, role: user.role };

        return {
            access_token: await this.jwtService.signAsync(payload),
            user: { id: user._id, nom: user.nom, prenom: user.prenom, role: user.role },
        };
    }

    async register(registerDto: CreateUserDto) {
        // Délégation au UsersService selon le principe SRP
        const user = await this.usersService.create(registerDto);
        return this.login({ email: user.email, password: registerDto.password });
    }
}
