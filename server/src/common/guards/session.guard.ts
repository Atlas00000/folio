import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { AuthService } from '../../modules/auth/auth.service';
import type { AuthUser } from '../types/auth-user';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<FastifyRequest & { user?: AuthUser }>();
    const token = req.cookies?.[this.authService.sessionCookieName];
    if (!token) {
      throw new UnauthorizedException('Not authenticated');
    }
    req.user = await this.authService.me(token);
    return true;
  }
}
