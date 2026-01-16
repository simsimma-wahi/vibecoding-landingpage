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
export function createSummarizerChain(openAIApiKey: string): Runnable<{ readme: string }, SummaryOutput> {
  if (!openAIApiKey) {
    throw new Error("OpenAI API key is required.");
  }

  // Initialize the LLM
  const model = new ChatOpenAI({
    modelName: "gpt-4o-mini", // You can change to "gpt-4" or "gpt-3.5-turbo"
    temperature: 0, // Set to 0 for more predictable, deterministic outputs
    apiKey: openAIApiKey, // Use 'apiKey' parameter name for LangChain compatibility
  });

  // Bind structured output to the model using withStructuredOutput
  // This internally uses bind() to attach the structured output schema
  const modelWithStructuredOutput = model.withStructuredOutput(summarySchema);

  // Create the prompt template
  // Note: withStructuredOutput automatically handles format instructions
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are an expert at analyzing GitHub repositories.",
    ],
    [
      "human",
      `Summarize this repository from the readme file content:

{readme}

Provide your response with a summary and a cool fact about the repository.`,
    ],
  ]);

  // Create and return the chain with the model that has structured output bound
  return prompt.pipe(modelWithStructuredOutput);
}
