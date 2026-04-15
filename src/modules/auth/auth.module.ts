import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        UsersModule, // On importe UsersModule pour accéder à UsersService
        PassportModule,
        // Utilisation de registerAsync pour garantir que JWT_SECRET est bien chargé
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET') || 'MonSuperSecretTresComplique2026!',
                signOptions: { expiresIn: '1d' }, // Token valide 1 jour
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
