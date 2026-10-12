import {
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { courses } from './courses';

export const courseRoleEnum = pgEnum('course_role', [
  'student',
  'lecturer',
  'ta',
]);

export const enrolmentStatusEnum = pgEnum('enrolment_status', [
  'active',
  'withdrawn',
]);

export const enrolments = pgTable(
  'enrolments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    role: courseRoleEnum('role').notNull().default('student'),
    status: enrolmentStatusEnum('status').notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('enrolments_user_course_uidx').on(table.userId, table.courseId),
  ],
);

export type Enrolment = typeof enrolments.$inferSelect;
export type NewEnrolment = typeof enrolments.$inferInsert;
