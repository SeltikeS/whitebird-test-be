import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';
import { Role } from '../roles/entities/roles.entity';
import { RoleName } from '../roles/dto/roles.enum';
import { UserProfile } from './entities/user-profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,

    @InjectRepository(UserProfile)
    private profileRepository: Repository<UserProfile>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.usersRepository.create({
      email: createUserDto.email,
      passwordHash: await bcrypt.hash(createUserDto.password, 10),
    });

    const defaultRole = await this.rolesRepository.findOne({
      where: { name: RoleName.USER },
    });
    if (defaultRole) {
      user.role = defaultRole;
    }

    const savedUser = await this.usersRepository.save(user);

    const profile = this.profileRepository.create({ user: savedUser });
    await this.profileRepository.save(profile);

    return savedUser;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['role', 'profile', 'posts', 'comments'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['role', 'profile', 'posts', 'comments'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['role', 'profile'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.password) {
      user.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async getProfile(userId: number): Promise<UserProfile | null> {
    return this.profileRepository.findOne({
      where: { user: { id: userId } },
    });
  }

  async updateProfile(userId: number, data: Partial<UserProfile>) {
    let profile = await this.getProfile(userId);
    if (!profile) {
      profile = this.profileRepository.create({
        user: { id: userId },
        ...data,
      });
    } else {
      Object.assign(profile, data);
    }
    return this.profileRepository.save(profile);
  }
}
