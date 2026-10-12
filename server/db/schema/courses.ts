import {
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
  text,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const courseStatusEnum = pgEnum('course_status', [
  'draft',
  'active',
  'archived',
]);

export const courses = pgTable('courses', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 32 }).notNull().unique(),
  title: varchar('title', { length: 200 }).notNull(),
  term: varchar('term', { length: 64 }).notNull(),
  description: text('description'),
  joinCode: varchar('join_code', { length: 32 }).notNull().unique(),
  status: courseStatusEnum('status').notNull().default('draft'),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;
