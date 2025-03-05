import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('👤 Rôle détecté dans AdminGuard :', user?.role);

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      throw new ForbiddenException(
        "Accès refusé, vous n'êtes pas administrateur.",
      );
    }

    return true;
  }
}
