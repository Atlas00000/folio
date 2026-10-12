import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { and, eq } from 'drizzle-orm';
import type { FastifyRequest } from 'fastify';
import { db } from '../../../db';
import { enrolments } from '../../../db/schema';
import {
  COURSE_ROLES_KEY,
  type CourseRoleName,
} from '../decorators/course-roles.decorator';
import type { AuthUser } from '../types/auth-user';

@Injectable()
export class CourseRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowed = this.reflector.getAllAndOverride<CourseRoleName[]>(
      COURSE_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!allowed || allowed.length === 0) {
      return true;
    }

    const req = context
      .switchToHttp()
      .getRequest<
        FastifyRequest & {
          user?: AuthUser;
          params: { courseId?: string };
        }
      >();
    const user = req.user;
    if (!user) {
      throw new ForbiddenException('Not authenticated');
    }
    if (user.globalRole === 'admin') {
      return true;
    }

    const courseId = req.params.courseId;
    if (!courseId) {
      throw new ForbiddenException('Course context required');
    }

    const enrolment = await db.query.enrolments.findFirst({
      where: and(
        eq(enrolments.userId, user.id),
        eq(enrolments.courseId, courseId),
        eq(enrolments.status, 'active'),
      ),
    });

    if (!enrolment || !allowed.includes(enrolment.role as CourseRoleName)) {
      throw new ForbiddenException('Insufficient course permissions');
    }
    return true;
  }
}
