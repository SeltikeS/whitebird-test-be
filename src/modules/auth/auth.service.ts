import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UserAuthJwtPayload } from './dto/user-auth-jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserAuthJwtPayload> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  login(userPayload: UserAuthJwtPayload) {
    const payload = {
      id: userPayload.id,
      email: userPayload.email,
      role: userPayload.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  me(userId: number) {
    return this.usersService.findOne(userId);
  }
}
