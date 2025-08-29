import { z } from 'zod';

// Vote option schema
export const voteOptionSchema = z.object({
  id: z.number(),
  question_id: z.number(),
  option_text: z.string(),
  vote_count: z.number().int(),
  created_at: z.coerce.date()
});

export type VoteOption = z.infer<typeof voteOptionSchema>;

// Question schema
export const questionSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.coerce.date()
});

export type Question = z.infer<typeof questionSchema>;

// Vote record schema for tracking anonymous votes
export const voteRecordSchema = z.object({
  id: z.number(),
  question_id: z.number(),
  option_id: z.number(),
  voter_fingerprint: z.string(), // Anonymous identifier (IP + user agent hash)
  created_at: z.coerce.date()
});

export type VoteRecord = z.infer<typeof voteRecordSchema>;

// Input schema for casting a vote
export const castVoteInputSchema = z.object({
  question_id: z.number(),
  option_id: z.number(),
  voter_fingerprint: z.string()
});

export type CastVoteInput = z.infer<typeof castVoteInputSchema>;

// Input schema for creating a question with options
export const createQuestionInputSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
  options: z.array(z.string()).min(2) // At least 2 options required
});

export type CreateQuestionInput = z.infer<typeof createQuestionInputSchema>;

// Voting results schema with percentages
export const votingResultsSchema = z.object({
  question: questionSchema,
  options: z.array(z.object({
    id: z.number(),
    option_text: z.string(),
    vote_count: z.number().int(),
    percentage: z.number()
  })),
  total_votes: z.number().int()
});

export type VotingResults = z.infer<typeof votingResultsSchema>;