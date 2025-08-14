import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Types for request and response
interface GenerateLyricsRequest {
  query: string;
}

interface GenerateLyricsResponse {
  lyrics: string;
  title?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateLyricsRequest = await request.json();
    
    // Validate required fields
    if (!body.query || body.query.trim().length === 0) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Get TopMediaAI API key from environment
    const topMediaApiKey = process.env.TOPMEDIA_API_KEY;
    if (!topMediaApiKey) {
      return NextResponse.json({ error: 'TopMediaAI API key not configured' }, { status: 500 });
    }

    // Pass the query directly to the prompt
    const prompt = body.query;

    // Call TopMediaAI Lyrics API
    const response = await axios.get(
      'https://aimusic-api.topmediai.com/v2/prompt-to-lyrics',
      {
        params: {
          prompt: prompt
        },
        headers: {
          'x-api-key': topMediaApiKey
        }
      }
    );

    if (response.data.status !== 200) {
      throw new Error(response.data.message);
    }

    // Extract lyrics and title from the response structure
    const lyrics = response.data?.data?.lyrics;
    const title = response.data?.data?.title;
    
    if (!lyrics) {
      throw new Error('No lyrics generated from TopMediaAI');
    }

    return NextResponse.json<GenerateLyricsResponse>({
      lyrics: lyrics,
      title: title
    });

  } catch (error) {
    console.error('Error in generate-lyrics API:', error);
    
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}
