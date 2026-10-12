import {
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { topics } from './topics';
import { publicationStatusEnum } from './materials';

export const questionTypeEnum = pgEnum('question_type', [
  'mcq',
  'numerical',
  'journal',
]);

export const difficultyEnum = pgEnum('difficulty', [
  'intro',
  'core',
  'stretch',
]);

/** Journal answer key shape stored in accepted_solutions */
export type JournalLineKey = {
  account: string;
  direction: 'debit' | 'credit';
  amount: string;
};

export type AcceptedSolutions = {
  mcqCorrectOptionId?: string;
  numericalValue?: string;
  numericalTolerance?: string;
  journalLines?: JournalLineKey[];
  /** map canonical account label → approved alternate labels */
  alternateAccounts?: Record<string, string[]>;
};

export const questions = pgTable('questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  topicId: uuid('topic_id')
    .notNull()
    .references(() => topics.id, { onDelete: 'cascade' }),
  type: questionTypeEnum('type').notNull(),
  prompt: text('prompt').notNull(),
  difficulty: difficultyEnum('difficulty').notNull().default('core'),
  marks: numeric('marks', { precision: 8, scale: 2 }).notNull().default('1'),
  status: publicationStatusEnum('status').notNull().default('unpublished'),
  version: integer('version').notNull().default(1),
  acceptedSolutions: jsonb('accepted_solutions')
    .$type<AcceptedSolutions>()
    .notNull()
    .default({}),
  hints: jsonb('hints').$type<string[]>().notNull().default([]),
  rationale: text('rationale'),
  misconceptionTags: jsonb('misconception_tags')
    .$type<string[]>()
    .notNull()
    .default([]),
  /** MCQ options: [{ id, label }] */
  options: jsonb('options')
    .$type<Array<{ id: string; label: string }>>()
    .notNull()
    .default([]),
  source: varchar('source', { length: 240 }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
