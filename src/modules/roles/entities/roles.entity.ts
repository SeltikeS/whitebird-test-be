import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Permission } from '../dto/permission.enum';
import { RoleName } from '../dto/roles.enum';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: RoleName;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @Column('simple-array')
  permissions: Permission[];
}
