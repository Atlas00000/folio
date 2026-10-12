import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq, inArray } from 'drizzle-orm';
import { db } from '../../../db';
import { courses, enrolments, users } from '../../../db/schema';
import { isUniversityEmail } from '../auth/uni-email';
import { AuditService } from '../audit/audit.service';
import { CoursesService } from '../courses/courses.service';
import type { AuthUser } from '../../common/types/auth-user';

type ParsedRow = { email: string; role: 'student' | 'lecturer' | 'ta'; line: number };

@Injectable()
export class EnrolmentsService {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly audit: AuditService,
  ) {}

  async joinByCode(actor: AuthUser, joinCode: string) {
    const course = await db.query.courses.findFirst({
      where: eq(courses.joinCode, joinCode.trim().toLowerCase()),
    });
    if (!course || course.status === 'archived') {
      throw new NotFoundException('Invalid join code');
    }

    const existing = await db.query.enrolments.findFirst({
      where: and(
        eq(enrolments.userId, actor.id),
        eq(enrolments.courseId, course.id),
      ),
    });

    if (existing?.status === 'active') {
      throw new ConflictException('Already enrolled');
    }

    if (existing) {
      const [row] = await db
        .update(enrolments)
        .set({ status: 'active', role: 'student', updatedAt: new Date() })
        .where(eq(enrolments.id, existing.id))
        .returning();
      await this.audit.log({
        actorId: actor.id,
        courseId: course.id,
        action: 'enrolment.rejoined',
        entityType: 'enrolment',
        entityId: row.id,
      });
      return { course, enrolment: row };
    }

    const [row] = await db
      .insert(enrolments)
      .values({
        userId: actor.id,
        courseId: course.id,
        role: 'student',
        status: 'active',
      })
      .returning();

    await this.audit.log({
      actorId: actor.id,
      courseId: course.id,
      action: 'enrolment.joined',
      entityType: 'enrolment',
      entityId: row.id,
    });

    return { course, enrolment: row };
  }

  async withdraw(actor: AuthUser, courseId: string) {
    const enrolment = await db.query.enrolments.findFirst({
      where: and(
        eq(enrolments.userId, actor.id),
        eq(enrolments.courseId, courseId),
        eq(enrolments.status, 'active'),
      ),
    });
    if (!enrolment) {
      throw new NotFoundException('Active enrolment not found');
    }

    const [row] = await db
      .update(enrolments)
      .set({ status: 'withdrawn', updatedAt: new Date() })
      .where(eq(enrolments.id, enrolment.id))
      .returning();

    await this.audit.log({
      actorId: actor.id,
      courseId,
      action: 'enrolment.withdrawn',
      entityType: 'enrolment',
      entityId: row.id,
    });

    return row;
  }

  async listForCourse(actor: AuthUser, courseId: string) {
    await this.coursesService.requireLecturerOrOwner(actor, courseId);
    return db
      .select({
        enrolmentId: enrolments.id,
        role: enrolments.role,
        status: enrolments.status,
        userId: users.id,
        email: users.email,
        displayName: users.displayName,
      })
      .from(enrolments)
      .innerJoin(users, eq(users.id, enrolments.userId))
      .where(eq(enrolments.courseId, courseId));
  }

  previewCsv(csv: string) {
    return this.parseCsv(csv);
  }

  async commitCsv(actor: AuthUser, courseId: string, csv: string) {
    await this.coursesService.requireLecturerOrOwner(actor, courseId);
    const parsed = this.parseCsv(csv);
    if (parsed.errors.length > 0) {
      throw new BadRequestException({
        message: 'CSV validation failed',
        errors: parsed.errors,
      });
    }

    const emails = parsed.rows.map((r) => r.email);
    const existingUsers = await db.query.users.findMany({
      where: inArray(users.email, emails),
    });
    const byEmail = new Map(existingUsers.map((u) => [u.email, u]));

    const missing = emails.filter((e) => !byEmail.has(e));
    if (missing.length > 0) {
      throw new BadRequestException({
        message: 'All emails must belong to registered university accounts',
        missing,
      });
    }

    const results: Array<{ email: string; enrolmentId: string; role: string }> =
      [];

    for (const row of parsed.rows) {
      const user = byEmail.get(row.email)!;
      const existing = await db.query.enrolments.findFirst({
        where: and(
          eq(enrolments.userId, user.id),
          eq(enrolments.courseId, courseId),
        ),
      });

      if (existing) {
        const [updated] = await db
          .update(enrolments)
          .set({
            role: row.role,
            status: 'active',
            updatedAt: new Date(),
          })
          .where(eq(enrolments.id, existing.id))
          .returning();
        results.push({
          email: row.email,
          enrolmentId: updated.id,
          role: updated.role,
        });
      } else {
        const [created] = await db
          .insert(enrolments)
          .values({
            userId: user.id,
            courseId,
            role: row.role,
            status: 'active',
          })
          .returning();
        results.push({
          email: row.email,
          enrolmentId: created.id,
          role: created.role,
        });
      }
    }

    await this.audit.log({
      actorId: actor.id,
      courseId,
      action: 'enrolment.csv_import',
      entityType: 'enrolment',
      metadata: { count: results.length },
    });

    return { imported: results.length, results };
  }

  private parseCsv(csv: string): {
    rows: ParsedRow[];
    errors: string[];
  } {
    const lines = csv
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.toLowerCase().startsWith('email'));

    const rows: ParsedRow[] = [];
    const errors: string[] = [];
    const seen = new Set<string>();

    lines.forEach((line, idx) => {
      const lineNo = idx + 1;
      const parts = line.split(',').map((p) => p.trim());
      const email = (parts[0] ?? '').toLowerCase();
      const roleRaw = (parts[1] ?? 'student').toLowerCase();

      if (!email || !email.includes('@')) {
        errors.push(`Line ${lineNo}: invalid email`);
        return;
      }
      if (!isUniversityEmail(email)) {
        errors.push(`Line ${lineNo}: not a university email (${email})`);
        return;
      }
      if (!['student', 'lecturer', 'ta'].includes(roleRaw)) {
        errors.push(`Line ${lineNo}: invalid role (${roleRaw})`);
        return;
      }
      if (seen.has(email)) {
        errors.push(`Line ${lineNo}: duplicate email (${email})`);
        return;
      }
      seen.add(email);
      rows.push({
        email,
        role: roleRaw as ParsedRow['role'],
        line: lineNo,
      });
    });

    return { rows, errors };
  }
}
