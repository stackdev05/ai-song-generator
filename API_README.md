# AI Song Generator API Documentation

This document describes the backend API routes for the AI Song Generator platform built with Next.js.

## Base URL
```
/api/v1/
```

## Authentication
All API routes require proper API keys to be configured in environment variables:
- `OPENAI_API_KEY` - For story, lyrics, and style generation
- `TOPMEDIA_API_KEY` - For song generation and progress checking

## API Endpoints

### 1. Assist Story API

**Route:** `POST /api/v1/assist-story`

Generates an imaginative, detailed story based on a user query that can be used as a seed for lyric generation.

**Request Body:**
```json
{
  "query": "A magical forest adventure"
}
```

**Response:**
```json
{
  "story": "Deep in the heart of the Enchanted Woods..."
}
```

**Parameters:**
- `query` (required): The user's story prompt

**Note:** The response is limited to under 250 characters for concise, impactful storytelling.

---

### 2. Generate Lyrics API

**Route:** `POST /api/v1/generate-lyrics`

Creates song lyrics based on a query using TopMediaAI's lyrics generation service.

**Request Body:**
```json
{
  "query": "Deep in the heart of the Enchanted Woods..."
}
```

**Response:**
```json
{
  "lyrics": "[Verse]\nI sat in the shadow of yesterday's rain...\n[Chorus]\nYou came\nYou came...",
  "title": "New World Rising"
}
```

**Parameters:**
- `query` (required): The query/prompt to base lyrics on

**Note:** Uses TopMediaAI's lyrics generation service for high-quality, structured song lyrics. The query is passed directly to the service without any additional formatting or instructions. The API may also return a suggested title for the song.

---

### 3. Assist Style API

**Route:** `POST /api/v1/assist-style`

Generates a detailed song style description to guide music generation.

**Request Body:**
```json
{
  "query": "A dreamy, atmospheric song about stargazing"
}
```

**Response:**
```json
{
  "style": "Gentle piano arpeggios intertwine with warm cello tones, evoking a reflective, tender mood—soft, intimate, and quietly hopeful, in a flowing A major."
}
```

**Parameters:**
- `query` (required): Description of the desired style

**Note:** The response is a natural language style description limited to under 160 characters, using predefined musical elements from the system.

---

### 4. Generate Song API

**Route:** `POST /api/v1/generate-song`

Initiates song generation using TopMediaAI's v2/submit endpoint, combining lyrics and optional style information.

**Request Body:**
```json
{
  "lyrics": "[Verse] I was a shadow Lost in the haze...\n[Chorus] But you came like the morning sun...",
  "title": "Rise Again",
  "style": "Gentle piano arpeggios intertwine with warm cello tones...",
  "singing_voice": "Female, warm and melodic"
}
```

**Response:**
```json
{
  "songs": [
    {
      "song_id": "a0b04f16-8d85-42e3-95f6-1bef6b047cca",
      "status": "RUNNING",
      "title": "Rise Again",
      "audio": "https://aimusic-api.topmediai.com/api/audio/...",
      "image": "https://files.topmediai.com/aimusic/...",
      "lyric": "[Verse] I was a shadow Lost in the haze...",
      "tags": "Gentle piano arpeggios intertwine with warm cello tones...",
      "audio_duration": -1
    }
  ]
}
```

**Parameters:**
- `lyrics` (required): Complete lyrics text
- `title` (required): Song title
- `style` (required): Style description to guide music generation
- `singing_voice` (required): Description of the desired singing voice characteristics (e.g., "Female, warm and melodic", "Male, deep and powerful", "Soft and gentle", "Energetic and upbeat")

**Note:** Uses TopMediaAI's v2/submit endpoint. The API generates multiple song variations and returns song IDs for progress tracking. The `style` and `singing_voice` parameters are combined into a single prompt: `style: {style}\nsinging voice: {singing_voice}`.

---

### 5. Check Progress API

**Route:** `GET /api/v1/check-progress?song_id={songId}`

Checks the status of a song generation task using the song ID returned from the Generate Song API.

**Request:**
```
GET /api/v1/check-progress?song_id=6fd29459-a02d-4ed5-af00-4dd9cbde6916
```

**Response (Running):**
```json
{
  "song_id": "6fd29459-a02d-4ed5-af00-4dd9cbde6916",
  "status": "RUNNING",
  "title": "Rise Again",
  "audio": "https://aimusic-api.topmediai.com/api/audio/6fd29459-a02d-4ed5-af00-4dd9cbde6916",
  "image": "https://files.topmediai.com/aimusic/9897570/d85fd02b-5a6f-48f9-a2ee-85b6c4ae9303-image.png",
  "lyric": "[Verse] I was a shadow Lost in the haze...",
  "tags": "Gentle piano arpeggios intertwine with warm cello tones...",
  "audio_duration": -1
}
```

