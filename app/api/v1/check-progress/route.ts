import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Types for request and response
interface CheckProgressRequest {
  song_id: string;
}

interface CheckProgressResponse {
  song_id: string;
  status: string;
  title: string;
  audio: string;
  image: string;
  lyric: string;
  tags: string;
  audio_duration: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const songId = searchParams.get('song_id');
    
    if (!songId) {
      return NextResponse.json({ error: 'song_id is required as a query parameter' }, { status: 400 });
    }

    // Get TopMediaAI API key from environment
    const topMediaApiKey = process.env.TOPMEDIA_API_KEY;
    if (!topMediaApiKey) {
      return NextResponse.json({ error: 'TopMediaAI API key not configured' }, { status: 500 });
    }

    // Call TopMediaAI API to check song status
    const response = await axios.get(
      `https://api.topmediai.com/v2/query?song_id=${songId}`,
      {
        headers: {
          'x-api-key': topMediaApiKey
        },
        timeout: 5000
      }
    );

    if (response.data.status !== 200) {
      throw new Error(response.data.message || 'Failed to check song status');
    }

    // Get the first song from the response (should be the one we're checking)
    const songData = response.data.data[0];
    if (!songData) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    // Return the song data directly
    return NextResponse.json<CheckProgressResponse>(songData);

  } catch (error) {
    console.error('Error in check-progress API:', error);
    
    // Handle specific API errors
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return NextResponse.json({ error: 'Invalid TopMediaAI API key' }, { status: 401 });
      }
      
      if (error.response?.status === 429) {
        return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
      }
      
      if (error.response?.status === 400) {
        return NextResponse.json({ error: `Invalid request: ${error.response.data?.message || 'Bad request'}` }, { status: 400 });
      }
    }
    
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}
