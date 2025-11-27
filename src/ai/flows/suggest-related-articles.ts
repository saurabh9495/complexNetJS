'use server';

/**
 * @fileOverview Suggests related articles based on the content of the current article.
 *
 * - suggestRelatedArticles - A function that suggests related articles.
 * - SuggestRelatedArticlesInput - The input type for the suggestRelatedArticles function.
 * - SuggestRelatedArticlesOutput - The return type for the suggestRelatedArticles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelatedArticlesInputSchema = z.object({
  articleContent: z
    .string()
    .describe('The content of the current article.'),
  articleCategory: z.string().describe('The category of the current article.'),
});

export type SuggestRelatedArticlesInput = z.infer<
  typeof SuggestRelatedArticlesInputSchema
>;

const SuggestRelatedArticlesOutputSchema = z.array(z.string()).describe(
  'A list of titles of related articles.'
);

export type SuggestRelatedArticlesOutput = z.infer<
  typeof SuggestRelatedArticlesOutputSchema
>;

export async function suggestRelatedArticles(
  input: SuggestRelatedArticlesInput
): Promise<SuggestRelatedArticlesOutput> {
  return suggestRelatedArticlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelatedArticlesPrompt',
  input: {schema: SuggestRelatedArticlesInputSchema},
  output: {schema: SuggestRelatedArticlesOutputSchema},
  prompt: `You are a news aggregator. Given the content and category of an article, suggest related articles.

Article Content: {{{articleContent}}}
Article Category: {{{articleCategory}}}

Suggest 3 related articles. Return only the titles in an array format.
`,
});

const suggestRelatedArticlesFlow = ai.defineFlow(
  {
    name: 'suggestRelatedArticlesFlow',
    inputSchema: SuggestRelatedArticlesInputSchema,
    outputSchema: SuggestRelatedArticlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
