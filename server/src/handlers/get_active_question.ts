import { type Question } from '../schema';

export async function getActiveQuestion(): Promise<Question | null> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is fetching the currently active question
    // that users can vote on. Should return null if no active question exists.
    // Query: SELECT * FROM questions WHERE is_active = true LIMIT 1
    return Promise.resolve(null);
}