import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from './entities/roles.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleName } from './dto/roles.enum';
import { ADMIN_PERMISSIONS, USER_PERMISSIONS } from './dto/permissions';
import { Permission } from './dto/permission.enum';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  findAll(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  findByName(name: RoleName): Promise<Role | null> {
    return this.rolesRepository.findOne({ where: { name } });
  }

  async create(name: RoleName): Promise<Role> {
    const existing = await this.findByName(name);
    if (existing) {
      throw new ConflictException(`Role with name ${name} already exists`);
    }

    const role = this.rolesRepository.create({
      name,
      permissions: this.getPermissionsByRole(name) as Permission[],
    });

    return this.rolesRepository.save(role);
  }

  async remove(id: number): Promise<void> {
    const result = await this.rolesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
  }

  private getPermissionsByRole(name: RoleName): string[] {
    return name === RoleName.ADMIN ? ADMIN_PERMISSIONS : USER_PERMISSIONS;
  }
}
