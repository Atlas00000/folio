import * as bcrypt from 'bcryptjs';
import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import {
  courses,
  enrolments,
  learningOutcomes,
  materials,
  questions,
  topics,
  users,
} from '../db/schema';

/**
 * Idempotent A3 seed: demo users + ACC101 sample content for local client work.
 */
async function upsertUser(input: {
  email: string;
  displayName: string;
  password: string;
  globalRole: 'student' | 'lecturer' | 'admin';
}) {
  const email = input.email.toLowerCase();
  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (existing) {
    console.log(`exists: ${email} (${existing.globalRole})`);
    return existing;
  }
  const passwordHash = await bcrypt.hash(input.password, 12);
  const [row] = await db
    .insert(users)
    .values({
      email,
      displayName: input.displayName,
      passwordHash,
      globalRole: input.globalRole,
      status: 'active',
    })
    .returning();
  console.log(`created: ${email} (${row.globalRole})`);
  return row;
}

async function ensureAcc101(lecturerId: string, studentId: string) {
  let course = await db.query.courses.findFirst({
    where: eq(courses.code, 'ACC101'),
  });

  if (!course) {
    const [created] = await db
      .insert(courses)
      .values({
        code: 'ACC101',
        title: 'Introduction to Financial Accounting',
        term: '2026-T1',
        description: 'Pilot first-year accounting course (A3 seed)',
        joinCode: 'acc101demo',
        status: 'active',
        ownerId: lecturerId,
      })
      .returning();
    course = created;
    console.log(`created course ACC101 joinCode=${course.joinCode}`);
  } else {
    console.log(`exists: course ACC101 (${course.id})`);
  }

  await ensureEnrolment(lecturerId, course.id, 'lecturer');
  await ensureEnrolment(studentId, course.id, 'student');

  let topic = (
    await db.query.topics.findMany({ where: eq(topics.courseId, course.id) })
  )[0];

  if (!topic) {
    const [createdTopic] = await db
      .insert(topics)
      .values({
        courseId: course.id,
        title: 'Double-entry basics',
        sequence: 1,
        description: 'Debits, credits, and simple journals',
      })
      .returning();
    topic = createdTopic;
    await db.insert(learningOutcomes).values({
      topicId: topic.id,
      description: 'Record a simple owner-investment journal entry',
      sequence: 0,
    });
    console.log(`created topic: ${topic.title}`);
  }

  const existingMaterials = await db.query.materials.findMany({
    where: eq(materials.topicId, topic.id),
  });
  if (!existingMaterials.length) {
    const { LocalStorageService } = await import(
      '../src/modules/materials/local-storage.service'
    );
    const storage = new LocalStorageService();
    const body = [
      'Week 1 — Accounting equation and double-entry.',
      'Assets = Liabilities + Equity.',
      'When an owner invests cash into the business, debit the Cash asset account and credit the Capital equity account.',
      'Assets increase with debits; equity increases with credits for capital introduced.',
    ].join(' ');
    const saved = await storage.save({
      courseId: course.id,
      originalName: 'week1-summary.txt',
      buffer: Buffer.from(body, 'utf8'),
      mimeType: 'text/plain',
    });
    const [mat] = await db
      .insert(materials)
      .values({
        topicId: topic.id,
        title: 'Week 1 — Accounting equation',
        type: 'text_summary',
        licence: 'course',
        status: 'published',
        version: 1,
        uploaderId: lecturerId,
        mimeType: 'text/plain',
        storageKey: saved.storageKey,
        externalUrl: null,
        byteSize: saved.byteSize,
        source: 'ACC101 pilot seed',
      })
      .returning();
    const { IndexingService } = await import(
      '../src/modules/tutor/indexing.service'
    );
    await new IndexingService(storage).reindexMaterial(course.id, mat.id);
    console.log('created published material summary + tutor index');
  }

  const existingQuestions = await db.query.questions.findMany({
    where: eq(questions.topicId, topic.id),
  });
  if (!existingQuestions.length) {
    await db.insert(questions).values([
      {
        topicId: topic.id,
        type: 'mcq',
        prompt: 'Which side increases an asset account?',
        difficulty: 'intro',
        marks: '1',
        status: 'published',
        version: 1,
        options: [
          { id: 'a', label: 'Debit' },
          { id: 'b', label: 'Credit' },
        ],
        acceptedSolutions: { mcqCorrectOptionId: 'a' },
        hints: ['Assets increase on the debit side.'],
        misconceptionTags: [],
        rationale: 'Under double-entry, asset increases are debited.',
      },
      {
        topicId: topic.id,
        type: 'numerical',
        prompt: 'Cash 200 + Inventory 50. What is total assets?',
        difficulty: 'intro',
        marks: '1',
        status: 'published',
        version: 1,
        options: [],
        acceptedSolutions: {
          numericalValue: '250.00',
          numericalTolerance: '0.01',
        },
        hints: ['Add the asset balances.'],
        misconceptionTags: [],
      },
      {
        topicId: topic.id,
        type: 'journal',
        prompt: 'Owner invests 500 cash into the business.',
        difficulty: 'intro',
        marks: '2',
        status: 'published',
        version: 1,
        options: [],
        acceptedSolutions: {
          journalLines: [
            { account: 'Cash', direction: 'debit', amount: '500.00' },
            { account: 'Capital', direction: 'credit', amount: '500.00' },
          ],
          alternateAccounts: { Cash: ['Bank', 'Cash at bank'] },
        },
        hints: ['Think about which account increases with a debit'],
        misconceptionTags: ['debit_credit_swap'],
        rationale: 'Dr Cash 500, Cr Capital 500.',
      },
    ]);
    console.log('created 3 published sample questions (mcq/numerical/journal)');
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

async function main() {
  const lecturer = await upsertUser({
    email: 'lecturer@example.ac.uk',
    displayName: 'Demo Lecturer',
    password: 'password123',
    globalRole: 'lecturer',
  });
  const student = await upsertUser({
    email: 'student@example.ac.uk',
    displayName: 'Demo Student',
    password: 'password123',
    globalRole: 'student',
  });

  const course = await ensureAcc101(lecturer.id, student.id);

  console.log('Seed complete.');
  console.log('  lecturer@example.ac.uk / password123');
  console.log('  student@example.ac.uk / password123');
  console.log(`  ACC101 joinCode=${course.joinCode}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
