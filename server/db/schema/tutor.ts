import {
  integer,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { courses } from './courses';
import { materials } from './materials';
import { users } from './users';

/** Grounded chunks from published materials (keyword retrieval locally). */
export const materialChunks = pgTable('material_chunks', {
  id: uuid('id').defaultRandom().primaryKey(),
  courseId: uuid('course_id')
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }),
  materialId: uuid('material_id')
    .notNull()
    .references(() => materials.id, { onDelete: 'cascade' }),
  materialVersion: integer('material_version').notNull().default(1),
  title: varchar('title', { length: 240 }).notNull(),
  locator: varchar('locator', { length: 120 }).notNull(),
  content: text('content').notNull(),
  /** Bag-of-words weights for local retrieval (no external embedding API required). */
  tokenWeights: jsonb('token_weights').$type<Record<string, number>>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const tutorThreads = pgTable('tutor_threads', {
  id: uuid('id').defaultRandom().primaryKey(),
  courseId: uuid('course_id')
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  questionId: uuid('question_id'),
  state: varchar('state', { length: 40 }).notNull().default('open'),
  flagged: integer('flagged').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const tutorMessages = pgTable('tutor_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  threadId: uuid('thread_id')
    .notNull()
    .references(() => tutorThreads.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 20 }).notNull(),
  content: text('content').notNull(),
  citations: jsonb('citations')
    .$type<{ title: string; locator: string; materialId?: string; score?: number }[]>()
    .notNull()
    .default([]),
  score: real('score'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
