import { Injectable } from '@nestjs/common';
import { db } from '../../../db';
import { auditLogs } from '../../../db/schema';

@Injectable()
export class AuditService {
  async log(input: {
    actorId?: string | null;
    courseId?: string | null;
    action: string;
    entityType: string;
    entityId?: string | null;
    metadata?: Record<string, unknown>;
  }) {
    await db.insert(auditLogs).values({
      actorId: input.actorId ?? null,
      courseId: input.courseId ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      metadata: input.metadata ?? {},
    });
  }
}
