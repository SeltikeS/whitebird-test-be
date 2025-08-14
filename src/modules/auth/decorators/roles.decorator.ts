import { SetMetadata } from '@nestjs/common';
import { RoleName } from '../../roles/dto/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleName[]) => SetMetadata(ROLES_KEY, roles);
