import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { topics } from './topics';
import { users } from './users';

export const materialTypeEnum = pgEnum('material_type', [
  'pdf',
  'docx',
  'slides',
  'video_link',
  'text_summary',
]);

export const publicationStatusEnum = pgEnum('publication_status', [
  'unpublished',
  'published',
  'withdrawn',
]);

export const materials = pgTable('materials', {
  id: uuid('id').defaultRandom().primaryKey(),
  topicId: uuid('topic_id')
    .notNull()
    .references(() => topics.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 240 }).notNull(),
  type: materialTypeEnum('type').notNull(),
  source: text('source'),
  licence: varchar('licence', { length: 120 }),
  version: integer('version').notNull().default(1),
  status: publicationStatusEnum('status').notNull().default('unpublished'),
  storageKey: text('storage_key'),
  externalUrl: text('external_url'),
  mimeType: varchar('mime_type', { length: 120 }),
  byteSize: integer('byte_size'),
  uploaderId: uuid('uploader_id')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Material = typeof materials.$inferSelect;
export type NewMaterial = typeof materials.$inferInsert;
