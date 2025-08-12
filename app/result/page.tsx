"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, Share2, RotateCcw, Heart, Play, Pause, Volume2, Sparkles } from "lucide-react"
import { PageHeader } from "@/components/page-header"

// Mock data for the generated song
const songData = {
  title: "Memories of Tomorrow",
  artist: "AI Generated",
  duration: "3:42",
  audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
  lyrics: [
    "In the quiet of the morning light",
    "I remember how you used to smile",
    "Every story that we shared at night",
    "Made the journey feel so worthwhile",
    "",
    "Now I'm walking down this winding road",
    "With your laughter echoing in my mind",
    "Every step reveals what I've always known",
    "Love like ours is so hard to find",
    "",
    "Memories of tomorrow, dreams of yesterday",
    "In my heart they'll always stay",
    "Through the seasons that come and go",
    "This is all I need to know",
    "",
    "When the world feels cold and gray",
    "I just close my eyes and see your face",
    "In that moment, everything's okay",
    "Time and distance can't erase",
    "",
    "Memories of tomorrow, dreams of yesterday",
    "In my heart they'll always stay",
    "Through the seasons that come and go",
    "This is all I need to know",
    "",
    "So I'll keep on singing this melody",
    "Until we meet again someday",
    "In the memories of tomorrow",
    "Love will always find a way",
  ],
}

export default function ResultPage() {
  const [isLiked, setIsLiked] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(222) // 3:42 in seconds
  const [volume, setVolume] = useState(0.7)
  const [audioError, setAudioError] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      const handleError = () => {
        setAudioError(true)
        setIsPlaying(false)
        console.log("Audio failed to load, using demo mode")
      }

      const handleCanPlay = () => {
        setAudioError(false)
      }

      audio.addEventListener("error", handleError)
      audio.addEventListener("canplay", handleCanPlay)

      return () => {
        audio.removeEventListener("error", handleError)
        audio.removeEventListener("canplay", handleCanPlay)
      }
    }
  }, [])

  const handlePlayPause = () => {
    if (audioError) {
      // Demo mode - just toggle the visual state
      setIsPlaying(!isPlaying)
      if (!isPlaying) {
        // Simulate progress in demo mode
        const interval = setInterval(() => {
          setCurrentTime((prev) => {
            if (prev >= duration) {
              clearInterval(interval)
              setIsPlaying(false)
              return 0
            }
            return prev + 1
          })
        }, 1000)
      }
      return
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(() => {
          // If play fails, switch to demo mode
          setAudioError(true)
          setIsPlaying(!isPlaying)
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleDownload = () => {
    console.log("Downloading song...")
  }

  const handleShare = () => {
    console.log("Sharing song...")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col">
      <PageHeader />

      <div className="py-6">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-playfair font-bold mb-3">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Your Song is Ready!
              </span>
            </h1>
            <p className="text-base text-muted-foreground">
              Here's your personalized AI-generated song
              {audioError && <span className="text-xs block mt-1 text-yellow-600">(Demo Mode - Visual Only)</span>}
            </p>
          </div>

          <Card className="bg-gradient-to-br from-card to-card/50 border-[2px] border-card-border shadow-lg dark:shadow-white/5 backdrop-blur-sm mb-6 overflow-hidden">
            <CardContent className="p-0">
              {/* AI Generated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
              </div>

              <div className="relative p-6">
                {/* Audio Player Section with Vinyl Record */}
                <div className="flex flex-col lg:flex-row gap-6 mb-6">
                  {/* Vinyl Record Player */}
                  <div className="flex-shrink-0 flex justify-center">
                    <div className="relative">
                      {/* Vinyl Record */}
                      <div
                        className={`w-48 h-48 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-full shadow-2xl border-4 border-gray-700 relative ${
                          isPlaying ? "animate-spin-slow" : ""
                        }`}
                      >
                        {/* Record grooves */}
                        <div className="absolute inset-4 border border-gray-600 rounded-full opacity-30" />
                        <div className="absolute inset-8 border border-gray-600 rounded-full opacity-20" />
                        <div className="absolute inset-12 border border-gray-600 rounded-full opacity-10" />

                        {/* Center label */}
                        <div className="absolute inset-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="text-xs font-bold mb-1">AI</div>
                            <div className="text-xs">SONG</div>
                          </div>
                        </div>

                        {/* Play/Pause Button */}
                        <button
                          onClick={handlePlayPause}
                          className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full hover:bg-black/30 transition-all duration-200 group"
                        >
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            {isPlaying ? (
                              <Pause className="h-8 w-8 text-gray-800" />
                            ) : (
                              <Play className="h-8 w-8 text-gray-800 ml-1" />
                            )}
                          </div>
                        </button>
                      </div>


                    </div>
                  </div>

                  {/* Song Info and Controls */}
                  <div className="flex-1 min-w-0">
                    <div className="mb-4">
                      <h2 className="text-xl font-playfair font-bold mb-1">{songData.title}</h2>
                      <p className="text-muted-foreground text-sm">by {songData.artist}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-10">{formatTime(currentTime)}</span>
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-10">{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center gap-3 mb-4">
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 max-w-24 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                          style={{ width: `${volume * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={handleDownload}
                        size="sm"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 py-1.5 text-xs"
                      >
                        <Download className="mr-1.5 h-3 w-3" />
                        Download
                      </Button>
                      <Button
                        onClick={handleShare}
                        variant="outline"
                        size="sm"
                        className="px-3 py-1.5 text-xs bg-transparent"
                      >
                        <Share2 className="mr-1.5 h-3 w-3" />
                        Share
                      </Button>
                      <Button
                        onClick={() => setIsLiked(!isLiked)}
                        variant="outline"
                        size="sm"
                        className={`px-3 py-1.5 text-xs ${isLiked ? "text-red-500 border-red-500" : ""}`}
                      >
                        <Heart className={`h-3 w-3 ${isLiked ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Lyrics Section */}
                <div className="border-t border-border/50 pt-6">
                  <h3 className="text-lg font-playfair font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    Lyrics
                  </h3>
                  <ScrollArea className="h-64 w-full rounded-md border border-border/50 p-4 bg-background/50 [&_.radix-scrollbar-thumb]:bg-muted-foreground/40 [&_.radix-scrollbar-thumb]:hover:bg-muted-foreground/60">
                    <div className="space-y-3 text-center">
                      {songData.lyrics.map((line, index) => (
                        <p
                          key={index}
                          className={`text-base leading-relaxed transition-all duration-300 hover:scale-120 ${
                            line === "" ? "h-4" : "text-foreground/80 hover:text-foreground"
                          }`}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>

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

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={songData.audioUrl}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 222)}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />
    </div>
  )
}
