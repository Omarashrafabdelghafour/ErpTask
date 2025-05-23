import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../Decorators/roles.decorator';
import { Role } from '../Decorators/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No role required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Must be set by AuthGuard

    if (!user || !user.role) {
      throw new ForbiddenException('Access denied: No role assigned');
    }

    // Check if user has at least one required role
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied: Insufficient role');
    }

    return true;
  }
}
