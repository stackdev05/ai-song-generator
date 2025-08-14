import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Types for request and response
interface GenerateSongRequest {
  lyrics: string;
  title: string;
  style: string;
  singing_voice: string;
}

interface GenerateSongResponse {
  songs: Array<{
    song_id: string;
    status: string;
    title: string;
    audio?: string;
    image?: string;
    lyric: string;
    tags?: string;
    audio_duration?: number;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateSongRequest = await request.json();
    
    // Validate required fields
    if (!body.title || body.title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!body.lyrics || body.lyrics.trim().length === 0) {
      return NextResponse.json({ error: 'Lyrics are required' }, { status: 400 });
    }

    if (!body.style || body.style.trim().length === 0) {
      return NextResponse.json({ error: 'Style is required' }, { status: 400 });
    }

    if (!body.singing_voice || body.singing_voice.trim().length === 0) {
      return NextResponse.json({ error: 'Singing voice is required' }, { status: 400 });
    }

    // Get TopMediaAI API key from environment
    const topMediaApiKey = process.env.TOPMEDIA_API_KEY;
    if (!topMediaApiKey) {
      return NextResponse.json({ error: 'TopMediaAI API key not configured' }, { status: 500 });
    }

    // Call TopMediaAI API to generate song
    const response = await axios.post(
      'https://api.topmediai.com/v2/submit',
      {
        lyrics: body.lyrics,
        title: body.title,
        instrumental: 0,
        model_version: 'v4.0',
        continue_at: 1,
        continue_song_id: '',
        is_auto: 0,
        prompt: `style: ${body.style}\nsinging voice: ${body.singing_voice}`
      },
      {
        headers: {
          'x-api-key': topMediaApiKey
        }
      }
    );

    if (response.data.status !== 200) {
      throw new Error(response.data.message || 'Song generation failed');
    }

    console.log(response.data);

    // Return the songs array from the response
    return NextResponse.json<GenerateSongResponse>({
      songs: response.data.data
    });

  } catch (error) {
    console.error('Error in generate-song API:', error);
    
    // Handle specific API errors
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return NextResponse.json({ error: 'Invalid TopMediaAI API key' }, { status: 401 });
      }
      
      if (error.response?.status === 429) {
        return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
      }

      if (error.response?.status === 422) {
        return NextResponse.json({ error: `Invalid request: ${error.response.data?.message || 'Bad request'}` }, { status: 422 });
      }
      
      if (error.response?.status === 400) {
        return NextResponse.json({ error: `Invalid request: ${error.response.data?.message || 'Bad request'}` }, { status: 400 });
      }
    }
    
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}
