/**
 * Seed ACC102–ACC110 (9 courses) with lean topic spines.
 * Idempotent. Enrols demo lecturer + student.
 *
 * Usage: pnpm db:seed:acc-suite
 */
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { courses, users } from '../db/schema';
import { ACC_SUITE } from './data/acc-suite-curriculum';
import { ensureCourseWithContent } from './lib/seed-course-content';

export async function seedAccSuite() {
  const lecturer = await db.query.users.findFirst({
    where: eq(users.email, 'lecturer@example.ac.uk'),
  });
  const student = await db.query.users.findFirst({
    where: eq(users.email, 'student@example.ac.uk'),
  });
  if (!lecturer || !student) {
    throw new Error('Demo users missing — run pnpm db:seed first');
  }

  for (const def of ACC_SUITE) {
    await ensureCourseWithContent({
      meta: {
        code: def.code,
        title: def.title,
        term: def.term,
        description: def.description,
        joinCode: def.joinCode,
      },
      topics: def.topics,
      lecturerId: lecturer.id,
      studentId: student.id,
    });
  }

  const codes = ACC_SUITE.map((c) => c.code);
  const rows = await db.query.courses.findMany();
  const suite = rows.filter((c) => codes.includes(c.code));
  console.log(
    `Suite complete: ${suite.length}/${codes.length} courses (ACC102–ACC110).`,
  );
  return suite.length;
}

const invokedDirectly = process.argv[1]?.includes('seed-acc-suite');
if (invokedDirectly) {
  seedAccSuite()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
