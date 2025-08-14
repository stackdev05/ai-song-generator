import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Types for request and response
interface AssistStoryRequest {
  query: string;
}

interface AssistStoryResponse {
  story: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AssistStoryRequest = await request.json();
    
    // Validate required fields
    if (!body.query || body.query.trim().length === 0) {
      return NextResponse.json({
        error: 'Query is required'
      }, { status: 400 });
    }

    // Get OpenAI API key from environment
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json({
        error: 'OpenAI API key not configured'
      }, { status: 500 });
    }

    // Prepare the prompt for story generation
    const prompt = `Create an imaginative, detailed story based on this query: "${body.query}"
    
    The story should be:
    - Engaging and creative
    - Rich in descriptive language
    - Suitable for inspiring song lyrics
    - Include emotional depth and character development
    - Under 250 characters total
    
    Please provide only the story content without any additional commentary. Keep it concise and impactful.`;

    // Call OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4.1',
        messages: [
          {
            role: 'system',
            content: 'You are a creative storyteller who creates engaging, imaginative stories that can inspire song lyrics. Focus on emotional depth, vivid descriptions, and compelling narratives.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.8
      },
      {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const story = response.data.choices[0]?.message?.content?.trim();
    
    if (!story) {
      throw new Error('No story generated from OpenAI');
    }

    return NextResponse.json<AssistStoryResponse>({
      story
    });

  } catch (error) {
    console.error('Error in assist-story API:', error);
    
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}


