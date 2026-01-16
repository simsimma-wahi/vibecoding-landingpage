import { z } from "zod";
import { createSummarizerChain, summarySchema, type SummaryOutput } from "./chain";

/**
 * Summarizes repository README using LangChain
 */
export async function summarizeReadmeWithLLM(
  readmeContent: string,
  openAIApiKeyOverride?: string
): Promise<SummaryOutput> {
  try {
    console.log("Creating summarizer chain...");
    // Create the chain (with optional API key override for Vercel env var issues)
    const chain = createSummarizerChain(openAIApiKeyOverride);
    console.log("Chain created successfully");

    // Limit README content to avoid token limits (keep first 8000 characters)
    const truncatedReadme = readmeContent.length > 8000 
      ? readmeContent.substring(0, 8000) + "\n\n[Content truncated due to length...]"
      : readmeContent;

    console.log("Invoking chain with README (length:", truncatedReadme.length, ")");
    // Invoke the chain with the README content
    const result = await chain.invoke({
      readme: truncatedReadme,
    });

    console.log("Chain invocation successful, validating result...");
    // Validate the result strictly against the schema
    const validatedResult = summarySchema.parse(result);
    console.log("Validation successful");

    return validatedResult;
  } catch (error) {
    console.error("Error in LangChain summarization:", error);
    console.error("Error type:", error?.constructor?.name);
    console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      throw new Error(
        `Schema validation failed: ${error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`
      );
    }
    
    throw new Error(`Failed to summarize README: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Re-export types for convenience
export type { SummaryOutput } from "./chain";
