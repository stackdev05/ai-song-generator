"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

interface AudioPlayerProps {
  title: string
  artist: string
  duration: string
  audioUrl: string
}

export function AudioPlayer({ title, artist, duration, audioUrl }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(75)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Since we don't have a real audio file, we'll simulate playback
  const [simulatedTime, setSimulatedTime] = useState(0)
  const simulatedDuration = 222 // 3:42 in seconds

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setSimulatedTime((prev) => {
          if (prev >= simulatedDuration) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, simulatedDuration])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleProgressChange = (value: number[]) => {
    const newTime = (value[0] / 100) * simulatedDuration
    setSimulatedTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    setIsMuted(value[0] === 0)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progress = (simulatedTime / simulatedDuration) * 100

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <Slider value={[progress]} onValueChange={handleProgressChange} max={100} step={1} className="w-full" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatTime(simulatedTime)}</span>
          <span>{duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Play/Pause Button */}
        <Button
          onClick={togglePlayPause}
          size="lg"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
        </Button>

        {/* Volume Control */}
        <div className="flex items-center space-x-3 flex-1 max-w-32 ml-6">
          <Button variant="ghost" size="sm" onClick={toggleMute} className="p-2">
            {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="flex-1"
          />
        </div>
      </div>

      {/* Hidden audio element for future real implementation */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </div>
  )
}
