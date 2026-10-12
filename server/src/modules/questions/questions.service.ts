import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../../../db';
import {
  questions,
  topics,
  type AcceptedSolutions,
} from '../../../db/schema';
import { AuditService } from '../audit/audit.service';
import { CoursesService } from '../courses/courses.service';
import type { AuthUser } from '../../common/types/auth-user';
import { CreateQuestionDto } from './dto/create-question.dto';
@Injectable()
export class QuestionsService {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly audit: AuditService,
  ) {}

  async create(
    actor: AuthUser,
    courseId: string,
    topicId: string,
    dto: CreateQuestionDto,
  ) {
    await this.coursesService.requireLecturerOrOwner(actor, courseId);
    await this.assertTopic(topicId, courseId);
    this.validateAnswerKey(dto);

    const acceptedSolutions: AcceptedSolutions = {
      mcqCorrectOptionId: dto.mcqCorrectOptionId,
      numericalValue: dto.numericalValue,
      numericalTolerance: dto.numericalTolerance,
      journalLines: dto.journalLines,
      alternateAccounts: dto.alternateAccounts,
    };

    const [row] = await db
      .insert(questions)
      .values({
        topicId,
        type: dto.type,
        prompt: dto.prompt.trim(),
        difficulty: dto.difficulty ?? 'core',
        marks: dto.marks ?? '1',
        status: 'unpublished',
        version: 1,
        acceptedSolutions,
        hints: dto.hints ?? [],
        rationale: dto.rationale?.trim(),
        misconceptionTags: dto.misconceptionTags ?? [],
        options: dto.options ?? [],
        source: dto.source?.trim(),
      })
      .returning();

    await this.audit.log({
      actorId: actor.id,
      courseId,
      action: 'question.created',
      entityType: 'question',
      entityId: row.id,
    });

    return this.publicize(row, 'lecturer');
  }

  async list(actor: AuthUser, courseId: string, topicId: string) {
    await this.coursesService.getById(actor, courseId);
    await this.assertTopic(topicId, courseId);
    const rows = await db.query.questions.findMany({
      where: eq(questions.topicId, topicId),
    });
    const role = await this.viewerRole(actor, courseId);
    if (role === 'student') {
      return rows
        .filter((q) => q.status === 'published')
        .map((q) => this.publicize(q, 'student'));
    }
    return rows.map((q) => this.publicize(q, 'lecturer'));
  }

  async publish(actor: AuthUser, courseId: string, questionId: string) {
    await this.coursesService.requireLecturerOrOwner(actor, courseId);
    await this.getInCourse(questionId, courseId);
    const [updated] = await db
      .update(questions)
      .set({ status: 'published', updatedAt: new Date() })
      .where(eq(questions.id, questionId))
      .returning();
    await this.audit.log({
      actorId: actor.id,
      courseId,
      action: 'question.published',
      entityType: 'question',
      entityId: questionId,
    });
    return this.publicize(updated, 'lecturer');
  }

  async previewCsv(csv: string) {
    return this.parseQuestionCsv(csv);
  }

  async commitCsv(actor: AuthUser, courseId: string, topicId: string, csv: string) {
    await this.coursesService.requireLecturerOrOwner(actor, courseId);
    await this.assertTopic(topicId, courseId);
    const parsed = this.parseQuestionCsv(csv);
    if (parsed.errors.length) {
      throw new BadRequestException({
        message: 'CSV validation failed',
        errors: parsed.errors,
      });
    }

    const created = [];
    for (const row of parsed.rows) {
      const item = await this.create(actor, courseId, topicId, row);
      created.push(item.id);
    }

    await this.audit.log({
      actorId: actor.id,
      courseId,
      action: 'question.csv_import',
      entityType: 'question',
      metadata: { count: created.length, topicId },
    });

    return { imported: created.length, questionIds: created };
  }

  private validateAnswerKey(dto: CreateQuestionDto) {
    if (dto.type === 'mcq') {
      if (!dto.options?.length || !dto.mcqCorrectOptionId) {
        throw new BadRequestException('MCQ requires options and mcqCorrectOptionId');
      }
      if (!dto.options.some((o) => o.id === dto.mcqCorrectOptionId)) {
        throw new BadRequestException('mcqCorrectOptionId must match an option');
      }
    }
    if (dto.type === 'numerical' && !dto.numericalValue) {
      throw new BadRequestException('numerical requires numericalValue');
    }
    if (dto.type === 'journal' && !dto.journalLines?.length) {
      throw new BadRequestException('journal requires journalLines');
    }
  }

  private publicize(
    q: typeof questions.$inferSelect,
    viewer: 'student' | 'lecturer',
  ) {
    if (viewer === 'lecturer') {
      return q;
    }
    const { acceptedSolutions: _a, rationale: _r, ...rest } = q;
    return rest;
  }

  private async assertTopic(topicId: string, courseId: string) {
    const topic = await db.query.topics.findFirst({
      where: eq(topics.id, topicId),
    });
    if (!topic || topic.courseId !== courseId) {
      throw new NotFoundException('Topic not found in course');
    }
  }

  private async getInCourse(questionId: string, courseId: string) {
    const q = await db.query.questions.findFirst({
      where: eq(questions.id, questionId),
    });
    if (!q) {
      throw new NotFoundException('Question not found');
    }
    const topic = await db.query.topics.findFirst({
      where: eq(topics.id, q.topicId),
    });
    if (!topic || topic.courseId !== courseId) {
      throw new ForbiddenException('Question not in this course');
    }
    return q;
  }

  private async viewerRole(actor: AuthUser, courseId: string) {
    if (actor.globalRole === 'admin') return 'lecturer';
    const course = await this.coursesService.getById(actor, courseId);
    const role = 'myRole' in course ? String(course.myRole) : 'student';
    return role === 'student' ? 'student' : 'lecturer';
  }

  /** Simple CSV: type,prompt,difficulty,marks,solution_json */
  private parseQuestionCsv(csv: string): {
    rows: CreateQuestionDto[];
    errors: string[];
  } {
    const lines = csv
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !l.toLowerCase().startsWith('type,'));

    const rows: CreateQuestionDto[] = [];
    const errors: string[] = [];
    const seenPrompts = new Set<string>();

    for (let i = 0; i < lines.length; i++) {
      const lineNo = i + 1;
      const parts = splitCsvLine(lines[i]);
      const type = (parts[0] ?? '').trim() as CreateQuestionDto['type'];
      const prompt = (parts[1] ?? '').trim();
      const difficulty = (parts[2] ?? 'core').trim() as CreateQuestionDto['difficulty'];
      const marks = (parts[3] ?? '1').trim();
      const solutionRaw = (parts[4] ?? '').trim();

      if (!['mcq', 'numerical', 'journal'].includes(type)) {
        errors.push(`Line ${lineNo}: invalid type`);
        continue;
      }
      if (prompt.length < 3) {
        errors.push(`Line ${lineNo}: prompt too short`);
        continue;
      }
      if (seenPrompts.has(prompt.toLowerCase())) {
        errors.push(`Line ${lineNo}: duplicate prompt`);
        continue;
      }
      seenPrompts.add(prompt.toLowerCase());

      let solution: Record<string, unknown> = {};
      try {
        solution = solutionRaw ? (JSON.parse(solutionRaw) as Record<string, unknown>) : {};
      } catch {
        errors.push(`Line ${lineNo}: solution_json is not valid JSON`);
        continue;
      }

      const dto: CreateQuestionDto = {
        type,
        prompt,
        difficulty: ['intro', 'core', 'stretch'].includes(difficulty ?? '')
          ? difficulty
          : 'core',
        marks,
        options: (solution.options as CreateQuestionDto['options']) ?? [],
        mcqCorrectOptionId: solution.mcqCorrectOptionId as string | undefined,
        numericalValue: solution.numericalValue as string | undefined,
        numericalTolerance: solution.numericalTolerance as string | undefined,
        journalLines: solution.journalLines as CreateQuestionDto['journalLines'],
        alternateAccounts: solution.alternateAccounts as Record<
          string,
          string[]
        >,
        hints: (solution.hints as string[]) ?? [],
        misconceptionTags: (solution.misconceptionTags as string[]) ?? [],
      };

      try {
        this.validateAnswerKey(dto);
        rows.push(dto);
      } catch (e) {
        errors.push(
          `Line ${lineNo}: ${e instanceof Error ? e.message : 'invalid answer key'}`,
        );
      }
    }

    return { rows, errors };
  }
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  result.push(current);
  return result;
}
