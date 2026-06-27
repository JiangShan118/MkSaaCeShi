'use server';

import { generateText } from 'ai';
import { deepseek } from '@ai-sdk/deepseek';
import { openai } from '@ai-sdk/openai';
import { actionClient } from '@/lib/safe-action';
import { z } from 'zod';

const taglineSchema = z.object({
  product: z
    .string()
    .min(10, 'Please describe your product in at least 10 characters.')
    .max(400, 'Description is too long, please keep it under 400 characters.'),
  model: z.enum(['deepseek', 'openai']).default('deepseek'),
});

type TaglineResult = {
  taglines: string[];
  model: string;
};

function parseTaglines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(\d+[.)]|[-*])\s*/, '').trim())
    .map((line) => line.replace(/^[""'`]|[""'`]$/g, '').trim())
    .filter((line) => line.length > 0 && line.length <= 120)
    .slice(0, 5);
}

export const generateTaglinesAction = actionClient
  .inputSchema(taglineSchema)
  .action(async ({ parsedInput: { product, model } }) => {
    const apiKey = getApiKey(model);
    if (!apiKey) {
      return {
        success: false,
        error: `Missing API key for ${model}. Please check your environment configuration.`,
      };
    }

    try {
      const result = await generateText({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        model: getModel(model) as any,
        system:
          'You are a creative copywriter for SaaS products. Write exactly 5 short, punchy taglines (max 8 words each) for the product the user describes. Return them as a numbered list (1. ... 2. ...). Do not add any introduction, explanation, or trailing notes — only the 5 lines.',
        prompt: `Product description: ${product}`,
        maxOutputTokens: 300,
        temperature: 0.85,
      });

      const taglines = parseTaglines(result.text);
      if (taglines.length === 0) {
        return {
          success: false,
          error: 'Could not parse taglines from model response.',
        };
      }

      return {
        success: true,
        data: {
          taglines,
          model,
        } as TaglineResult,
      };
    } catch (error) {
      console.error('Tagline generation error:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate taglines. Please try again.',
      };
    }
  });

function getModel(modelName: string) {
  switch (modelName) {
    case 'openai':
      return openai('gpt-5.5');
    default:
      return deepseek('deepseek-v4-flash');
  }
}

function getApiKey(model: string): string | undefined {
  switch (model) {
    case 'openai':
      return process.env.OPENAI_API_KEY;
    case 'deepseek':
      return process.env.DEEPSEEK_API_KEY;
  }
}
