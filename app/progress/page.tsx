"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Check, FileText, Music, Sparkles, AlertCircle, Play, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const steps = [
  {
    id: "lyrics",
    title: "Creating Lyrics",
    description: "Crafting personalized lyrics from your narrative",
    icon: FileText,
  },
  {
    id: "song",
    title: "Generating Song",
    description: "Composing melody and arrangement with AI",
    icon: Music,
  },
  {
    id: "complete",
    title: "Finalizing",
    description: "Preparing your song for listening",
    icon: Sparkles,
  },
]

export default function ProgressPage() {
  const [currentStep, setCurrentStep] = useState(-1) // -1 means not started yet
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [progress, setProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [songsInProgress, setSongsInProgress] = useState(0)
  const [finishedSongs, setFinishedSongs] = useState(0)
  const [validationData, setValidationData] = useState<any>(null)
  const hasStartedRef = useRef(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  console.log('🔄 Progress page component rendered', { hasStarted: hasStartedRef.current })

  // Get parameters from URL
  const story = searchParams.get('story')
  const style = searchParams.get('style')
  const singingVoice = searchParams.get('singing_voice')

  useEffect(() => {
    console.log('🔄 Progress page useEffect triggered', { story: !!story, style: !!style, singingVoice: !!singingVoice, hasStarted: hasStartedRef.current })
    
    if (!story || !style || !singingVoice) {
      setError("Missing required parameters for song generation")
      setIsProcessing(false)
      return
    }

    // Set validation data for user to review
    setValidationData({
      story: story.trim(),
      style: style.trim(),
      singing_voice: singingVoice,
      storyLength: story.trim().length,
      styleLength: style.trim().length
    })

    console.log('✅ Validation data ready, waiting for user to start process')
  }, [story, style, singingVoice])

  const startSongGeneration = async () => {
    if (hasStartedRef.current) {
      console.log('Song generation already started, skipping')
      return
    }

    hasStartedRef.current = true
    setIsProcessing(true)
    setCurrentStep(0)
    setProgress(25)
    
    console.log('🚀 User clicked start - beginning song generation process...')

    try {
      // Step 1: Generate lyrics from story
      console.log('🔄 Step 1: Generating lyrics...')
      const lyricsResponse = await fetch('/api/v1/generate-lyrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: story }),
      })

      if (!lyricsResponse.ok) {
        throw new Error('Failed to generate lyrics')
      }

      const lyricsData = await lyricsResponse.json()
      const { lyrics, title } = lyricsData

      if (!lyrics) {
        throw new Error('No lyrics generated')
      }

      // Mark lyrics step as completed
      setCompletedSteps([0])
      setProgress(50)

      // Step 2: Submit song generation task
      setCurrentStep(1)
      
      console.log('🎵 Step 2: Submitting song generation...')
      const songResponse = await fetch('/api/v1/generate-song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lyrics,
          title: title || "My AI Generated Song",
          style,
          singing_voice: singingVoice
        }),
      })

      if (!songResponse.ok) {
        throw new Error('Failed to submit song generation task')
      }

      const songData = await songResponse.json()
      
      if (!songData.songs || songData.songs.length === 0) {
        throw new Error('No songs returned from generation')
      }

      console.log(`Initial song generation returned ${songData.songs.length} songs:`, songData.songs.map((s: any) => ({ song_id: s.song_id, title: s.title })))
      setSongsInProgress(songData.songs.length)
      setProgress(75)

      // Step 3: Check progress for each song
      setCurrentStep(2)
      
      // Track which songs have already been processed to avoid duplicates
      const processedSongs = new Set()
      
      const checkProgress = async () => {
        let allFinished = true
        let currentFinished = 0
        
        for (const song of songData.songs) {
          try {
            const progressResponse = await fetch(`/api/v1/check-progress?song_id=${song.song_id}`)
            
            if (progressResponse.ok) {
              const progressData = await progressResponse.json()
              
              if (progressData.status === 'FINISHED') {
                // Check if we've already processed this song
                if (processedSongs.has(song.song_id)) {
                  console.log(`Song ${song.song_id} already processed, skipping`)
                  continue
                }
                
                // Mark this song as processed
                processedSongs.add(song.song_id)
                
                currentFinished++
                
                // Add finished song to localStorage immediately when it's done
                const existingSongs = JSON.parse(localStorage.getItem('generatedSongs') || '[]')
                const songExists = existingSongs.find((s: any) => s.song_id === song.song_id)
                
                if (!songExists) {
                  // Create a complete song object by merging the original song data with progress data
                  const completeSong = { ...song, ...progressData }
                  
                  // Add the new song to the beginning of the existing list (newest first)
                  const updatedSongs = [completeSong, ...existingSongs]
                  
                  localStorage.setItem('generatedSongs', JSON.stringify(updatedSongs))
                  
                  console.log(`Song ${song.song_id} completed and added to localStorage. Total songs: ${updatedSongs.length}`)
                  
                  // Show toast notification for completed song
                  toast({
                    title: "Song Complete! 🎵",
                    description: `"${song.title || 'Your song'}" has finished generating`,
                  })
                } else {
                  console.log(`Song ${song.song_id} already exists in localStorage, skipping duplicate`)
                }
              } else {
                allFinished = false
              }
            } else {
              allFinished = false
            }
          } catch (error) {
            console.error(`Error checking progress for song ${song.song_id}:`, error)
            allFinished = false
          }
        }

        // Update finished songs count
        setFinishedSongs(currentFinished)
        setSongsInProgress(songData.songs.length - currentFinished)

        if (allFinished) {
          // All songs are finished
          setProgress(100)
          setCompletedSteps([0, 1, 2])
          setIsProcessing(false)
          setSongsInProgress(0)
          setFinishedSongs(songData.songs.length)
          
          // Final cleanup: ensure no duplicates within the current generation
          const finalSongs = JSON.parse(localStorage.getItem('generatedSongs') || '[]')
          const currentGenerationSongIds = songData.songs.map((s: any) => s.song_id)
          
          // Keep all songs but remove duplicates from current generation
          const songsWithoutCurrentDuplicates = finalSongs.filter((s: any, index: number, arr: any[]) => {
            // If it's from current generation, check for duplicates
            if (currentGenerationSongIds.includes(s.song_id)) {
              // Keep only the first occurrence (most recent)
              const firstIndex = arr.findIndex(song => song.song_id === s.song_id)
              return index === firstIndex
            }
            // Keep all songs from previous generations
            return true
          })
          
          if (songsWithoutCurrentDuplicates.length !== finalSongs.length) {
            console.log(`Cleaned up localStorage: removed ${finalSongs.length - songsWithoutCurrentDuplicates.length} duplicate songs from current generation`)
            localStorage.setItem('generatedSongs', JSON.stringify(songsWithoutCurrentDuplicates))
          }
          
          console.log(`Final result: ${songsWithoutCurrentDuplicates.length} total songs in localStorage (including previous generations)`)
          
          // Wait a moment then redirect to result page
          setTimeout(() => {
            router.push('/result')
          }, 3000)
        } else {
          // Check again in 15 seconds
          setTimeout(checkProgress, 20000)
        }
      }

      // Start checking progress
      checkProgress()

    } catch (error) {
      console.error('Error in song generation:', error)
      setError(error instanceof Error ? error.message : 'An error occurred during song generation')
      setIsProcessing(false)
      hasStartedRef.current = false
    }
  }

  if (error) {
    return (
      <div className="flex flex-col">
        <div className="py-8 flex items-center justify-center">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="bg-gradient-to-br from-card to-card/50 border-[2px] border-card-border shadow-lg dark:shadow-white/5 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-red-600 mb-4">Generation Failed</h1>
                <p className="text-muted-foreground mb-6">{error}</p>
                <button
                  onClick={() => router.push('/create')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  Try Again
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Show validation screen if not started yet
  if (currentStep === -1 && validationData) {
    return (
      <div className="flex flex-col">
        <div className="py-8 flex items-center justify-center">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="bg-gradient-to-br from-card to-card/50 border-[2px] border-card-border shadow-lg dark:shadow-white/5 backdrop-blur-sm">
              <CardContent className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Ready to Generate Your Song
                    </span>
                  </h1>
                  <p className="text-lg text-muted-foreground">Review your settings and start the generation process</p>
                </div>

                {/* Validation Summary */}
                <div className="mb-8 space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg border border-border">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      Story Summary
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {validationData.story}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Length: {validationData.storyLength}/250 characters
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg border border-border">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      Style & Voice
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Style:</span>
                        <p className="text-muted-foreground">{validationData.style}</p>
                        <span className="text-xs text-muted-foreground">
                          Length: {validationData.styleLength}/150 characters
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Voice:</span>
                        <p className="text-muted-foreground capitalize">{validationData.singing_voice}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time Estimate */}
                <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
                    <Clock className="h-5 w-5" />
                    <span className="font-semibold">Time Estimate</span>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    This process typically takes <strong>4-10 minutes</strong>. Please keep this page open during generation.
                  </p>
                </div>

                {/* Start Button */}
                <div className="text-center">
                  <Button
                    onClick={startSongGeneration}
                    size="lg"
                    className="text-lg px-12 py-6 w-full transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl"
                  >
                    <Play className="mr-3 h-5 w-5" />
                    Start Song Generation
                  </Button>
                  <p className="text-sm text-muted-foreground mt-3">
                    Click to begin the AI song generation process
                  </p>
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
      <div className="py-8 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="bg-gradient-to-br from-card to-card/50 border-[2px] border-card-border shadow-lg dark:shadow-white/5 backdrop-blur-sm">
            <CardContent className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Creating Your Song
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground">Our AI is working its magic on your story</p>
              </div>

              {/* Song Progress Info */}
              {songsInProgress > 0 && (
                <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Songs Progress</span>
                    <span className="text-sm font-medium text-primary">
                      {finishedSongs}/{songsInProgress} Complete
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{songsInProgress - finishedSongs} in progress</span>
                    <span>{finishedSongs} finished</span>
                  </div>
                  <Progress 
                    value={(finishedSongs / songsInProgress) * 100} 
                    className="h-2 mt-2" 
                  />
                </div>
              )}

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Overall Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3 bg-secondary" />
              </div>

              {/* Steps */}
              <div className="space-y-6">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isCompleted = completedSteps.includes(index)
                  const isCurrent = currentStep === index
                  const isPending = index > currentStep

                  return (
                    <div
                      key={step.id}
                      className={`flex items-center space-x-4 transition-all duration-500 ${
                        isPending ? "opacity-50" : "opacity-100"
                      }`}
                    >
                      {/* Step Icon */}
                      <div className="relative">
                        <div
                          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${
                            isCompleted
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 scale-110"
                              : isCurrent
                                ? "bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse-slow"
                                : "bg-muted"
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="h-7 w-7 text-white" />
                          ) : (
                            <Icon
                              className={`h-7 w-7 ${isCurrent ? "text-white animate-bounce" : "text-muted-foreground"}`}
                            />
                          )}
                        </div>

                        {/* Animated ring for current step */}
                        {isCurrent && (
                          <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
                        )}

                        {/* Glow effect for completed steps */}
                        {isCompleted && (
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full opacity-20 blur-lg" />
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1">
                        <h3
                          className={`text-lg font-semibold transition-colors ${
                            isCompleted
                              ? "text-green-600 dark:text-green-400"
                              : isCurrent
                                ? "text-primary"
                                : "text-muted-foreground"
                          }`}
                        >
                          {step.title}
                          {isCompleted && (
                            <span className="ml-2 text-sm font-normal text-green-600 dark:text-green-400">
                              ✓ Complete
                            </span>
                          )}
                          {isCurrent && (
                            <span className="ml-2 text-sm font-normal text-primary animate-pulse">In progress...</span>
                          )}
                        </h3>
                        <p
                          className={`text-sm transition-colors ${
                            isPending ? "text-muted-foreground/50" : "text-muted-foreground"
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Important Notice */}
              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 mb-2">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-semibold">Important</span>
                </div>
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  <strong>Please keep this page open</strong> while your song is being generated. Closing the page may interrupt the process.
                </p>
              </div>

              {/* Loading Animation */}
              <div className="mt-8 text-center">
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  {isProcessing ? "This will take 4-10 minutes..." : "Almost done!"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
