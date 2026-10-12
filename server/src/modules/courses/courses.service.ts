import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { and, eq } from 'drizzle-orm';
import { db } from '../../../db';
import { courses, enrolments } from '../../../db/schema';
import { AuditService } from '../audit/audit.service';
import type { AuthUser } from '../../common/types/auth-user';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly audit: AuditService) {}

  async create(actor: AuthUser, dto: CreateCourseDto) {
    if (actor.globalRole !== 'lecturer' && actor.globalRole !== 'admin') {
      throw new ForbiddenException('Only lecturers or admins can create courses');
    }

    const code = dto.code.trim().toUpperCase();
    const existing = await db.query.courses.findFirst({
      where: eq(courses.code, code),
    });
    if (existing) {
      throw new ConflictException('Course code already exists');
    }

    const joinCode = randomBytes(4).toString('hex');
    const [course] = await db
      .insert(courses)
      .values({
        code,
        title: dto.title.trim(),
        term: dto.term.trim(),
        description: dto.description?.trim(),
        joinCode,
        status: 'active',
        ownerId: actor.id,
      })
      .returning();

    await db.insert(enrolments).values({
      userId: actor.id,
      courseId: course.id,
      role: 'lecturer',
      status: 'active',
    });

    await this.audit.log({
      actorId: actor.id,
      courseId: course.id,
      action: 'course.created',
      entityType: 'course',
      entityId: course.id,
      metadata: { code: course.code },
    });

    return course;
  }

  async listMine(actor: AuthUser) {
    if (actor.globalRole === 'admin') {
      return db.query.courses.findMany();
    }

    const rows = await db
      .select({ course: courses, role: enrolments.role })
      .from(enrolments)
      .innerJoin(courses, eq(courses.id, enrolments.courseId))
      .where(
        and(eq(enrolments.userId, actor.id), eq(enrolments.status, 'active')),
      );

    return rows.map((r) => ({ ...r.course, myRole: r.role }));
  }

  async getById(actor: AuthUser, courseId: string) {
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (actor.globalRole === 'admin') {
      return course;
    }

    const enrolment = await db.query.enrolments.findFirst({
      where: and(
        eq(enrolments.userId, actor.id),
        eq(enrolments.courseId, courseId),
        eq(enrolments.status, 'active'),
      ),
    });
    if (!enrolment) {
      throw new ForbiddenException('Not enrolled in this course');
    }
    return { ...course, myRole: enrolment.role };
  }

  async update(actor: AuthUser, courseId: string, dto: UpdateCourseDto) {
    await this.requireLecturerOrOwner(actor, courseId);
    const [updated] = await db
      .update(courses)
      .set({
        ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description.trim() }
          : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        updatedAt: new Date(),
      })
      .where(eq(courses.id, courseId))
      .returning();
    if (!updated) {
      throw new NotFoundException('Course not found');
    }

    await this.audit.log({
      actorId: actor.id,
      courseId,
      action: 'course.updated',
      entityType: 'course',
      entityId: courseId,
      metadata: dto as Record<string, unknown>,
    });

    return updated;
  }

  async requireLecturerOrOwner(actor: AuthUser, courseId: string) {
    if (actor.globalRole === 'admin') {
      return;
    }
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    if (course.ownerId === actor.id) {
      return;
    }
    const enrolment = await db.query.enrolments.findFirst({
      where: and(
        eq(enrolments.userId, actor.id),
        eq(enrolments.courseId, courseId),
        eq(enrolments.status, 'active'),
        eq(enrolments.role, 'lecturer'),
      ),
    });
    if (!enrolment) {
      throw new ForbiddenException('Lecturer access required');
    }
  }
}
