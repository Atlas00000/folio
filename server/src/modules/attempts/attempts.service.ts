import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '../../../db';
import {
  attempts,
  enrolments,
  questions,
  topicProgress,
  topics,
} from '../../../db/schema';
import { gradeAttempt, type AttemptResponse } from '../../marking';
import { CoursesService } from '../courses/courses.service';
import type { AuthUser } from '../../common/types/auth-user';
import { SubmitAttemptDto } from './dto/submit-attempt.dto';
import { dec } from '../../marking/decimal';

const MAX_ATTEMPTS = 2;

@Injectable()
export class AttemptsService {
  constructor(private readonly coursesService: CoursesService) {}

  async submit(
    actor: AuthUser,
    courseId: string,
    questionId: string,
    dto: SubmitAttemptDto,
  ) {
    await this.requireActiveStudent(actor, courseId);
    const question = await this.getPublishedQuestion(questionId, courseId);

    const prior = await db.query.attempts.findMany({
      where: and(
        eq(attempts.studentId, actor.id),
        eq(attempts.questionId, questionId),
      ),
      orderBy: [desc(attempts.attemptNumber)],
    });

    const last = prior[0];
    if (last?.correct || last?.explanationRevealed) {
      throw new BadRequestException(
        'This question is already completed or revealed for you',
      );
    }
    if (last && last.attemptNumber >= MAX_ATTEMPTS) {
      throw new BadRequestException(
        'No attempts remaining; request the worked explanation',
      );
    }

    // Second attempt requires a hint on the first incorrect attempt
    if (last && last.attemptNumber === 1 && !last.correct) {
      if (!last.hintEvents.length) {
        throw new BadRequestException(
          'Request a hint before your second attempt',
        );
      }
    }

    const attemptNumber = last ? last.attemptNumber + 1 : 1;
    const response = this.toResponse(question.type, dto);
    const mark = gradeAttempt({
      type: question.type,
      response,
      key: question.acceptedSolutions,
      maxMarks: String(question.marks),
    });

    const status =
      mark.correct || attemptNumber >= MAX_ATTEMPTS ? 'completed' : 'submitted';

    const [row] = await db
      .insert(attempts)
      .values({
        studentId: actor.id,
        questionId,
        questionVersion: question.version,
        attemptNumber,
        response: response as Record<string, unknown>,
        componentMarks: mark.components,
        feedback: mark.feedback,
        score: mark.score,
        maxScore: mark.maxScore,
        correct: mark.correct,
        hintEvents: last?.hintEvents ?? [],
        status,
        explanationRevealed: false,
      })
      .returning();

    await this.refreshTopicProgress(actor.id, courseId, question.topicId);

    return {
      attempt: this.sanitize(row),
      mark: {
        correct: mark.correct,
        score: mark.score,
        maxScore: mark.maxScore,
        components: mark.components,
        feedback: mark.feedback,
      },
      next: mark.correct
        ? { canRetry: false, canRequestHint: false, canReveal: true }
        : {
            canRetry: attemptNumber < MAX_ATTEMPTS,
            canRequestHint:
              attemptNumber === 1 && (question.hints?.length ?? 0) > 0,
            canReveal: attemptNumber >= MAX_ATTEMPTS,
          },
    };
  }

  async requestHint(actor: AuthUser, courseId: string, questionId: string) {
    await this.requireActiveStudent(actor, courseId);
    const question = await this.getPublishedQuestion(questionId, courseId);
    const last = await db.query.attempts.findFirst({
      where: and(
        eq(attempts.studentId, actor.id),
        eq(attempts.questionId, questionId),
      ),
      orderBy: [desc(attempts.attemptNumber)],
    });

    if (!last) {
      throw new BadRequestException('Submit an attempt before requesting a hint');
    }
    if (last.correct) {
      throw new BadRequestException('Question already correct');
    }
    if (last.attemptNumber !== 1) {
      throw new BadRequestException('Hints are available after the first attempt only');
    }
    if (last.hintEvents.length > 0) {
      return {
        hint: last.hintEvents[0].text,
        attempt: this.sanitize(last),
      };
    }

    const hintIndex = 0;
    const text =
      question.hints?.[hintIndex] ??
      'Review the component feedback and correct the highlighted part.';

    const hintEvents = [
      ...last.hintEvents,
      { at: new Date().toISOString(), hintIndex, text },
    ];

    const [updated] = await db
      .update(attempts)
      .set({
        hintEvents,
        status: 'hinted',
        updatedAt: new Date(),
      })
      .where(eq(attempts.id, last.id))
      .returning();

    return { hint: text, attempt: this.sanitize(updated) };
  }

