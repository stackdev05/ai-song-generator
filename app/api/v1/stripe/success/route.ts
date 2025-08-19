import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// We store purchases in a cookie-local store as there is no DB.
// Cookie value is a JSON object: { purchasedSongIds: string[] }
function readPurchasesCookie(request: NextRequest): Set<string> {
  const cookie = request.cookies.get('purchases')?.value
  if (!cookie) return new Set()
  try {
    const parsed = JSON.parse(cookie)
    const ids: string[] = Array.isArray(parsed?.purchasedSongIds) ? parsed.purchasedSongIds : []
    return new Set(ids)
  } catch {
    return new Set()
  }
}

function writePurchasesCookie(response: NextResponse, songIds: Set<string>) {
  const value = JSON.stringify({ purchasedSongIds: Array.from(songIds) })
  response.cookies.set('purchases', value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  if (!stripeSecretKey) {
    return NextResponse.redirect(new URL(`/result?error=stripe_not_configured`, request.url))
  }

  try {
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20',
    })

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    })

    const paid = session.payment_status === 'paid'
    const songId = (session.metadata as any)?.song_id || (session.payment_intent as any)?.metadata?.song_id

    if (!songId) {
      return NextResponse.redirect(new URL(`/result?error=missing_song_id`, request.url))
    }

    const originHeader = request.headers.get('origin') || request.headers.get('referer')
    const fallbackHost = process.env.NEXT_PUBLIC_APP_URL
    const origin = originHeader?.replace(/\/$/, '') || fallbackHost || ''
    const finalRedirect = `${origin || ''}/song/${encodeURIComponent(songId)}?purchased=${paid ? '1' : '0'}`

    const response = NextResponse.redirect(finalRedirect)

    if (paid) {
      const current = readPurchasesCookie(request)
      current.add(String(songId))
      writePurchasesCookie(response, current)
    }

    return response
  } catch (error) {
    console.error('Error verifying checkout session:', error)
    return NextResponse.redirect(new URL(`/result?error=checkout_verification_failed`, request.url))
  }
}


