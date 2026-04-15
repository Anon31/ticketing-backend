import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'MonSuperSecretTresComplique2026!',
        });
    }

    validate(payload: JwtPayload) {
        // Le payload décodé est renvoyé ici.
        // Passport l'attachera automatiquement à l'objet "req.user" des contrôleurs
        return { sub: payload.sub, email: payload.email, role: payload.role };
    }
}