  async reveal(actor: AuthUser, courseId: string, questionId: string) {
    await this.requireActiveStudent(actor, courseId);
    const question = await this.getPublishedQuestion(questionId, courseId);
    const last = await db.query.attempts.findFirst({
      where: and(
        eq(attempts.studentId, actor.id),
        eq(attempts.questionId, questionId),
      ),
      orderBy: [desc(attempts.attemptNumber)],
    });

    if (!last) {
      throw new BadRequestException('Submit an attempt first');
    }
    if (!last.correct && last.attemptNumber < MAX_ATTEMPTS) {
      throw new BadRequestException(
        'Use your remaining attempt (and hint) before revealing the solution',
      );
    }

    const [updated] = await db
      .update(attempts)
      .set({
        explanationRevealed: true,
        status: 'revealed',
        updatedAt: new Date(),
      })
      .where(eq(attempts.id, last.id))
      .returning();

    return {
      attempt: this.sanitize(updated),
      explanation: {
        rationale: question.rationale,
        acceptedSolutions: question.acceptedSolutions,
      },
    };
  }

  async listMine(actor: AuthUser, courseId: string, questionId: string) {
    await this.requireActiveStudent(actor, courseId);
    await this.getPublishedQuestion(questionId, courseId);
    const rows = await db.query.attempts.findMany({
      where: and(
        eq(attempts.studentId, actor.id),
        eq(attempts.questionId, questionId),
      ),
      orderBy: [desc(attempts.attemptNumber)],
    });
    return rows.map((r) => this.sanitize(r));
  }

  private toResponse(
    type: 'mcq' | 'numerical' | 'journal',
    dto: SubmitAttemptDto,
  ): AttemptResponse {
    if (type === 'mcq') {
      if (!dto.selectedOptionId) {
        throw new BadRequestException('selectedOptionId required for MCQ');
      }
      return { selectedOptionId: dto.selectedOptionId };
    }
    if (type === 'numerical') {
      if (dto.value === undefined) {
        throw new BadRequestException('value required for numerical');
      }
      return { value: dto.value };
    }
    if (!dto.lines?.length) {
      throw new BadRequestException('lines required for journal');
    }
    return { lines: dto.lines };
  }

  private sanitize(row: typeof attempts.$inferSelect) {
    return row;
  }

  private async requireActiveStudent(actor: AuthUser, courseId: string) {
    await this.coursesService.getById(actor, courseId);
    if (actor.globalRole === 'admin') return;
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
  }

  private async getPublishedQuestion(questionId: string, courseId: string) {
    const question = await db.query.questions.findFirst({
      where: eq(questions.id, questionId),
    });
    if (!question || question.status !== 'published') {
      throw new NotFoundException('Published question not found');
    }
    const topic = await db.query.topics.findFirst({
      where: eq(topics.id, question.topicId),
    });
    if (!topic || topic.courseId !== courseId) {
      throw new ForbiddenException('Question not in this course');
    }
    return question;
  }

  private async refreshTopicProgress(
    studentId: string,
    courseId: string,
    topicId: string,
  ) {
    const topicQuestions = await db.query.questions.findMany({
      where: and(eq(questions.topicId, topicId), eq(questions.status, 'published')),
    });
    const qIds = topicQuestions.map((q) => q.id);
    if (!qIds.length) return;

    let attemptsCount = 0;
    let correctCount = 0;
    for (const qid of qIds) {
      const best = await db.query.attempts.findFirst({
        where: and(
          eq(attempts.studentId, studentId),
          eq(attempts.questionId, qid),
        ),
        orderBy: [desc(attempts.correct), desc(attempts.score)],
      });
      if (best) {
        attemptsCount += 1;
        if (best.correct) correctCount += 1;
      }
    }

    const mastery = qIds.length
      ? dec(correctCount).div(qIds.length).mul(100).toFixed(2)
      : '0.00';

    const existing = await db.query.topicProgress.findFirst({
      where: and(
        eq(topicProgress.studentId, studentId),
        eq(topicProgress.topicId, topicId),
      ),
    });

    if (existing) {
      await db
        .update(topicProgress)
        .set({
          attemptsCount,
          correctCount,
          masteryScore: mastery,
          updatedAt: new Date(),
        })
        .where(eq(topicProgress.id, existing.id));
    } else {
      await db.insert(topicProgress).values({
        studentId,
        courseId,
        topicId,
        attemptsCount,
        correctCount,
        masteryScore: mastery,
      });
    }
  }
}
