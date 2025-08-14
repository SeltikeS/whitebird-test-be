import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RoleName } from '../../roles/dto/roles.enum';
import { UserAuthJwtPayload } from '../dto/user-auth-jwt-payload';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleName[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles?.length) return true;

    const user = context
      .switchToHttp()
      .getRequest<{ user: UserAuthJwtPayload }>()?.user;

    return !!user?.role && requiredRoles.includes(user.role.name);
  }
}
