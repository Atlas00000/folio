import {
  integer,
  numeric,
  pgTable,
  timestamp,
  uuid,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { topics } from './topics';
import { courses } from './courses';

/** Derived topic mastery snapshot for a student */
export const topicProgress = pgTable(
  'topic_progress',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    studentId: uuid('student_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    topicId: uuid('topic_id')
      .notNull()
      .references(() => topics.id, { onDelete: 'cascade' }),
    attemptsCount: integer('attempts_count').notNull().default(0),
    correctCount: integer('correct_count').notNull().default(0),
    masteryScore: numeric('mastery_score', { precision: 5, scale: 2 })
      .notNull()
      .default('0'),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex('topic_progress_student_topic_uidx').on(
      t.studentId,
      t.topicId,
    ),
  ],
);

export type TopicProgress = typeof topicProgress.$inferSelect;
