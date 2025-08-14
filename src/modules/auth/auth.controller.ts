import { Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserAuthJwtPayload } from './dto/user-auth-jwt-payload';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: { user: UserAuthJwtPayload }) {
    return this.authService.me(req.user.id);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: { user: UserAuthJwtPayload }) {
    return this.authService.login(req.user);
  }
}
