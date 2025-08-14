import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Types for request and response
interface AssistStyleRequest {
  query: string;
}

interface AssistStyleResponse {
  style: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AssistStyleRequest = await request.json();
    
    // Validate required fields
    if (!body.query || body.query.trim().length === 0) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Get OpenAI API key from environment
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    // Prepare the prompt for style generation
    const prompt = `Based on this query, create a short, natural language song style description:

Query: "${body.query}"

Choose from these predefined options and create a flowing, descriptive style:

GENRES: Pop, Rock, Hip Hop, Electronic, Jazz, Blues, Classical, Country, Folk, Soul, Funk, Reggae, Metal, Punk, R&B, Disco, Indie, Alternative, World Music, Latin, New Age, Experimental, Ambient, Post-Rock, EDM, Rap, Gospel, Orchestral, Psychedelic, Progressive, K-pop, Ballad, Dance, Synthwave, Vaporwave, Future Bass, Trap, House, Techno, Dubstep, Drum and Bass, Acid House, Cool Jazz, Bebop, Free Jazz, Swing Jazz, Blues Jazz, Country Blues, Chicago Blues, Baroque, Romantic, Modern Classical, Minimalism, Neoclassical, Opera, Alternative Country, Contemporary Folk, Traditional Folk, Celtic, African, Latin Jazz, Salsa, Samba, Bossa Nova, Reggae Rock, Ska, Funk Rock, New Wave, Post-Punk, Gothic Rock, Industrial Rock, Noise Rock, Dream Pop, Shoegaze, Post-Metal, Post-Hardcore, Emo, Math Rock, Atmospheric Black Metal, Symphonic Metal, Folk Metal, Viking Metal, Electronicore, Trap Metal, Post-Britpop, New Psychedelia, Space Rock, Art Rock, New Romanticism, Synthpop, Future Bass, Vaporwave, Retrowave, Electropop, Tropical House, Deep House, Tech House, Minimal Techno, Hard Techno, Industrial Techno, Liquid Drum and Bass, Neurofunk, Breakbeat, Big Beat, Trap (EDM), Future House, Post-Dubstep, Ambient Dubstep, Experimental Electronic, Hyperpop, 8-bit Music, Synthwave, J-pop, Cantonese, Phonk, Vallenato Viejo, costumbrista, Porros, Colombian Cumbia

MOODS: Cheerful, Sad, Passionate, Calm, Excited, Melancholic, Mysterious, Tense, Relaxed, Anxious, Angry, Gentle, Intense, Dreamy, Joyful, Depressed, Hopeful, Fearful, Humorous, Solemn, Energetic, Gloomy, Warm, Cold, Profound, Upbeat, Sorrowful, Comforting, Lonely, Nostalgic, Uplifting, Contemplative, Thrilling, Peaceful, Frenzied, Elegant, Rugged, Sweet, Moody, Exuberant, Worried, Content, Lost, Confident, Sensitive, Strong, Vulnerable, Enthusiastic, Indifferent, Sympathetic, Doubtful, Determined, Confused, Serene, Restless, Delightful, Heavy, Light, Stirring, Comfortable, Uneasy, Sacred, Secular, Transcendent, Simple, Elaborate, Sunny, Dark, Bright, Hazy, Clear, Bewildered, Cozy, Distant, Intimate, Majestic, Subtle, Overwhelming, Ethereal, Grounded, Radical, Conservative, Avant-garde, Modern, Futuristic

INSTRUMENTS: Piano, Guitar, Drums, Bass, Violin, Saxophone, Flute, Trumpet, Cello, Synthesizer, Ukulele, Harp, Accordion, Harmonica, Tuba, Trombone, French Horn, Recorder, Xylophone, Marimba, Glockenspiel, Vibraphone, Steel Drums, Conga, Bongo, Triangle, Tambourine, Maracas, Cymbals, Timpani, Cajon, Djembe, Sitar, Guzheng, Pipa, Erhu, Dizi, Sheng, Hulusi, Xun, Banjo, Mandolin, Clarinet, Oboe, Viola, Organ, Electric Guitar, Electric Bass, Electric Piano, MIDI Keyboard, Drum Machine, Sequencer, Mixer, Audio Interface

TEMPOS: Strong, Soft, Rhythmic, Jumping, Powerful, Fast, Slow, 60-80 BPM, 80-120 BPM, 120-160 BPM

KEYS: C major, G major, D major, A major, E major, B major, F# major, C# major, F major, Bb major, Eb major, Ab major, Db major, Gb major, Cb major, A minor, E minor, B minor, F# minor, C# minor, G# minor, D# minor, A# minor, D minor, G minor, C minor, F minor, Bb minor, Eb minor, Ab minor, Db minor, Gb minor, Cb minor

Create a flowing, descriptive style that reads naturally like: "Gentle piano arpeggios intertwine with warm cello tones, evoking a reflective, tender mood—soft, intimate, and quietly hopeful, in a flowing A major."

Keep it under 160 characters and make it sound natural and musical.`;

    // Call OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4.1',
        messages: [
          {
            role: 'system',
            content: 'You are a music producer and style consultant who creates flowing, natural language song style descriptions. Focus on creating evocative, musical descriptions that sound natural and inspiring.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.6
      },
      {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const styleText = response.data.choices[0]?.message?.content?.trim();
    
    if (!styleText) {
      throw new Error('No style description generated from OpenAI');
    }

    // Return the natural language style description directly
    return NextResponse.json<AssistStyleResponse>({
      style: styleText
    });

  } catch (error) {
    console.error('Error in assist-style API:', error);
    
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}


