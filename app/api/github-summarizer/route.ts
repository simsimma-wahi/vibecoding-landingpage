import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS, ERROR_MESSAGES } from "@/lib/constants";
import { validateApiKey, extractApiKey } from "@/lib/utils/auth";
import { summarizeReadmeWithLLM } from "@/lib/utils/langchain-summarizer";

interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  topics: string[];
  license: {
    name: string;
  } | null;
  default_branch: string;
  size: number;
  watchers_count: number;
}

interface GitHubReadme {
  content: string;
  encoding: string;
}

/**
 * Extracts owner and repo from GitHub URL
 */
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    
    if (pathParts.length >= 2 && urlObj.hostname.includes("github.com")) {
      return {
        owner: pathParts[0],
        repo: pathParts[1],
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Fetches repository data from GitHub API
 */
async function fetchRepoData(owner: string, repo: string): Promise<GitHubRepo> {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "GitHub-Summarizer",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Repository not found");
    }
    if (response.status === 403) {
      throw new Error("GitHub API rate limit exceeded. Please try again later.");
    }
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetches README content from GitHub
 */
async function fetchReadme(owner: string, repo: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "GitHub-Summarizer",
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data: GitHubReadme = await response.json();
    // Decode base64 content
    const content = Buffer.from(data.content, "base64").toString("utf-8");
    return content;
  } catch {
    return null;
  }
}

/**
 * Generates a summary of the repository
 */
function generateSummary(repo: GitHubRepo, readme: string | null): string {
  const summaryParts: string[] = [];

  // Basic info
  summaryParts.push(`# ${repo.full_name}`);
  summaryParts.push("");

  if (repo.description) {
    summaryParts.push(`**Description:** ${repo.description}`);
    summaryParts.push("");
  }

  // Key metrics
  summaryParts.push("## Key Metrics");
  summaryParts.push(`- ⭐ **Stars:** ${repo.stargazers_count.toLocaleString()}`);
  summaryParts.push(`- 🍴 **Forks:** ${repo.forks_count.toLocaleString()}`);
  summaryParts.push(`- 👀 **Watchers:** ${repo.watchers_count.toLocaleString()}`);
  summaryParts.push(`- 🐛 **Open Issues:** ${repo.open_issues_count.toLocaleString()}`);
  summaryParts.push("");

  // Technical details
  summaryParts.push("## Technical Details");
  if (repo.language) {
    summaryParts.push(`- **Primary Language:** ${repo.language}`);
  }
  summaryParts.push(`- **Default Branch:** ${repo.default_branch}`);
  summaryParts.push(`- **Repository Size:** ${(repo.size / 1024).toFixed(2)} MB`);
  if (repo.license) {
    summaryParts.push(`- **License:** ${repo.license.name}`);
  }
  summaryParts.push("");

  // Dates
  summaryParts.push("## Timeline");
  summaryParts.push(`- **Created:** ${new Date(repo.created_at).toLocaleDateString()}`);
  summaryParts.push(`- **Last Updated:** ${new Date(repo.updated_at).toLocaleDateString()}`);
  summaryParts.push(`- **Last Pushed:** ${new Date(repo.pushed_at).toLocaleDateString()}`);
  summaryParts.push("");

  // Topics
  if (repo.topics && repo.topics.length > 0) {
    summaryParts.push("## Topics");
    summaryParts.push(repo.topics.map((topic) => `\`${topic}\``).join(" "));
    summaryParts.push("");
  }

  // Owner info
  summaryParts.push("## Owner");
  summaryParts.push(`- **Username:** ${repo.owner.login}`);
  summaryParts.push(`- **Avatar:** ${repo.owner.avatar_url}`);
  summaryParts.push("");

  // README excerpt
  if (readme) {
    summaryParts.push("## README Excerpt");
    // Get first 500 characters of README
    const readmeExcerpt = readme
      .replace(/[#*`]/g, "")
      .replace(/\n+/g, " ")
      .trim()
      .substring(0, 500);
    summaryParts.push(readmeExcerpt + (readme.length > 500 ? "..." : ""));
  }

  return summaryParts.join("\n");
}

/**
 * POST - Summarize a GitHub repository
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Extract and validate API key
    const apiKey = extractApiKey(request, body);
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required. Provide it in Authorization header (Bearer <key>), X-API-Key header, or in request body as 'apiKey'." },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const isValidKey = await validateApiKey(apiKey);
    if (!isValidKey) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const { githubUrl } = body;

    if (!githubUrl || typeof githubUrl !== "string" || githubUrl.trim().length === 0) {
      return NextResponse.json(
        { error: "githubUrl is required" },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Parse GitHub URL
    const parsed = parseGitHubUrl(githubUrl.trim());
    if (!parsed) {
      return NextResponse.json(
        { error: "Invalid GitHub URL. Please provide a valid GitHub repository URL." },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const { owner, repo } = parsed;

    // Fetch repository data and README in parallel
    const [repoData, readme] = await Promise.all([
      fetchRepoData(owner, repo),
      fetchReadme(owner, repo),
    ]);

    // Generate basic summary
    const basicSummary = generateSummary(repoData, readme);

    // Generate LLM-powered summary if README exists
    let llmSummary = null;
    let llmError = null;
    if (readme) {
      try {
        // Debug: Check if environment variable is available
        console.log("=== ENVIRONMENT VARIABLE DEBUG ===");
        console.log("OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY);
        console.log("OPENAI_API_KEY length:", process.env.OPENAI_API_KEY?.length || 0);
        console.log("All env vars with 'OPENAI':", Object.keys(process.env).filter(k => k.includes('OPENAI')));
        console.log("All env vars (first 20):", Object.keys(process.env).slice(0, 20));
        console.log("NODE_ENV:", process.env.NODE_ENV);
        console.log("VERCEL:", process.env.VERCEL);
        console.log("===================================");
        
        // Try to access the key directly and log first few chars for debugging
        const key = process.env.OPENAI_API_KEY;
        if (key) {
          console.log("Key starts with:", key.substring(0, 10) + "...");
        }
        
        console.log("Starting LLM summarization...");
        console.log("README length:", readme.length);
        llmSummary = await summarizeReadmeWithLLM(readme);
        console.log("LLM summarization successful:", !!llmSummary);
      } catch (error) {
        console.error("Error generating LLM summary:", error);
        console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
        llmError = error instanceof Error ? error.message : "Unknown error";
        // Continue without LLM summary if it fails
      }
    } else {
      console.log("No README content available for LLM summarization");
    }

    return NextResponse.json({
      success: true,
      summary: basicSummary,
      llmSummary: llmSummary || null,
      llmError: llmError || null,
      repository: {
        name: repoData.full_name,
        description: repoData.description,
        url: githubUrl,
        language: repoData.language,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        openIssues: repoData.open_issues_count,
        createdAt: repoData.created_at,
        updatedAt: repoData.updated_at,
        topics: repoData.topics,
        license: repoData.license?.name || null,
      },
      readme: readme || null,
    });
  } catch (error: any) {
    console.error("Error summarizing GitHub repository:", error);
    
    const errorMessage = error?.message || "Failed to summarize GitHub repository";
    const statusCode = errorMessage.includes("not found")
      ? HTTP_STATUS.NOT_FOUND
      : errorMessage.includes("rate limit")
      ? HTTP_STATUS.FORBIDDEN
      : HTTP_STATUS.INTERNAL_SERVER_ERROR;

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
