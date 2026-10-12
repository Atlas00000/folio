import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  PasswordResetConfirmDto,
  PasswordResetRequestDto,
} from './dto/password-reset.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOkResponse({ description: 'Registered and session cookie set' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const result = await this.authService.register(dto);
    this.setSessionCookie(reply, result.sessionToken, result.expiresAt);
    return { user: result.user };
  }

  @Post('login')
  @ApiOkResponse({ description: 'Logged in and session cookie set' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const result = await this.authService.login(dto);
    this.setSessionCookie(reply, result.sessionToken, result.expiresAt);
    return { user: result.user };
  }

  @Post('logout')
  @ApiOkResponse({ description: 'Session revoked' })
  async logout(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const token = req.cookies?.[this.authService.sessionCookieName];
    await this.authService.logout(token);
    reply.clearCookie(this.authService.sessionCookieName, { path: '/' });
    return { ok: true };
  }

  @Get('me')
  @ApiCookieAuth()
  @ApiOkResponse({ description: 'Current user' })
  async me(@Req() req: FastifyRequest) {
    const token = req.cookies?.[this.authService.sessionCookieName];
    if (!token) {
      throw new UnauthorizedException('Not authenticated');
    }
    const user = await this.authService.me(token);
    return { user };
  }

  @Post('password-reset/request')
  @ApiOkResponse({ description: 'Always ok; token logged in local dev' })
  requestPasswordReset(@Body() dto: PasswordResetRequestDto) {
    return this.authService.requestPasswordReset(dto);
  }

  @Post('password-reset/confirm')
  @ApiOkResponse({ description: 'Password updated' })
  confirmPasswordReset(@Body() dto: PasswordResetConfirmDto) {
    return this.authService.confirmPasswordReset(dto);
  }

  private setSessionCookie(
    reply: FastifyReply,
    token: string,
    expiresAt: Date,
  ) {
    reply.setCookie(this.authService.sessionCookieName, token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      expires: expiresAt,
    });
  }
}
