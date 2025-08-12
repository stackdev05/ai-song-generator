"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Music, Guitar, Piano, Mic, Heart, Smile, CloudRain, Zap, Coffee, Sun, Moon, Sparkles } from "lucide-react"
import { PageHeader } from "@/components/page-header"

const genres = [
  { id: "pop", name: "Pop", icon: Music, color: "from-pink-500 to-rose-500", desc: "Catchy & upbeat" },
  { id: "rock", name: "Rock", icon: Guitar, color: "from-red-500 to-orange-500", desc: "Bold & powerful" },
  { id: "folk", name: "Folk", icon: Coffee, color: "from-amber-500 to-yellow-500", desc: "Warm & acoustic" },
  { id: "jazz", name: "Jazz", icon: Piano, color: "from-blue-500 to-indigo-500", desc: "Smooth & soulful" },
  { id: "country", name: "Country", icon: Sun, color: "from-orange-500 to-amber-500", desc: "Heartfelt & rustic" },
  { id: "rnb", name: "R&B", icon: Mic, color: "from-purple-500 to-pink-500", desc: "Smooth & rhythmic" },
]

const moods = [
  { id: "happy", name: "Happy", icon: Smile, color: "from-yellow-400 to-orange-400", desc: "Joyful & bright" },
  { id: "nostalgic", name: "Nostalgic", icon: Moon, color: "from-blue-400 to-purple-400", desc: "Wistful & dreamy" },
  { id: "romantic", name: "Romantic", icon: Heart, color: "from-pink-400 to-red-400", desc: "Loving & tender" },
  {
    id: "melancholic",
    name: "Melancholic",
    icon: CloudRain,
    color: "from-gray-400 to-blue-400",
    desc: "Deep & reflective",
  },
  { id: "energetic", name: "Energetic", icon: Zap, color: "from-green-400 to-blue-400", desc: "Dynamic & lively" },
  { id: "peaceful", name: "Peaceful", icon: Sparkles, color: "from-teal-400 to-green-400", desc: "Calm & serene" },
]

export default function CreatePage() {
  const [story, setStory] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("")
  const [selectedMood, setSelectedMood] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()

  const handleGenerate = async () => {
    if (!story.trim() || !selectedGenre || !selectedMood) {
      return
    }

    setIsGenerating(true)

    // Simulate API call delay
    setTimeout(() => {
      router.push("/progress")
    }, 1000)
  }

  const isFormValid = story.trim() && selectedGenre && selectedMood

  return (
    <div className="flex flex-col">
      <PageHeader />

      <div className="py-6">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-playfair font-bold mb-3">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Create Your Song
              </span>
            </h1>
            <p className="text-base text-muted-foreground">
              Tell us your story and we'll transform it into a beautiful song
            </p>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-card to-card/50 border-2 border-card-border shadow-lg dark:shadow-white/5 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="space-y-3">
                  <Label htmlFor="story" className="text-base font-semibold flex items-center gap-2">
                    <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      1
                    </div>
                    Tell Your Story
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Share a personal story, memory, or experience that you'd like to turn into a song.
                  </p>
                  <Textarea
                    id="story"
                    placeholder="Once upon a time, I met someone who changed my life forever..."
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    className="min-h-48 text-sm resize-y border-2 border-card-border focus:border-primary/50 transition-colors"
                  />
                  <div className="text-xs text-muted-foreground text-right">{story.length} characters</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/50 border-2 border-card-border shadow-lg dark:shadow-white/5 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      2
                    </div>
                    Pick Your Style
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Choose the musical genre that best fits your story's vibe
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {genres.map((genre) => {
                      const Icon = genre.icon
                      const isSelected = selectedGenre === genre.id
                      return (
                        <Card
                          key={genre.id}
                          className={`cursor-pointer transition-all duration-300 border-2 hover:scale-102 ${
                            isSelected
                              ? "border-primary shadow-lg ring-2 ring-primary/20 bg-primary/5"
                              : "border-card-border hover:border-primary/50 bg-gradient-to-br from-card to-card/50"
                          } shadow-md dark:shadow-white/5 py-2`}
                          onClick={() => setSelectedGenre(genre.id)}
                        >
                          <CardContent className="p-2 flex items-center gap-2">
                            <div
                              className={`w-8 h-8 bg-gradient-to-r ${genre.color} rounded-full flex items-center justify-center ${isSelected ? "scale-110" : ""} transition-transform flex-shrink-0`}
                            >
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <h3 className="font-semibold text-sm mb-1">{genre.name}</h3>
                              <p className="text-xs text-muted-foreground">{genre.desc}</p>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/50 border-2 border-card-border shadow-lg dark:shadow-white/5 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <div className="w-5 h-5 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      3
                    </div>
                    Choose Your Mood
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Select the emotional tone that captures how your story should feel
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {moods.map((mood) => {
                      const Icon = mood.icon
                      const isSelected = selectedMood === mood.id
                      return (
                        <Card
                          key={mood.id}
                          className={`cursor-pointer transition-all duration-300 border-2 hover:scale-102 ${
                            isSelected
                              ? "border-primary shadow-lg ring-2 ring-primary/20 bg-primary/5"
                              : "border-card-border hover:border-primary/50 bg-gradient-to-br from-card to-card/50"
                          } shadow-md dark:shadow-white/5 py-2`}
                          onClick={() => setSelectedMood(mood.id)}
                        >
                          <CardContent className="p-2 flex items-center gap-2">
                            <div
                              className={`w-8 h-8 bg-gradient-to-r ${mood.color} rounded-full flex items-center justify-center ${isSelected ? "scale-110" : ""} transition-transform flex-shrink-0`}
                            >
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <h3 className="font-semibold text-sm mb-1">{mood.name}</h3>
                              <p className="text-xs text-muted-foreground">{mood.desc}</p>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                onClick={handleGenerate}
                disabled={!isFormValid || isGenerating}
                size="lg"
                className={`text-lg px-12 py-6 w-full transition-all duration-300 ${
                  isFormValid
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl"
                    : "bg-muted/50 text-muted-foreground/70 cursor-not-allowed border-2 border-dashed border-muted-foreground/30"
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                    Generating Your Song...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-3 h-5 w-5" />
                    Generate Song
                  </>
                )}
              </Button>
              {!isFormValid && (
                <p className="text-sm text-muted-foreground mt-3 font-medium">
                  Please complete all steps above to generate your song
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
