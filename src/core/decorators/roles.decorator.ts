import { SetMetadata } from '@nestjs/common';

// Permet d'attacher des métadonnées (le rôle exigé) à une méthode de notre contrôleur
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
