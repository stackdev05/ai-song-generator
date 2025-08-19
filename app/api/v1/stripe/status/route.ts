import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const songId = searchParams.get('song_id')
  if (!songId) {
    return NextResponse.json({ error: 'song_id is required' }, { status: 400 })
  }

  // Check cookie-based purchases first
  const cookie = request.cookies.get('purchases')?.value
  try {
    const parsed = cookie ? JSON.parse(cookie) : null
    const ids: string[] = Array.isArray(parsed?.purchasedSongIds) ? parsed.purchasedSongIds : []
    const purchased = ids.includes(songId)
    
    // If already purchased via cookie, return early
    if (purchased) {
      return NextResponse.json({ purchased: true })
    }
  } catch {
    // Continue to Stripe verification if cookie parsing fails
  }

  // If not purchased via cookie, check if session_id is provided for Stripe verification
  const sessionId = request.headers.get('X-Session-ID')
  if (sessionId) {
    try {
      const stripeSecretKey = process.env.STRIPE_SECRET_KEY
      if (!stripeSecretKey) {
        return NextResponse.json({ purchased: false })
      }

      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2024-06-20',
      })

      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['payment_intent'],
      })

      const paid = session.payment_status === 'paid'
      const sessionSongId = (session.metadata as any)?.song_id || (session.payment_intent as any)?.metadata?.song_id

      // Verify the session is for the correct song and payment is successful
      if (paid && sessionSongId === songId) {
        return NextResponse.json({ purchased: true })
      }
    } catch (error) {
      console.error('Error verifying Stripe session:', error)
    }
  }

  return NextResponse.json({ purchased: false })
}


