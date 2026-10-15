import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import { and, eq, gt, isNull } from 'drizzle-orm';
import { db } from '../../../db';
import { passwordResetTokens, sessions, users } from '../../../db/schema';
import { FolioLogger } from '../../common/logging';
import { isUniversityEmail } from './uni-email';
import { LoginDto } from './dto/login.dto';
import {
  PasswordResetConfirmDto,
  PasswordResetRequestDto,
} from './dto/password-reset.dto';
import { RegisterDto } from './dto/register.dto';

const SESSION_COOKIE = 'folio_session';
const SESSION_DAYS = 14;
const RESET_HOURS = 2;
const log = new FolioLogger('auth');

@Injectable()
export class AuthService {
  readonly sessionCookieName = SESSION_COOKIE;

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    if (!isUniversityEmail(email)) {
      throw new BadRequestException(
        'Registration requires a university email address',
      );
    }

    const existing = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const [user] = await db
      .insert(users)
      .values({
        email,
        displayName: dto.displayName.trim(),
        passwordHash,
        globalRole: 'student',
        status: 'active',
      })
      .returning({
        id: users.id,
        email: users.email,
        displayName: users.displayName,
        globalRole: users.globalRole,
        status: users.status,
      });

    const session = await this.createSession(user.id);
    return { user, sessionToken: session.rawToken, expiresAt: session.expiresAt };
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('Invalid email or password');
    }

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const session = await this.createSession(user.id);
    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        globalRole: user.globalRole,
        status: user.status,
      },
      sessionToken: session.rawToken,
      expiresAt: session.expiresAt,
    };
  }

  async logout(rawToken: string | undefined) {
    if (!rawToken) {
      return;
    }
    const tokenHash = hashToken(rawToken);
    await db
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(eq(sessions.tokenHash, tokenHash));
  }

  async me(rawToken: string | undefined) {
    if (!rawToken) {
      throw new UnauthorizedException('Not authenticated');
    }

    const tokenHash = hashToken(rawToken);
    const session = await db.query.sessions.findFirst({
      where: and(
        eq(sessions.tokenHash, tokenHash),
        isNull(sessions.revokedAt),
        gt(sessions.expiresAt, new Date()),
      ),
    });
    if (!session) {
      throw new UnauthorizedException('Not authenticated');
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
      columns: {
        id: true,
        email: true,
        displayName: true,
        globalRole: true,
        status: true,
      },
    });
    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('Not authenticated');
    }
    return user;
  }

  async requestPasswordReset(dto: PasswordResetRequestDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    // Always OK — do not leak whether the email exists.
    if (!user || user.status !== 'active') {
      return { ok: true };
    }

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + RESET_HOURS);

    await db.insert(passwordResetTokens).values({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    if (process.env.NODE_ENV !== 'production') {
      log.debug('password_reset_token_issued', {
        email,
        token: rawToken,
        url: `/reset-password?token=${rawToken}`,
      });
    }

    return { ok: true };
  }

  async confirmPasswordReset(dto: PasswordResetConfirmDto) {
    const tokenHash = hashToken(dto.token.trim());
    const row = await db.query.passwordResetTokens.findFirst({
      where: and(
        eq(passwordResetTokens.tokenHash, tokenHash),
        isNull(passwordResetTokens.usedAt),
        gt(passwordResetTokens.expiresAt, new Date()),
      ),
    });
    if (!row) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    await db
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, row.userId));
    await db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.id, row.id));
    await db
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(
        and(eq(sessions.userId, row.userId), isNull(sessions.revokedAt)),
      );

    return { ok: true };
  }

  private async createSession(userId: string) {
    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);

    await db.insert(sessions).values({
      userId,
      tokenHash,
      expiresAt,
    });

    return { rawToken, expiresAt };
  }
}

function hashToken(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}
