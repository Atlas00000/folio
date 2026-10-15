import { and, eq } from 'drizzle-orm';
import { db } from '../../db';
import {
  courses,
  enrolments,
  learningOutcomes,
  materials,
  questions,
  topics,
} from '../../db/schema';
import type { Acc101TopicSeed } from '../data/acc101-curriculum';

type CourseMeta = {
  code: string;
  title: string;
  term: string;
  description: string;
  joinCode: string;
};

export async function ensureCourseWithContent(input: {
  meta: CourseMeta;
  topics: Acc101TopicSeed[];
  lecturerId: string;
  studentId?: string;
}) {
  const { meta, topics: topicDefs, lecturerId, studentId } = input;

  let course = await db.query.courses.findFirst({
    where: eq(courses.code, meta.code),
  });

  if (!course) {
    const [created] = await db
      .insert(courses)
      .values({
        code: meta.code,
        title: meta.title,
        term: meta.term,
        description: meta.description,
        joinCode: meta.joinCode,
        status: 'active',
        ownerId: lecturerId,
      })
      .returning();
    course = created;
    console.log(`created course ${meta.code}`);
  } else {
    await db
      .update(courses)
      .set({
        title: meta.title,
        term: meta.term,
        description: meta.description,
        updatedAt: new Date(),
      })
      .where(eq(courses.id, course.id));
    console.log(`updated course ${meta.code}`);
  }

  await ensureEnrolment(lecturerId, course.id, 'lecturer');
  if (studentId) {
    await ensureEnrolment(studentId, course.id, 'student');
  }

  const { LocalStorageService } = await import(
    '../../src/modules/materials/local-storage.service'
  );
  const { IndexingService } = await import(
    '../../src/modules/tutor/indexing.service'
  );
  const storage = new LocalStorageService();
  const indexing = new IndexingService(storage);

  for (const def of topicDefs) {
    let topic = await db.query.topics.findFirst({
      where: and(
        eq(topics.courseId, course.id),
        eq(topics.sequence, def.sequence),
      ),
    });

    if (topic) {
      await db
        .update(topics)
        .set({
          title: def.title,
          description: def.description,
          updatedAt: new Date(),
        })
        .where(eq(topics.id, topic.id));
    } else {
      const [created] = await db
        .insert(topics)
        .values({
          courseId: course.id,
          title: def.title,
          description: def.description,
          sequence: def.sequence,
        })
        .returning();
      topic = created;
      console.log(`  + topic ${def.sequence}: ${def.title}`);
    }

    const outcomes = await db.query.learningOutcomes.findMany({
      where: eq(learningOutcomes.topicId, topic.id),
    });
    if (!outcomes.length) {
      await db.insert(learningOutcomes).values({
        topicId: topic.id,
        description: def.learningOutcome,
        sequence: 0,
      });
    } else {
      await db
        .update(learningOutcomes)
        .set({ description: def.learningOutcome })
        .where(eq(learningOutcomes.id, outcomes[0].id));
    }

    const mats = await db.query.materials.findMany({
      where: eq(materials.topicId, topic.id),
    });
    if (!mats.length) {
      const saved = await storage.save({
        courseId: course.id,
        originalName: `${meta.code.toLowerCase()}-t${def.sequence}.txt`,
        buffer: Buffer.from(def.materialBody, 'utf8'),
        mimeType: 'text/plain',
      });
      const [mat] = await db
        .insert(materials)
        .values({
          topicId: topic.id,
          title: def.materialTitle,
          type: 'text_summary',
          licence: 'course',
          status: 'published',
          version: 1,
          uploaderId: lecturerId,
          mimeType: 'text/plain',
          storageKey: saved.storageKey,
          externalUrl: null,
          byteSize: saved.byteSize,
          source: `${meta.code} curriculum seed`,
        })
        .returning();
      await indexing.reindexMaterial(course.id, mat.id);
    }

    const existingQs = await db.query.questions.findMany({
      where: eq(questions.topicId, topic.id),
    });
    const prompts = new Set(existingQs.map((q) => q.prompt));
    const missing = def.questions.filter((q) => !prompts.has(q.prompt));
    if (missing.length) {
      await db.insert(questions).values(
        missing.map((q) => ({
          topicId: topic!.id,
          type: q.type,
          prompt: q.prompt,
          difficulty: q.difficulty,
          marks: q.marks,
          status: 'published' as const,
          version: 1,
          options: q.options ?? [],
          acceptedSolutions: q.acceptedSolutions,
          hints: q.hints,
          misconceptionTags: q.misconceptionTags ?? [],
          rationale: q.rationale ?? null,
          source: `${meta.code} curriculum seed`,
        })),
      );
    }
  }

  return course;
}

async function ensureEnrolment(
  userId: string,
  courseId: string,
  role: 'student' | 'lecturer' | 'ta',
) {
  const row = await db.query.enrolments.findFirst({
    where: and(
      eq(enrolments.userId, userId),
      eq(enrolments.courseId, courseId),
    ),
  });
  if (row) {
    if (row.status !== 'active' || row.role !== role) {
      await db
        .update(enrolments)
        .set({ status: 'active', role, updatedAt: new Date() })
        .where(eq(enrolments.id, row.id));
    }
    return;
  }
  await db.insert(enrolments).values({
    userId,
    courseId,
    role,
    status: 'active',
  });
}
