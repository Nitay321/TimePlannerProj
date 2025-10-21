'use server';

/**
 * @fileOverview This file defines the Genkit flow for the AI Smart Scheduling assistant.
 *
 * - aiSmartScheduling - A function that suggests optimal times for tasks based on user habits, calendar availability, and external factors.
 * - AISmartSchedulingInput - The input type for the aiSmartScheduling function.
 * - AISmartSchedulingOutput - The return type for the aiSmartScheduling function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISmartSchedulingInputSchema = z.object({
  taskDescription: z.string().describe('The description of the task to be scheduled.'),
  userHabits: z.string().optional().describe('The user habits to consider when scheduling the task.'),
  calendarAvailability: z.string().optional().describe('The user calendar availability to consider when scheduling the task.'),
  externalFactors: z.string().optional().describe('The external factors to consider when scheduling the task.'),
});
export type AISmartSchedulingInput = z.infer<typeof AISmartSchedulingInputSchema>;

const AISmartSchedulingOutputSchema = z.object({
  suggestedTime: z.string().describe('The suggested optimal time for the task.'),
  reasoning: z.string().describe('The reasoning behind the suggested time.'),
});
export type AISmartSchedulingOutput = z.infer<typeof AISmartSchedulingOutputSchema>;

export async function aiSmartScheduling(input: AISmartSchedulingInput): Promise<AISmartSchedulingOutput> {
  return aiSmartSchedulingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSmartSchedulingPrompt',
  input: {schema: AISmartSchedulingInputSchema},
  output: {schema: AISmartSchedulingOutputSchema},
  prompt: `You are an AI-powered smart scheduling assistant that suggests optimal times for tasks based on user habits, calendar availability, and external factors.

  Analyze the following information to suggest the best time for the task:

  Task Description: {{{taskDescription}}}
  User Habits: {{{userHabits}}}
  Calendar Availability: {{{calendarAvailability}}}
  External Factors: {{{externalFactors}}}

  Consider all these factors and suggest the optimal time and the reasoning behind it.
  The suggested time should be in a human-readable format.
`,
});

const aiSmartSchedulingFlow = ai.defineFlow(
  {
    name: 'aiSmartSchedulingFlow',
    inputSchema: AISmartSchedulingInputSchema,
    outputSchema: AISmartSchedulingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
