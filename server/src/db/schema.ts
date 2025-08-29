import { serial, text, pgTable, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Questions table
export const questionsTable = pgTable('questions', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'), // Nullable by default
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Vote options table
export const voteOptionsTable = pgTable('vote_options', {
  id: serial('id').primaryKey(),
  question_id: integer('question_id').notNull(),
  option_text: text('option_text').notNull(),
  vote_count: integer('vote_count').default(0).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Vote records table for tracking anonymous votes
export const voteRecordsTable = pgTable('vote_records', {
  id: serial('id').primaryKey(),
  question_id: integer('question_id').notNull(),
  option_id: integer('option_id').notNull(),
  voter_fingerprint: text('voter_fingerprint').notNull(), // Anonymous identifier
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Define relations
export const questionsRelations = relations(questionsTable, ({ many }) => ({
  options: many(voteOptionsTable),
  votes: many(voteRecordsTable),
}));

export const voteOptionsRelations = relations(voteOptionsTable, ({ one, many }) => ({
  question: one(questionsTable, {
    fields: [voteOptionsTable.question_id],
    references: [questionsTable.id],
  }),
  votes: many(voteRecordsTable),
}));

export const voteRecordsRelations = relations(voteRecordsTable, ({ one }) => ({
  question: one(questionsTable, {
    fields: [voteRecordsTable.question_id],
    references: [questionsTable.id],
  }),
  option: one(voteOptionsTable, {
    fields: [voteRecordsTable.option_id],
    references: [voteOptionsTable.id],
  }),
}));

// TypeScript types for the table schemas
export type Question = typeof questionsTable.$inferSelect;
export type NewQuestion = typeof questionsTable.$inferInsert;
export type VoteOption = typeof voteOptionsTable.$inferSelect;
export type NewVoteOption = typeof voteOptionsTable.$inferInsert;
export type VoteRecord = typeof voteRecordsTable.$inferSelect;
export type NewVoteRecord = typeof voteRecordsTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = { 
  questions: questionsTable, 
  voteOptions: voteOptionsTable, 
  voteRecords: voteRecordsTable 
};