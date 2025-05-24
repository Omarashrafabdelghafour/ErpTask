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
      return true; 
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; 

    if (!user || !user.role) {
      throw new ForbiddenException('Access denied: No role assigned');
    }

    
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied: Insufficient role');
    }

    return true;
  }
}
