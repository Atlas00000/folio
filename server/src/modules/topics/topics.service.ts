import { Injectable, NotFoundException } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { db } from '../../../db';
import { learningOutcomes, topics } from '../../../db/schema';
import { CoursesService } from '../courses/courses.service';
import type { AuthUser } from '../../common/types/auth-user';
import { CreateTopicDto } from './dto/create-topic.dto';

@Injectable()
export class TopicsService {
  constructor(private readonly coursesService: CoursesService) {}

  async create(actor: AuthUser, courseId: string, dto: CreateTopicDto) {
    await this.coursesService.requireLecturerOrOwner(actor, courseId);
    const [topic] = await db
      .insert(topics)
      .values({
        courseId,
        title: dto.title.trim(),
        sequence: dto.sequence ?? 0,
        description: dto.description?.trim(),
      })
      .returning();

    if (dto.outcomes?.length) {
      await db.insert(learningOutcomes).values(
        dto.outcomes.map((o, i) => ({
          topicId: topic.id,
          description: o.description.trim(),
          sequence: i,
        })),
      );
    }

    return this.getTopic(actor, courseId, topic.id);
  }

  async list(actor: AuthUser, courseId: string) {
    await this.coursesService.getById(actor, courseId);
    const rows = await db.query.topics.findMany({
      where: eq(topics.courseId, courseId),
      orderBy: [asc(topics.sequence)],
    });
    const withOutcomes = await Promise.all(
      rows.map(async (t) => {
        const outcomes = await db.query.learningOutcomes.findMany({
          where: eq(learningOutcomes.topicId, t.id),
          orderBy: [asc(learningOutcomes.sequence)],
        });
        return { ...t, outcomes };
      }),
    );
    return withOutcomes;
  }

  async getTopic(actor: AuthUser, courseId: string, topicId: string) {
    await this.coursesService.getById(actor, courseId);
    const topic = await db.query.topics.findFirst({
      where: eq(topics.id, topicId),
    });
    if (!topic || topic.courseId !== courseId) {
      throw new NotFoundException('Topic not found');
    }
    const outcomes = await db.query.learningOutcomes.findMany({
      where: eq(learningOutcomes.topicId, topicId),
      orderBy: [asc(learningOutcomes.sequence)],
    });
    return { ...topic, outcomes };
  }
}