**Response (Finished):**
```json
{
  "song_id": "6fd29459-a02d-4ed5-af00-4dd9cbde6916",
  "status": "FINISHED",
  "title": "Rise Again",
  "audio": "https://files.topmediai.com/aimusic/api/17898605/6fd29459-a02d-4ed5-af00-4dd9cbde6916-audio.mp3",
  "image": "https://files.topmediai.com/aimusic/9897570/d85fd02b-5a6f-48f9-a2ee-85b6c4ae9303-image.png",
  "lyric": "[Verse] I was a shadow Lost in the haze...",
  "tags": "Gentle piano arpeggios intertwine with warm cello tones...",
  "audio_duration": 180160
}
```

**Status Values:**
- `RUNNING`: Song is currently being generated
- `FINISHED`: Song generation completed successfully
- `FAILED`: Song generation failed with an error

**Parameters:**
- `song_id` (required): The unique song identifier from TopMediaAI

**Note:** Uses TopMediaAI's v2/query endpoint. Returns the complete song data including audio URL when generation is complete.

---

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": "Error description"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `400`: Bad Request (missing or invalid parameters)
- `401`: Unauthorized (invalid API key)
- `429`: Rate Limit Exceeded
- `500`: Internal Server Error

---

## Rate Limiting

The API includes basic rate limiting to prevent abuse:
- Default: 100 requests per minute per IP address
- Configurable via environment variables

---

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Required
OPENAI_API_KEY=your_openai_api_key_here
TOPMEDIA_API_KEY=your_topmedia_api_key_here

# Optional
MAX_REQUESTS_PER_MINUTE=100
MAX_REQUESTS_PER_HOUR=1000
NODE_ENV=development
```

---

## Usage Examples

### Complete Workflow

1. **Generate a story:**
```bash
curl -X POST /api/v1/assist-story \
  -H "Content-Type: application/json" \
  -d '{"query": "A magical forest adventure"}'
```

2. **Generate lyrics from the query:**
```bash
curl -X POST /api/v1/generate-lyrics \
  -H "Content-Type: application/json" \
  -d '{"query": "Deep in the heart of the Enchanted Woods..."}'
```

3. **Generate song style:**
```bash
curl -X POST /api/v1/assist-style \
  -H "Content-Type: application/json" \
  -d '{"query": "A dreamy, atmospheric song about stargazing"}'
```

4. **Start song generation:**
```bash
curl -X POST /api/v1/generate-song \
  -H "Content-Type: application/json" \
  -d '{"lyrics": "[Verse] I was a shadow...", "title": "Rise Again", "style": "Gentle piano arpeggios...", "singing_voice": "Female, warm and melodic"}'
```

5. **Check progress:**
```bash
curl /api/v1/check-progress?song_id=6fd29459-a02d-4ed5-af00-4dd9cbde6916
```

---

## Testing

### Automated API Testing

The project includes a comprehensive test script to verify all API endpoints:

```bash
node scripts/test-api.js
```

**What the test script does:**
- Tests all 5 API endpoints in sequence
- Follows the complete song generation workflow
- Validates request/response formats
- Displays detailed error information (API errors only)
- Ensures server connectivity

**Prerequisites:**
- Development server must be running (`pnpm dev`)
- Server should be accessible on `http://localhost:3000`
- All required environment variables must be configured

**Test Flow:**
1. Assist Story API → Generate story content
2. Generate Lyrics API → Create lyrics from story
3. Assist Style API → Determine musical style
4. Generate Song API → Start song generation
5. Check Progress API → Monitor generation status

---

## Development

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- OpenAI API key
- TopMediaAI API key

### Setup
1. Clone the repository
2. Install dependencies: `pnpm install`
3. Copy `env.example` to `.env.local` and fill in your API keys
4. Run the development server: `pnpm dev`

### Testing
The API routes can be tested using:
- **Automated testing**: `node scripts/test-api.js`
- Postman or similar API testing tools
- curl commands
- Frontend application integration

---

## Architecture Notes

- **TypeScript**: All API routes use TypeScript for type safety
- **Error Handling**: Comprehensive error handling with meaningful messages
- **Validation**: Input validation and sanitization
- **Rate Limiting**: Basic rate limiting implementation
- **Logging**: Request logging for debugging and monitoring
- **Scalability**: Designed for easy scaling and feature additions

---

## Future Enhancements

- Database integration for storing generated songs
- User authentication and song history
- Advanced rate limiting and analytics
- Webhook support for real-time updates
- Batch processing for multiple songs
- Export options (WAV, FLAC, etc.)
- Collaboration features
