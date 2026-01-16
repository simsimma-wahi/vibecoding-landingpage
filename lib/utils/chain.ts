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
export function createSummarizerChain(): Runnable<{ readme: string }, SummaryOutput> {
  // Get OpenAI API key from environment
  const openAIApiKey = process.env.OPENAI_API_KEY;

  if (!openAIApiKey) {
    throw new Error(
      "OPENAI_API_KEY environment variable is required. Please set it in your .env.local file."
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
