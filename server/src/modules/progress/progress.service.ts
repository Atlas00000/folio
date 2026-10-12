import { Injectable } from '@nestjs/common';
import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { db } from '../../../db';
import {
  attempts,
  enrolments,
  questions,
  topicProgress,
  topics,
} from '../../../db/schema';
import { CoursesService } from '../courses/courses.service';
import type { AuthUser } from '../../common/types/auth-user';

@Injectable()
export class ProgressService {
  constructor(private readonly coursesService: CoursesService) {}

  async myProgress(actor: AuthUser, courseId: string) {
    await this.coursesService.getById(actor, courseId);
    const rows = await db.query.topicProgress.findMany({
      where: and(
        eq(topicProgress.studentId, actor.id),
        eq(topicProgress.courseId, courseId),
      ),
    });

    const topicRows = await db.query.topics.findMany({
      where: eq(topics.courseId, courseId),
      orderBy: [asc(topics.sequence)],
    });

    return topicRows.map((t) => {
      const p = rows.find((r) => r.topicId === t.id);
      return {
        topicId: t.id,
        title: t.title,
        sequence: t.sequence,
        attemptsCount: p?.attemptsCount ?? 0,
        correctCount: p?.correctCount ?? 0,
        masteryScore: p?.masteryScore ?? '0.00',
        weak: p ? Number(p.masteryScore) < 70 : true,
      };
    });
  }

  async courseAnalytics(actor: AuthUser, courseId: string) {
    await this.coursesService.requireLecturerOrOwner(actor, courseId);

    const topicRows = await db.query.topics.findMany({
      where: eq(topics.courseId, courseId),
      orderBy: [asc(topics.sequence)],
    });

    const struggle = [];
    for (const topic of topicRows) {
      const published = await db.query.questions.findMany({
        where: and(
          eq(questions.topicId, topic.id),
          eq(questions.status, 'published'),
        ),
      });

      let submissions = 0;
      let correct = 0;
      let misconceptionHits = 0;

      for (const q of published) {
        const rows = await db.query.attempts.findMany({
          where: eq(attempts.questionId, q.id),
          orderBy: [desc(attempts.submittedAt)],
        });
        submissions += rows.length;
        correct += rows.filter((r) => r.correct).length;
        for (const r of rows) {
          if (
            r.componentMarks.some(
              (c) => c.misconceptionTag === 'debit_credit_swap',
            )
          ) {
            misconceptionHits += 1;
          }
        }
      }

      const errorRate =
        submissions === 0 ? 0 : 1 - correct / Math.max(submissions, 1);

      struggle.push({
        topicId: topic.id,
        title: topic.title,
        publishedQuestions: published.length,
        submissions,
        correct,
        errorRate: Number(errorRate.toFixed(3)),
        debitCreditSwapHits: misconceptionHits,
      });
    }

    struggle.sort((a, b) => b.errorRate - a.errorRate);

    const enrolmentCount = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(enrolments)
      .where(
        and(
          eq(enrolments.courseId, courseId),
          eq(enrolments.status, 'active'),
          eq(enrolments.role, 'student'),
        ),
      );

    return {
      courseId,
      activeStudents: enrolmentCount[0]?.count ?? 0,
      topicsByStruggle: struggle,
    };
  }

  async analyticsCsv(actor: AuthUser, courseId: string): Promise<string> {
    const data = await this.courseAnalytics(actor, courseId);
    const header =
      'topicId,title,publishedQuestions,submissions,correct,errorRate,debitCreditSwapHits';
    const lines = data.topicsByStruggle.map(
      (t) =>
        `${t.topicId},"${t.title.replace(/"/g, '""')}",${t.publishedQuestions},${t.submissions},${t.correct},${t.errorRate},${t.debitCreditSwapHits}`,
    );
    return [header, ...lines].join('\n');
  }
}
