"use client"

import { useState, useRef, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Download, Share2, RotateCcw, Play, Pause, Volume2, VolumeX, Sparkles, ArrowLeft, HelpCircle, Loader2, ShoppingCart, Check } from "lucide-react"
import { LyricsPanel } from "@/components/lyrics-panel"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"


interface SongData {
  song_id: string
  title: string
  audio: string
  image?: string
  lyric: string
  tags?: string
  audio_duration: number
  purchased?: boolean
}

export default function SongPage() {
  const params = useParams()
  const router = useRouter()
  const songId = params.id as string
  const searchParams = useSearchParams()
  const { toast } = useToast()
  

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [songData, setSongData] = useState<SongData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [purchased, setPurchased] = useState(false)
  const [previewEnded, setPreviewEnded] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (!songId) {
      setError("No song ID provided")
      setIsLoading(false)
      return
    }

    const fetchSongData = async () => {
      try {
        const storedSongs = localStorage.getItem('generatedSongs')
        if (storedSongs) {
          const songs = JSON.parse(storedSongs)
          const song = songs.find((s: SongData) => s.song_id === songId)
                  if (song) {
          setSongData(song)
          if (song.purchased) {
            setPurchased(true)
          }
          // Set duration from song data (milliseconds)
          if (song.audio_duration) {
            setDuration(song.audio_duration / 1000) // Convert to seconds for display
            setAudioDuration(song.audio_duration) // Keep in milliseconds for seeker
          }
          setIsLoading(false)
          // continue to verify purchase status if not already purchased
        }
        }

        const response = await fetch(`/api/v1/check-progress?song_id=${songId}`)
        if (response.ok) {
          const data = await response.json()
          setSongData(data)
          // Set duration from API response (milliseconds)
          if (data.audio_duration) {
            setDuration(data.audio_duration / 1000) // Convert to seconds for display
            setAudioDuration(data.audio_duration) // Keep in milliseconds for seeker
          }
        } else {
          throw new Error('Song not found')
        }
        // verify purchase status from server cookie store
        try {
          const statusResp = await fetch(`/api/v1/stripe/status?song_id=${encodeURIComponent(songId)}`, { cache: 'no-store' })
          if (statusResp.ok) {
            const status = await statusResp.json()
            if (status.purchased) {
              setPurchased(true)
              // Update localStorage record to include purchased flag
              const existingSongs = JSON.parse(localStorage.getItem('generatedSongs') || '[]')
              const updated = existingSongs.map((s: any) => s.song_id === songId ? { ...s, purchased: true } : s)
              localStorage.setItem('generatedSongs', JSON.stringify(updated))
            }
          }
        } catch (_) {}
      } catch (error) {
        console.error('Error fetching song data:', error)
        setError(error instanceof Error ? error.message : 'Failed to load song')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSongData()
  }, [songId])

  // Handle redirect flag from Stripe success
  useEffect(() => {
    const purchasedParam = searchParams.get('purchased')
    const canceledParam = searchParams.get('canceled')
    const sessionId = searchParams.get('session_id')
    
    if (purchasedParam === '1') {
      setPurchased(true)
      if (songId) {
        const existingSongs = JSON.parse(localStorage.getItem('generatedSongs') || '[]')
        const updated = existingSongs.map((s: any) => s.song_id === songId ? { ...s, purchased: true } : s)
        localStorage.setItem('generatedSongs', JSON.stringify(updated))
      }
      // Clean URL
      const url = new URL(window.location.href)
      url.searchParams.delete('purchased')
      url.searchParams.delete('session_id')
      window.history.replaceState({}, '', url.toString())
    }
    
    if (canceledParam === '1') {
      toast({
        variant: "destructive",
        title: "Checkout Cancelled",
        description: "Your purchase was cancelled. You can try again anytime!",
        duration: 4000,
      })
      // Clean URL
      const url = new URL(window.location.href)
      url.searchParams.delete('canceled')
      window.history.replaceState({}, '', url.toString())
    }

    // Handle session_id from Stripe redirect
    if (sessionId && !purchased) {
      verifyPurchase(sessionId)
    }
  }, [searchParams, songId, toast, purchased])

  // Function to verify purchase with session_id
  const verifyPurchase = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/v1/stripe/status?song_id=${encodeURIComponent(songId)}`, { 
        cache: 'no-store',
        headers: {
          'X-Session-ID': sessionId
        }
      })
      
      if (response.ok) {
        const status = await response.json()
        if (status.purchased) {
          setPurchased(true)
          // Update localStorage record to include purchased flag
          const existingSongs = JSON.parse(localStorage.getItem('generatedSongs') || '[]')
          const updated = existingSongs.map((s: any) => s.song_id === songId ? { ...s, purchased: true } : s)
          localStorage.setItem('generatedSongs', JSON.stringify(updated))
          
          toast({
            title: "Purchase Successful!",
            description: "Your song has been unlocked! Feel free to listen, download, and share with others.",
            duration: 5000,
          })
        }
      }
    } catch (error) {
      console.error('Error verifying purchase:', error)
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      const handleTimeUpdate = () => {
        if (!isDragging) {
          // Use requestAnimationFrame for smoother updates
          requestAnimationFrame(() => {
            const currentTime = audio.currentTime
            setCurrentTime(currentTime)
          })
        }
      }

      // Also handle play event to ensure time updates start immediately
      const handlePlay = () => {
        setIsDragging(false)
        // Force an immediate time update and start a timer for smooth updates
        setCurrentTime(audio.currentTime)
        
        // Start a timer to ensure continuous updates
        const updateTimer = setInterval(() => {
          if (!isDragging && !audio.paused) {
            setCurrentTime(audio.currentTime)
          }
        }, 100) // Update every 100ms for smooth slider movement
        
        // Store the timer ID to clear it later
        audio.dataset.updateTimer = updateTimer.toString()
      }

      const handleLoadedMetadata = () => {
        // Only set duration from audio element if we don't have it from songData
        if (!audioDuration) {
          setDuration(audio.duration)
          setAudioDuration(audio.duration * 1000)
        }
      }

      const handleEnded = () => {
        setIsPlaying(false)
        setCurrentTime(0)
        // Clear the update timer
        if (audio.dataset.updateTimer) {
          clearInterval(parseInt(audio.dataset.updateTimer))
          delete audio.dataset.updateTimer
        }
      }

      audio.addEventListener("timeupdate", handleTimeUpdate)
      audio.addEventListener("play", handlePlay)
      audio.addEventListener("loadedmetadata", handleLoadedMetadata)
      audio.addEventListener("ended", handleEnded)

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate)
        audio.removeEventListener("play", handlePlay)
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
        audio.removeEventListener("ended", handleEnded)
      }
    }
  }, [audioDuration]) // Remove isDragging dependency to prevent event listener recreation

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // Cleanup effect to clear any remaining timers
  useEffect(() => {
    return () => {
      if (audioRef.current?.dataset.updateTimer) {
        clearInterval(parseInt(audioRef.current.dataset.updateTimer))
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current && songData?.audio) {
      audioRef.current.load()
    }
  }, [songData?.audio])

  const handlePlayPause = () => {
    if (audioRef.current) {
      // Check if user is trying to play beyond preview
      if (!purchased && currentTime >= 20) {
        setPreviewEnded(true)
        return
      }

      if (isPlaying) {
        // Clear the update timer when pausing
        if (audioRef.current.dataset.updateTimer) {
          clearInterval(parseInt(audioRef.current.dataset.updateTimer))
          delete audioRef.current.dataset.updateTimer
        }
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        // Reset dragging state when starting playback
        setIsDragging(false)
        audioRef.current.play().then(() => {
          setIsPlaying(true)
        }).catch((error) => {
          console.error("Audio play failed:", error)
          setIsPlaying(false)
        })
      }
    }
  }

  const handleSeek = (value: number[]) => {
    // Convert milliseconds to seconds for audio playback
    const seekTimeInSeconds = value[0] / 1000
    
    // Prevent seeking beyond preview if not purchased
    if (!purchased && seekTimeInSeconds > 20) {
      return
    }
    
    setCurrentTime(seekTimeInSeconds)
    
    if (audioRef.current) {
      audioRef.current.currentTime = seekTimeInSeconds
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault()
          handlePlayPause()
          break
        case 'ArrowLeft':
          event.preventDefault()
          if (audioRef.current) {
            const newTime = Math.max(0, currentTime - 10)
            audioRef.current.currentTime = newTime
            setCurrentTime(newTime)
          }
          break
        case 'ArrowRight':
          event.preventDefault()
          if (audioRef.current) {
            const newTime = Math.min(duration, currentTime + 10)
            audioRef.current.currentTime = newTime
            setCurrentTime(newTime)
          }
          break
        case 'ArrowUp':
          event.preventDefault()
          const newVolumeUp = Math.min(1, volume + 0.1)
          setVolume(newVolumeUp)
          setIsMuted(false)
          break
        case 'ArrowDown':
          event.preventDefault()
          const newVolumeDown = Math.max(0, volume - 0.1)
          setVolume(newVolumeDown)
          setIsMuted(newVolumeDown === 0)
          break
        case 'KeyM':
          event.preventDefault()
          toggleMute()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentTime, duration, volume, isPlaying])

  const handleDownload = () => {
    if (!purchased) {
      return
    }
    
    if (songData?.audio) {
      // Download audio file
      const audioLink = document.createElement('a')
      audioLink.href = songData.audio
      audioLink.download = `${songData.title}.mp3`
      document.body.appendChild(audioLink)
      audioLink.click()
      document.body.removeChild(audioLink)
      
      // Download lyrics as text file
      if (songData.lyric) {
        const lyricsBlob = new Blob([songData.lyric], { type: 'text/plain' })
        const lyricsUrl = URL.createObjectURL(lyricsBlob)
        const lyricsLink = document.createElement('a')
        lyricsLink.href = lyricsUrl
        lyricsLink.download = `${songData.title}_lyrics.txt`
        document.body.appendChild(lyricsLink)
        lyricsLink.click()
        document.body.removeChild(lyricsLink)
        URL.revokeObjectURL(lyricsUrl)
      }
    }
  }

  const handleBuyNow = async () => {
    if (!songData) return
    try {
      setIsPurchasing(true)
      const response = await fetch('/api/v1/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          song_id: songData.song_id,
          title: songData.title,
          price_cents: parseInt(process.env.NEXT_PUBLIC_SONG_PRICE_CENTS || '299'),
          currency: 'usd',
          duration_millis: songData.audio_duration,
          image_url: songData.image,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to start checkout')
      }
      const data = await response.json()
      if (data?.url) {
        window.location.href = data.url
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsPurchasing(false)
    }
  }

  const handleShare = () => {
    if (!purchased) {
      return
    }
    
    if (navigator.share) {
      navigator.share({
        title: songData?.title || 'My AI Generated Song',
        text: 'Check out this AI-generated song!',
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Calculate progress in milliseconds for precise seeking
  const progress = audioDuration > 0 ? (Math.min(currentTime, purchased ? duration : 20) * 1000) : 0
  
  // Check if current time exceeds preview limit
  const isPreviewLimitReached = !purchased && currentTime >= 20

  // Handle preview end
  useEffect(() => {
    if (!purchased && currentTime >= 20 && isPlaying) {
      setPreviewEnded(true)
      if (audioRef.current) {
        audioRef.current.pause()
        setIsPlaying(false)
      }
      // Show toast notification
      toast({
        variant: "destructive",
        title: "Preview Ended",
        description: "You've reached the 20-second preview limit. Purchase to continue listening!",
        duration: 5000,
      })
    }
  }, [currentTime, purchased, isPlaying, toast])

  // Reset preview ended state when purchased
  useEffect(() => {
    if (purchased) {
      setPreviewEnded(false)
    }
  }, [purchased])


  if (isLoading) {
    return (
      <div className="flex flex-col">
        <div className="py-6 flex items-center justify-center">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your song...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !songData) {
    return (
      <div className="flex flex-col">
        <div className="py-6 flex items-center justify-center">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="bg-gradient-to-br from-card to-card/50 border-[2px] border-card-border shadow-lg dark:shadow-white/5 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="text-red-500 text-6xl mb-4">🎵</div>
                <h1 className="text-2xl font-bold text-red-600 mb-4">Song Not Found</h1>
                <p className="text-muted-foreground mb-6">{error || "The requested song could not be found."}</p>
                                <div className="space-y-3">
                  <Link href="/result">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Results
                    </Button>
                  </Link>
                  <Link href="/create">
                    <Button variant="outline" className="w-full">
                      Create New Song
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="py-6">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/result">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Results
              </Button>
            </Link>
          </div>

          <Card className="bg-gradient-to-br from-card to-card/50 border-[2px] border-card-border shadow-lg dark:shadow-white/5 backdrop-blur-sm mb-6 overflow-hidden relative">
            <CardContent className="p-0">
              {/* Song Image Background with Blur */}
              {songData.image && (
                <div className="absolute inset-0">
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${songData.image})`,
                      filter: 'blur(1px)',
                      transform: 'scale(1.1)'
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              )}
              
              {/* AI Generated Background Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
              </div>

              <div className="relative p-6 z-10">
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
                          disabled={!songData?.audio}
                          className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full hover:bg-black/30 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <div className="flex items-center gap-2">
                        <h2 className="text-3xl text-white font-bold">{songData.title}</h2>
                        {purchased ? (
                          <div className="flex items-center justify-center w-5 h-5 bg-green-500 rounded-full">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-white w-10">{formatTime(currentTime)}</span>
                        <Slider
                          value={[progress]}
                          onValueChange={handleSeek}
                          max={purchased ? audioDuration : Math.min(audioDuration, 20000)}
                          step={1}
                          className="flex-1"
                          onValueCommit={() => setIsDragging(false)}
                          onPointerDown={() => setIsDragging(true)}
                        />
                        <span className="text-xs text-white w-10">{formatTime(purchased ? duration : Math.min(duration, 20))}</span>
                      </div>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center gap-3 mb-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleMute}
                        className="p-2 h-8 w-8"
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="h-4 w-4 text-white" />
                        ) : (
                          <Volume2 className="h-4 w-4 text-white" />
                        )}
                      </Button>
                      <Slider
                        value={[isMuted ? 0 : volume * 100]}
                        onValueChange={handleVolumeChange}
                        max={100}
                        step={1}
                        className="flex-1 max-w-24"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {purchased ? (
                        <Button
                          onClick={handleDownload}
                          size="sm"
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 py-1.5 text-xs"
                        >
                          <Download className="mr-1.5 h-3 w-3" />
                          Download
                        </Button>
                      ) : null}
                      {!purchased ? (
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={handleBuyNow}
                            size="sm"
                            disabled={isPurchasing}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-1.5 text-xs font-semibold shadow-lg"
                          >
                            {isPurchasing ? (<>
                              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                              Processing...
                            </>) : (<>
                              <ShoppingCart className="mr-2 h-3 w-3" />
                              Buy Now – ${parseInt(process.env.NEXT_PUBLIC_SONG_PRICE_CENTS || '299') / 100}
                            </>)}
                          </Button>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1 h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/20"
                                >
                                  <HelpCircle className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>Purchase this song to unlock:</p>
                                <ul className="mt-1 text-xs space-y-1">
                                  <li>• Full song playback (unlimited time)</li>
                                  <li>• Download MP3 and lyrics</li>
                                  <li>• Share functionality</li>
                                </ul>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      ) : null}
                      {purchased ? (
                        <Button
                          onClick={handleShare}
                          variant="outline"
                          size="sm"
                          className="px-3 py-1.5 text-xs bg-transparent text-white"
                        >
                          <Share2 className="mr-1.5 h-3 w-3" />
                          Share
                        </Button>
                      ) : null}
                    </div>

                    {/* Keyboard Shortcuts Help */}
                    <div className="mt-3 text-xs text-white">
                      <p className="mb-1">Keyboard shortcuts:</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="bg-white/10 px-2 py-1 rounded">Space: Play/Pause</span>
                        <span className="bg-white/10 px-2 py-1 rounded">Left/Right: Seek 10s</span>
                        <span className="bg-white/10 px-2 py-1 rounded">Up/Down: Volume</span>
                        <span className="bg-white/10 px-2 py-1 rounded">M: Mute</span>
                      </div>
                    </div>
                    {!purchased && (
                      <div className="mt-3 text-xs text-white/70">
                        <p>Preview mode: Limited to first 20 seconds</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Lyrics Section */}
                <div className="border-t border-border/50 pt-6">
                  <LyricsPanel lyrics={songData.lyric.split('\n')} />
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
        src={songData?.audio}
        preload="metadata"
        crossOrigin="anonymous"
      />

    </div>
  )
}

