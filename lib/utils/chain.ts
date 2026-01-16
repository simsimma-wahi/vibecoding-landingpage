import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Runnable } from "@langchain/core/runnables";
import { z } from "zod";

/**
 * Schema for the structured output
 */
export const summarySchema = z.object({
  summary: z
    .string()
    .min(1, "Summary must not be empty")
    .describe("A comprehensive summary of the repository based on the README content"),
  coolFact: z
    .string()
    .min(1, "Cool fact must not be empty")
    .describe("An interesting or cool fact about the repository"),
}).strict();

export type SummaryOutput = z.infer<typeof summarySchema>;

/**
 * Creates the LangChain chain for summarizing repository README
 */
export function createSummarizerChain(openAIApiKeyOverride?: string): Runnable<{ readme: string }, SummaryOutput> {
  // Get OpenAI API key from parameter override, then environment
  // In Next.js/Vercel, server-side env vars are available via process.env
  // Try multiple possible names in case of typos or different conventions
  const openAIApiKey = 
    openAIApiKeyOverride ||
    process.env.OPENAI_API_KEY || 
    process.env.NEXT_PUBLIC_OPENAI_API_KEY ||
    process.env.OPENAI_KEY ||
    process.env.OPENAIKEY;

  if (!openAIApiKey) {
    // Debug: Log available environment variables (without exposing sensitive data)
    const envKeys = Object.keys(process.env).filter(k => 
      k.includes('OPENAI') || k.includes('API') || k.includes('KEY')
    );
    console.error("OPENAI_API_KEY not found in environment variables");
    console.error("Available related env vars:", envKeys);
    console.error("NODE_ENV:", process.env.NODE_ENV);
    console.error("VERCEL:", process.env.VERCEL);
    console.error("Total env vars:", Object.keys(process.env).length);
    throw new Error(
      "OPENAI_API_KEY environment variable is required. Please set it in your Vercel environment variables (for production) or .env.local file (for local development). Visit /api/test-env to debug."
    );
  }

  // Initialize the LLM with strict structured output
  const model = new ChatOpenAI({
    modelName: "gpt-4o-mini", // You can change to "gpt-4" or "gpt-3.5-turbo"
    temperature: 0, // Set to 0 for more predictable, deterministic outputs
    openAIApiKey: openAIApiKey,
  }).withStructuredOutput(summarySchema);

  // Create the prompt template with explicit schema instructions
  // Note: Double curly braces {{}} escape template variables in LangChain
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are an expert at analyzing GitHub repositories. You must respond with a JSON object that strictly follows this schema:
{{
  "summary": "A comprehensive summary of the repository based on the README content (required, non-empty string)",
  "coolFact": "An interesting or cool fact about the repository (required, non-empty string)"
}}

Do not include any additional fields. Both fields are required and must be non-empty strings.`,
    ],
    [
      "human",
      `Summarize this repository from the readme file content:

{readme}

Respond with a JSON object containing "summary" and "coolFact" fields only.`,
    ],
  ]);

  // Create and return the chain
  return prompt.pipe(model);
}
