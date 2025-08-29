import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import { 
  createQuestionInputSchema,
  castVoteInputSchema 
} from './schema';

// Import handlers
import { createQuestion } from './handlers/create_question';
import { getActiveQuestion } from './handlers/get_active_question';
import { castVote } from './handlers/cast_vote';
import { getVotingResults } from './handlers/get_voting_results';
import { checkVoteStatus } from './handlers/check_vote_status';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check endpoint
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Create a new question with voting options
  createQuestion: publicProcedure
    .input(createQuestionInputSchema)
    .mutation(({ input }) => createQuestion(input)),

  // Get the currently active question
  getActiveQuestion: publicProcedure
    .query(() => getActiveQuestion()),

  // Cast a vote for a specific option
  castVote: publicProcedure
    .input(castVoteInputSchema)
    .mutation(({ input }) => castVote(input)),

  // Get real-time voting results for a question
  getVotingResults: publicProcedure
    .input(z.object({ questionId: z.number() }))
    .query(({ input }) => getVotingResults(input.questionId)),

  // Check if a user has already voted on a question
  checkVoteStatus: publicProcedure
    .input(z.object({ 
      questionId: z.number(), 
      voterFingerprint: z.string() 
    }))
    .query(({ input }) => checkVoteStatus(input.questionId, input.voterFingerprint)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();