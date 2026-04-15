import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard('jwt')) // Protection: il faut un token valide pour accéder à ces routes
export class UsersController {
    // URL : GET /api/v1/users/me
    @Get('me')
    getProfile(@Req() req: any) {
        // Principe KISS : Le payload du token JWT (qui a été décodé et validé par Passport)
        // est automatiquement injecté dans req.user.
        // Il contient déjà l'ID, l'email et le rôle ! On le renvoie directement au Frontend.
        return req.user;
    }
}
