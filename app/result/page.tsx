"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Music, Clock, Sparkles, ArrowRight, RotateCcw, ArrowLeft, Loader2 } from "lucide-react"


interface SongData {
  song_id: string
  title: string
  audio: string
  image?: string
  lyric: string
  tags?: string
  audio_duration?: number
}

export default function ResultPage() {
  const [songs, setSongs] = useState<SongData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSongs = async () => {
      setIsLoading(true)
      
      // Simulate a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500))
      
      try {
        // First try to get songs from localStorage (set by progress page)
        let storedSongs = localStorage.getItem('generatedSongs')
        let songsData: any[] = []
        
        if (storedSongs) {
          songsData = JSON.parse(storedSongs)
          console.log(`Result page loaded ${songsData.length} songs from localStorage:`, songsData.map((s: any) => ({ song_id: s.song_id, title: s.title })))
        }
        

        
        setSongs(songsData)
      } catch (error) {
        console.error('Error parsing stored songs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSongs()
  }, [])

  const formatDuration = (milliseconds: number) => {
    if (!milliseconds) return "0:00"
    const totalSeconds = Math.ceil(milliseconds / 1000)
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }



  return (
    <div className="flex flex-col">
      <div className="py-6">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/create">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Create
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-2xl md:text-3xl font-playfair font-bold mb-3">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Your Songs Are Ready!
              </span>
            </h1>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
              <p className="text-lg text-muted-foreground">Loading your generated songs...</p>
            </div>
          ) : songs.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 lg:gap-6 mb-6">
              {songs.map((song, index) => (
                <div key={song.song_id} className="group">
                    <div className="relative">
                    {/* Record Box Surface */}
                    <Link href={`/song/${song.song_id}`} className="block">
                      <div className="relative w-40 h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden cursor-pointer rounded-lg shadow-2xl">
                        {/* Album Cover Image or Placeholder */}
                        {song.image ? (
                          <img
                            src={song.image}
                            alt={song.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center">
                            <div className="text-center text-white">
                              <div className="text-2xl mb-2">🎵</div>
                              <div className="text-xs font-bold">AI</div>
                            <div className="text-xs">SONG</div>
                            </div>
                          </div>
                        )}

                        {/* Title and Duration Overlay on Image */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 z-10">
                          <h3 className="text-white font-bold text-lg mb-1 line-clamp-2 drop-shadow-lg">
                            {song.title}
                          </h3>
                          <div className="flex items-center gap-2 text-white/90 text-sm">
                            <Clock className="h-4 w-4" />
                            <span className="font-mono">
                              {formatDuration(song.audio_duration || 0)}
                            </span>
                          </div>
                        </div>

                                                {/* Always Visible Play Icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-white/50 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-white/70 group-hover:shadow-2xl">
                            <Play className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-gray-800/60 ml-1 transition-transform duration-300 group-hover:scale-110 group-hover:text-gray-800" />
                      </div>
                    </div>

                        {/* Record Box Edge Effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-400 to-gray-600" />
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gray-400 to-gray-600" />
                        <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-gray-600 to-gray-800" />
                        <div className="absolute bottom-0 right-0 w-1 h-full bg-gradient-to-t from-gray-600 to-gray-800" />
                      </div>
                    </Link>

                    {/* Record Box Shadow/Depth Effect */}
                    <div className="absolute inset-0 bg-black/20 rounded-lg transform translate-y-2 scale-95 -z-10"></div>
                  </div>
                </div>
                      ))}
                    </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold">No Songs Found</h3>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="text-center py-8">
            <div className="space-y-4">
              <p className="text-muted-foreground text-base">Love your song? Create another one!</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/create">
                  <Button 
                    size="lg" 
                    className="min-w-56 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg font-semibold"
                  >
                    <RotateCcw className="mr-3 h-5 w-5" />
                    Create Another Song
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}
