import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserAuthJwtPayload } from '../dto/user-auth-jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'jwtsecret',
    });
  }

  validate(payload: UserAuthJwtPayload): UserAuthJwtPayload {
    return { id: payload.id, email: payload.email, role: payload.role };
  }
}
