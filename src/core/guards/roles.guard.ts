import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // 1. On lit le rôle requis (ex: INGENIEUR) défini par le décorateur @Roles()
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

        if (!requiredRoles) {
            return true; // Si la route n'a pas de décorateur @Roles, on autorise l'accès (le AuthGuard fera déjà son travail)
        }

        // 2. On récupère l'utilisateur en forçant le typage pour supprimer les "any" !
        const request = context.switchToHttp().getRequest<Request & { user: { role: string } }>();
        const user = request.user;

        // 3. Vérification stricte
        if (!user || !requiredRoles.includes(user.role)) {
            throw new ForbiddenException('Accès refusé : Cette action est réservée aux Ingénieurs.');
        }

        return true;
    }
}
