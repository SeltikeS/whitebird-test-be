import { Role } from '../../roles/entities/roles.entity';

export interface UserAuthJwtPayload {
  id: number;
  email: string;
  role: Role;
}
