# Story Chord

Turn your stories into beautiful music with AI-powered song generation.

## Features

- 🎵 Generate custom songs from personal stories
- ✍️ AI-powered lyrics creation
- 🎼 Multiple musical styles and moods
- 🎨 Beautiful, responsive UI
- 🌙 Dark/Light mode support
- 📱 Mobile-friendly design
- 🔌 RESTful API endpoints for integration
- 💳 **Integrated Stripe payment processing**
- 🛒 **Secure checkout and purchase management**
- 📊 **Purchase status tracking**

## API Endpoints

The application provides several API endpoints for song generation and payment processing:

### Song Generation APIs
- `POST /api/v1/assist-story` - Generate story content from user queries
- `POST /api/v1/assist-style` - Determine musical style from story content
- `POST /api/v1/generate-lyrics` - Create lyrics based on story and style
- `POST /api/v1/generate-song` - Generate audio songs from lyrics and style
- `GET /api/v1/check-progress` - Check song generation progress

### Payment APIs
- `POST /api/v1/stripe/checkout` - Create Stripe checkout session for song purchase
- `GET /api/v1/stripe/status` - Check purchase status for a specific song
- `GET /api/v1/stripe/success` - Handle successful payment completion

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide Icons
- **Package Manager**: pnpm
- **Payment Processing**: Stripe API
- **State Management**: Cookie-based purchase tracking

## Getting Started

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Configure environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Add your API keys:
   ```bash
   OPENAI_API_KEY=your_openai_api_key
   TOPMEDIA_API_KEY=your_topmedia_api_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Run development server**
   ```bash
   pnpm dev
   ```

4. **Build for production**
   ```bash
   pnpm build
   ```

5. **Start production server**
   ```bash
   pnpm start
   ```

## Payment Integration

Story Chord includes a complete Stripe payment system:

- **Secure Checkout**: Stripe-hosted checkout pages for secure payment processing
- **Purchase Tracking**: Cookie-based system to track purchased songs
- **Status Verification**: Real-time purchase status checking
- **Success Handling**: Automatic redirects and purchase confirmation

### Payment Flow
1. User generates a song using the AI APIs
2. User initiates purchase via checkout endpoint
3. Stripe handles payment processing securely
4. Purchase status is tracked and stored
5. User gains access to full song features

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

### Payment Testing

For payment testing, use Stripe's test mode:
- Test card numbers: 4242 4242 4242 4242 (Visa)
- Test mode automatically enabled in development
- No real charges will be processed

## License

Private project - All rights reserved.
