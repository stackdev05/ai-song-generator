# AI Song Generator

This is an AI-powered application that transforms your personal stories into beautiful, personalized songs with custom lyrics and melodies.

## Features

- 🎵 Generate custom songs from personal stories
- ✍️ AI-powered lyrics creation
- 🎼 Multiple musical styles and moods
- 🎨 Beautiful, responsive UI
- 🌙 Dark/Light mode support
- 📱 Mobile-friendly design
- 🔌 RESTful API endpoints for integration

## API Endpoints

The application provides several API endpoints for song generation:

- `POST /api/v1/assist-story` - Generate story content from user queries
- `POST /api/v1/assist-style` - Determine musical style from story content
- `POST /api/v1/generate-lyrics` - Create lyrics based on story and style
- `POST /api/v1/generate-song` - Generate audio songs from lyrics and style
- `GET /api/v1/check-progress` - Check song generation progress

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide Icons
- **Package Manager**: pnpm

## Getting Started

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Run development server**
   ```bash
   pnpm dev
   ```

3. **Build for production**
   ```bash
   pnpm build
   ```

4. **Start production server**
   ```bash
   pnpm start
   ```

## Testing

### API Testing

Test all API endpoints using the provided test script:

```bash
node scripts/test-api.js
```

The test script will:
- Verify all API endpoints are working
- Test the complete song generation flow
- Display detailed responses and error information
- Ensure your development server is running on port 3000

**Note**: Make sure your development server is running (`pnpm dev`) before executing the test script.

## License

Private project - All rights reserved.
