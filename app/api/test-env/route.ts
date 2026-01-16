import { NextRequest, NextResponse } from "next/server";

/**
 * GET - Test endpoint to check if OPENAI_API_KEY is accessible
 * This helps debug environment variable issues in Vercel
 */
export async function GET(request: NextRequest) {
  const openaiKey = process.env.OPENAI_API_KEY;
  const allEnvKeys = Object.keys(process.env);
  const openaiRelatedKeys = allEnvKeys.filter(k => 
    k.includes('OPENAI') || k.includes('API') || k.includes('KEY')
  );

  return NextResponse.json({
    openaiKeyExists: !!openaiKey,
    openaiKeyLength: openaiKey?.length || 0,
    openaiKeyPrefix: openaiKey ? openaiKey.substring(0, 10) + '...' : 'N/A',
    nodeEnv: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
    allOpenaiRelatedKeys: openaiRelatedKeys,
    totalEnvVars: allEnvKeys.length,
    // Show first 10 env var names (not values) for debugging
    sampleEnvVarNames: allEnvKeys.slice(0, 10),
  });
}
