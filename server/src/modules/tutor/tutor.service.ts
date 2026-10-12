import { Injectable } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '../../../db';
import {
  materialChunks,
  tutorMessages,
  tutorThreads,
} from '../../../db/schema';
import type { AuthUser } from '../../common/types/auth-user';
import { CoursesService } from '../courses/courses.service';
import { IndexingService } from './indexing.service';
import { scoreQuery } from './retrieval';

const MIN_SCORE = 0.35;

@Injectable()
export class TutorService {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly indexing: IndexingService,
  ) {}

  async ask(
    actor: AuthUser,
    courseId: string,
    input: { message: string; questionId?: string; attemptId?: string },
  ) {
    await this.coursesService.getById(actor, courseId);
    void input.attemptId;

    const retrieved = await this.retrieve(courseId, input.message);
    const insufficient = retrieved.length === 0;

    const [thread] = await db
      .insert(tutorThreads)
      .values({
        courseId,
        userId: actor.id,
        questionId: input.questionId,
        state: insufficient ? 'insufficient_evidence' : 'hint',
        flagged: insufficient ? 1 : 0,
      })
      .returning();

    await db.insert(tutorMessages).values({
      threadId: thread.id,
      role: 'user',
      content: input.message,
      citations: [],
    });

    const citations = retrieved.map((r) => ({
      title: r.title,
      locator: r.locator,
      materialId: r.materialId,
      score: r.score,
    }));

    const reply = insufficient
      ? 'I do not have enough evidence in the published course materials to answer that confidently. Ask your lecturer, or try a question closer to the assigned readings.'
      : this.composeHint(input.message, retrieved);

    await db.insert(tutorMessages).values({
      threadId: thread.id,
      role: 'tutor',
      content: reply,
      citations,
      score: retrieved[0]?.score ?? 0,
    });

    return {
      threadId: thread.id,
      state: thread.state,
      reply,
      citations: citations.map(({ title, locator, materialId }) => ({
        title,
        locator,
        materialId,
      })),
      insufficientEvidence: insufficient,
    };
  }

  async preview(
    actor: AuthUser,
    courseId: string,
    input: { message: string; materialIds?: string[] },
  ) {
    await this.coursesService.requireLecturerOrOwner(actor, courseId);
    const retrieved = await this.retrieve(
      courseId,
      input.message,
      input.materialIds,
    );
    const insufficient = retrieved.length === 0;
    return {
      reply: insufficient
        ? 'Insufficient evidence in published materials.'
        : this.composeHint(input.message, retrieved),
      citations: retrieved.map((r) => ({
        title: r.title,
        locator: r.locator,
        materialId: r.materialId,
      })),
      insufficientEvidence: insufficient,
      state: insufficient ? 'insufficient_evidence' : 'hint',
    };
  }

  async listFlags(actor: AuthUser, courseId: string) {
    await this.coursesService.requireLecturerOrOwner(actor, courseId);
    return db.query.tutorThreads.findMany({
      where: and(
        eq(tutorThreads.courseId, courseId),
        eq(tutorThreads.flagged, 1),
      ),
      orderBy: [desc(tutorThreads.createdAt)],
      limit: 50,
    });
  }

  async reindex(actor: AuthUser, courseId: string, materialId: string) {
    await this.coursesService.requireLecturerOrOwner(actor, courseId);
    return this.indexing.reindexMaterial(courseId, materialId);
  }

  private async retrieve(
    courseId: string,
    message: string,
    materialIds?: string[],
  ) {
    const chunks = await db.query.materialChunks.findMany({
      where: eq(materialChunks.courseId, courseId),
    });
    const filtered = materialIds?.length
      ? chunks.filter((c) => materialIds.includes(c.materialId))
      : chunks;

    return filtered
      .map((c) => ({
        ...c,
        score: scoreQuery(message, c.tokenWeights as Record<string, number>),
      }))
      .filter((c) => c.score >= MIN_SCORE)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  private composeHint(
    message: string,
    retrieved: {
      title: string;
      locator: string;
      content: string;
      score: number;
    }[],
  ) {
    const top = retrieved[0];
    const excerpt = top.content.slice(0, 280).trim();
    return [
      'Hint (grounded in your course materials — not a mark):',
      excerpt + (top.content.length > 280 ? '…' : ''),
      '',
      `Try relating your question (“${message.slice(0, 120)}”) to the idea above, then attempt a correction before asking for more detail.`,
      'I will not invent journal lines or marks.',
    ].join('\n');
  }
}
