import { IsEnum, IsOptional } from 'class-validator';
import { RoleName } from './roles.enum';
import { Permission } from './permission.enum';

export class CreateRoleDto {
  @IsEnum(RoleName)
  name: RoleName;

  @IsOptional()
  permissions?: Permission[];
}
