import { NextRequest, NextResponse } from 'next/server';
import { getEdenClient } from '@/lib/eden-api';

/**
 * GET /api/creations
 * Fetches Solienne's creations from Eden API
 * Query params: limit (optional), cursor (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit')
      ? parseInt(searchParams.get('limit')!)
      : 20;
    const cursor = searchParams.get('cursor') || undefined;

    const agentId = process.env.SOLIENNE_AGENT_ID;

    if (!agentId) {
      return NextResponse.json(
        { error: 'SOLIENNE_AGENT_ID not configured' },
        { status: 500 }
      );
    }

    const edenClient = getEdenClient();
    const creations = await edenClient.getAgentCreations(agentId, limit, cursor);

    return NextResponse.json(creations);
  } catch (error) {
    console.error('Error fetching creations:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch creations' },
      { status: 500 }
    );
  }
}
