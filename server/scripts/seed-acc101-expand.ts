/**
 * Expand / refresh ACC101 topics from data/acc101-curriculum.ts.
 * Idempotent: upserts by sequence; adds materials/questions only when missing.
 *
 * Usage: pnpm db:seed:acc101
 */
import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import {
  courses,
  learningOutcomes,
  materials,
  questions,
  topics,
  users,
} from '../db/schema';
import { ACC101_COURSE, ACC101_TOPICS } from './data/acc101-curriculum';

export async function expandAcc101() {
  const course = await db.query.courses.findFirst({
    where: eq(courses.code, ACC101_COURSE.code),
  });
  if (!course) {
    throw new Error('ACC101 not found — run pnpm db:seed first');
  }

  const lecturer = await db.query.users.findFirst({
    where: eq(users.email, 'lecturer@example.ac.uk'),
  });
  if (!lecturer) {
    throw new Error('lecturer@example.ac.uk not found — run pnpm db:seed first');
  }

  await db
    .update(courses)
    .set({
      title: ACC101_COURSE.title,
      term: ACC101_COURSE.term,
      description: ACC101_COURSE.description,
      updatedAt: new Date(),
    })
    .where(eq(courses.id, course.id));

  const { LocalStorageService } = await import(
    '../src/modules/materials/local-storage.service'
  );
  const { IndexingService } = await import(
    '../src/modules/tutor/indexing.service'
  );
  const storage = new LocalStorageService();
  const indexing = new IndexingService(storage);

  for (const def of ACC101_TOPICS) {
    let topic = await db.query.topics.findFirst({
      where: and(
        eq(topics.courseId, course.id),
        eq(topics.sequence, def.sequence),
      ),
    });

    if (!topic && def.sequence === 1) {
      const legacy = await db.query.topics.findMany({
        where: eq(topics.courseId, course.id),
      });
      topic = legacy.find((t) => t.sequence === 1) ?? legacy[0];
    }

    if (topic) {
      await db
        .update(topics)
        .set({
          title: def.title,
          description: def.description,
          sequence: def.sequence,
          updatedAt: new Date(),
        })
        .where(eq(topics.id, topic.id));
      console.log(`updated topic ${def.sequence}: ${def.title}`);
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
      console.log(`created topic ${def.sequence}: ${def.title}`);
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
        originalName: `acc101-t${def.sequence}.txt`,
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
          uploaderId: lecturer.id,
          mimeType: 'text/plain',
          storageKey: saved.storageKey,
          externalUrl: null,
          byteSize: saved.byteSize,
          source: 'ACC101 curriculum seed',
        })
        .returning();
      await indexing.reindexMaterial(course.id, mat.id);
      console.log(`  + material: ${def.materialTitle}`);
    } else if (def.sequence === 1) {
      await db
        .update(materials)
        .set({
          title: def.materialTitle,
          source: 'ACC101 curriculum seed',
          updatedAt: new Date(),
        })
        .where(eq(materials.id, mats[0].id));
      console.log(`  ~ material title refreshed`);
    }

    const existingQs = await db.query.questions.findMany({
      where: eq(questions.topicId, topic.id),
    });
    const existingPrompts = new Set(existingQs.map((q) => q.prompt));
    const missing = def.questions.filter((q) => !existingPrompts.has(q.prompt));
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
          source: 'ACC101 curriculum seed',
        })),
      );
      console.log(
        `  + ${missing.length} question(s)${existingQs.length ? ' (filled gaps)' : ''}`,
      );
    } else {
      console.log(`  = ${existingQs.length} question(s) already present`);
    }
  }

  const all = await db.query.topics.findMany({
    where: eq(topics.courseId, course.id),
  });
  console.log(`ACC101 now has ${all.length} topics.`);
  return all.length;
}

/** Run only when invoked as a script (not when imported from seed.ts). */
const invokedDirectly = process.argv[1]?.includes('seed-acc101-expand');
if (invokedDirectly) {
  expandAcc101()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
