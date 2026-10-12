import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { questions } from './questions';

export const attemptStatusEnum = pgEnum('attempt_status', [
  'submitted',
  'hinted',
  'completed',
  'revealed',
]);

export type AttemptResponsePayload = Record<string, unknown>;

export type ComponentMarkPayload = {
  component: string;
  correct: boolean;
  detail?: string;
  misconceptionTag?: string;
};

export type HintEvent = {
  at: string;
  hintIndex: number;
  text: string;
};

export const attempts = pgTable('attempts', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  questionId: uuid('question_id')
    .notNull()
    .references(() => questions.id, { onDelete: 'cascade' }),
  questionVersion: integer('question_version').notNull(),
  attemptNumber: integer('attempt_number').notNull().default(1),
  response: jsonb('response').$type<AttemptResponsePayload>().notNull(),
  componentMarks: jsonb('component_marks')
    .$type<ComponentMarkPayload[]>()
    .notNull()
    .default([]),
  feedback: jsonb('feedback').$type<string[]>().notNull().default([]),
  score: numeric('score', { precision: 8, scale: 2 }).notNull().default('0'),
  maxScore: numeric('max_score', { precision: 8, scale: 2 })
    .notNull()
    .default('0'),
  correct: boolean('correct').notNull().default(false),
  hintEvents: jsonb('hint_events').$type<HintEvent[]>().notNull().default([]),
  status: attemptStatusEnum('status').notNull().default('submitted'),
  explanationRevealed: boolean('explanation_revealed')
    .notNull()
    .default(false),
  submittedAt: timestamp('submitted_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Attempt = typeof attempts.$inferSelect;
export type NewAttempt = typeof attempts.$inferInsert;
