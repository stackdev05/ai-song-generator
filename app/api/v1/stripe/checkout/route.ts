import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

interface CheckoutRequestBody {
  song_id: string
  title?: string
  price_cents: number
  currency?: string
  duration_millis?: number
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequestBody = await request.json()

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      return NextResponse.json({ error: 'Stripe secret key not configured' }, { status: 500 })
    }

    const { song_id, title, price_cents, currency, duration_millis } = body

    if (!song_id || typeof song_id !== 'string') {
      return NextResponse.json({ error: 'song_id is required' }, { status: 400 })
    }
    if (!price_cents || typeof price_cents !== 'number' || price_cents <= 0) {
      return NextResponse.json({ error: 'price_cents must be a positive number' }, { status: 400 })
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20',
    })

    const originHeader = request.headers.get('origin') || request.headers.get('referer')
    const fallbackHost = process.env.NEXT_PUBLIC_APP_URL
    const origin = originHeader?.replace(/\/$/, '') || fallbackHost || ''

    if (!origin) {
      return NextResponse.json({ error: 'Unable to determine app base URL' }, { status: 500 })
    }

    // Format duration for display
    const formatDuration = (milliseconds: number) => {
      const totalSeconds = Math.floor(milliseconds / 1000)
      const mins = Math.floor(totalSeconds / 60)
      const secs = totalSeconds % 60
      return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    const durationText = duration_millis ? ` (${formatDuration(duration_millis)})` : ''
    const songTitle = title || `Song ${song_id}`
    const fullTitle = `${songTitle}${durationText}`

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      success_url: `${origin}/api/v1/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/song/${encodeURIComponent(song_id)}?canceled=1`,
      metadata: {
        song_id,
      },
      payment_intent_data: {
        metadata: { song_id },
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: (currency || 'usd').toLowerCase(),
            unit_amount: price_cents,
            product_data: {
              name: fullTitle,
              description: `Buy this song to unlock full listening, download MP3 and lyrics, and share with others.`,
            },
          },
        },
      ],
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}


