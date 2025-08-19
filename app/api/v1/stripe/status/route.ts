import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const songId = searchParams.get('song_id')
  if (!songId) {
    return NextResponse.json({ error: 'song_id is required' }, { status: 400 })
  }

  const cookie = request.cookies.get('purchases')?.value
  try {
    const parsed = cookie ? JSON.parse(cookie) : null
    const ids: string[] = Array.isArray(parsed?.purchasedSongIds) ? parsed.purchasedSongIds : []
    const purchased = ids.includes(songId)
    return NextResponse.json({ purchased })
  } catch {
    return NextResponse.json({ purchased: false })
  }
}


