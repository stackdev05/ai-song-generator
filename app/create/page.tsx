"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Music, Guitar, Piano, Mic, Heart, Smile, CloudRain, Zap, Coffee, Sun, Moon, Sparkles, Shuffle, Trash2, ChevronDown } from "lucide-react"
import { PageHeader } from "@/components/page-header"

// Data for the style options
const instruments = {
  alwaysShow: ["Piano", "Guitar", "Drums", "Bass", "Violin", "Saxophone"],
  fullList: [
    "Piano", "Guitar", "Drums", "Bass", "Violin", "Saxophone", "Flute", "Trumpet", "Cello", "Synthesizer",
    "Uklele", "Harp", "Accordion", "Harmonica", "Tuba", "Trombone", "French Horn", "Recorder", "Xylophone",
    "Marimba", "Glockenspiel", "Vibraphone", "Steel Drums", "Conga", "Bongo", "Triangle", "Tambourine",
    "Maracas", "Cymbals", "Timpani", "Cajon", "Djembe", "Sitar", "Guzheng", "Pipa", "Erhu", "Dizi",
    "Sheng", "Hulusi", "Xun", "Banjo", "Mandolin", "Clarinet", "Oboe", "Viola", "Organ", "Electric Guitar",
    "Electric Bass", "Electric Piano", "MIDI Keyboard", "Drum Machine", "Sequencer", "Mixer", "Audio Interface"
  ]
}

const genres = {
  alwaysShow: ["Pop", "Rock", "Hip Hop", "Electronic", "Jazz", "Rap"],
  fullList: [
    "Pop", "Rock", "Hip Hop", "Electronic", "Jazz", "Blues", "Classical", "Country", "Folk", "Soul",
    "Funk", "Reggae", "Metal", "Punk", "R&B", "Disco", "Indie", "Alternative", "World Music", "Latin",
    "New Age", "Experimental", "Ambient", "Post-Rock", "EDM", "Hardcore", "Industrial", "Gothic", "Rap Rock",
    "Fusion Jazz", "Bluegrass", "Folk Rock", "Heavy Metal", "Death Metal", "Black Metal", "Progressive Metal",
    "Alternative Rock", "Garage Rock", "Punk Rock", "Grunge", "Blues Rock", "Hard Rock", "Psychedelic Rock",
    "Progressive Rock", "Glam Rock", "Electronic Rock", "Alternative Metal", "Nu Metal", "Industrial Metal",
    "Rap Metal", "Trap", "Gangsta Rap", "Alternative Hip Hop", "Jazz Rap", "House", "Techno", "Drum and Bass",
    "Dubstep", "Ambient House", "Dub", "Acid House", "Cool Jazz", "Bebop", "Free Jazz", "Swing Jazz",
    "Blues Jazz", "Country Blues", "Chicago Blues", "Baroque", "Romantic", "Modern Classical", "Minimalism",
    "Neoclassical", "Opera", "Alternative Country", "Contemporary Folk", "Traditional Folk", "Celtic",
    "African", "Latin Jazz", "Salsa", "Samba", "Bossa Nova", "Reggae Rock", "Ska", "Funk Rock", "New Wave",
    "Post-Punk", "Gothic Rock", "Industrial Rock", "Noise Rock", "Dream Pop", "Shoegaze", "Post-Metal",
    "Post-Hardcore", "Emo", "Math Rock", "Atmospheric Black Metal", "Symphonic Metal", "Folk Metal",
    "Viking Metal", "Electronicore", "Trap Metal", "Post-Britpop", "New Psychedelia", "Space Rock",
    "Art Rock", "New Romanticism", "Synthpop", "Future Bass", "Vaporwave", "Retrowave", "Electropop",
    "Tropical House", "Deep House", "Tech House", "Minimal Techno", "Hard Techno", "Industrial Techno",
    "Liquid Drum and Bass", "Neurofunk", "Breakbeat", "Big Beat", "Trap (EDM)", "Future House",
    "Post-Dubstep", "Ambient Dubstep", "Experimental Electronic", "Hyperpop", "8-bit Music", "Synthwave",
    "Ballad", "Dance", "J-pop", "Orchestral", "Psychedelic", "Progressive", "K-pop", "Pop rock",
    "Cantonese", "Gospel", "Phonk", "Rap", "Vallenato Viejo", "costumbrista", "Porros", "Colombian Cumbia"
  ]
}

const moods = {
  alwaysShow: ["Cheerful", "Sad", "Passionate", "Calm", "Excited"],
  fullList: [
    "Cheerful", "Sad", "Passionate", "Calm", "Excited", "Melancholic", "Mysterious", "Tense", "Relaxed",
    "Anxious", "Angry", "Gentle", "Intense", "Dreamy", "Joyful", "Depressed", "Hopeful", "Fearful",
    "Humorous", "Solemn", "Energetic", "Gloomy", "Warm", "Cold", "Profound", "Upbeat", "Sorrowful",
    "Comforting", "Lonely", "Nostalgic", "Uplifting", "Contemplative", "Thrilling", "Peaceful", "Frenzied",
    "Elegant", "Rugged", "Sweet", "Moody", "Exuberant", "Worried", "Content", "Lost", "Confident",
    "Sensitive", "Strong", "Vulnerable", "Enthusiastic", "Indifferent", "Sympathetic", "Doubtful",
    "Determined", "Confused", "Serene", "Restless", "Delightful", "Heavy", "Light", "Stirring",
    "Comfortable", "Uneasy", "Sacred", "Secular", "Transcendent", "Simple", "Elaborate", "Sunny", "Dark",
    "Bright", "Hazy", "Clear", "Bewildered", "Cozy", "Distant", "Intimate", "Majestic", "Subtle",
    "Overwhelming", "Ethereal", "Grounded", "Radical", "Conservative", "Avant-garde", "Modern", "Futuristic"
  ]
}

const tempos = [
  "Strong", "Soft", "Rhythmic", "Jumping", "Powerful", "Fast", "Slow",
  "60-80 BPM", "80-120 BPM", "120-160 BPM"
]

export default function CreatePage() {
  const [story, setStory] = useState("")
  const [styleDescription, setStyleDescription] = useState("")
  const [activeTab, setActiveTab] = useState("mood")
  const [selectedVoice, setSelectedVoice] = useState("random")
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()

  // Get random suggestions for each category
  const getRandomSuggestions = (fullList: string[], alwaysShow: string[], count: number = 5) => {
    const availableOptions = fullList.filter(item => !alwaysShow.includes(item))
    const shuffled = availableOptions.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  // Generate new random suggestions when tab changes
  const [randomSuggestions, setRandomSuggestions] = useState<{
    instrument: string[];
    genre: string[];
    mood: string[];
  }>({
    instrument: [],
    genre: [],
    mood: []
  })

  // Initialize random suggestions on client side only
  useEffect(() => {
    setRandomSuggestions({
      instrument: getRandomSuggestions(instruments.fullList, instruments.alwaysShow),
      genre: getRandomSuggestions(genres.fullList, genres.alwaysShow),
      mood: getRandomSuggestions(moods.fullList, moods.alwaysShow)
    })
  }, [])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)

    // Generate new random suggestions for the selected tab (only for main tabs)
    if (tabId === "instrument") {
      setRandomSuggestions(prev => ({
        ...prev,
        instrument: getRandomSuggestions(instruments.fullList, instruments.alwaysShow)
      }))
    } else if (tabId === "genre") {
      setRandomSuggestions(prev => ({
        ...prev,
        genre: getRandomSuggestions(genres.fullList, genres.alwaysShow)
      }))
    } else if (tabId === "mood") {
      setRandomSuggestions(prev => ({
        ...prev,
        mood: getRandomSuggestions(moods.fullList, moods.alwaysShow)
      }))
    }
  }



  const addToStyle = (category: string, value: string) => {
    const newStyle = styleDescription ? `${styleDescription}, ${category}: ${value}` : `${category}: ${value}`
    setStyleDescription(newStyle)
  }

  const handleRandom = () => {
    const randomInstrument = instruments.fullList[Math.floor(Math.random() * instruments.fullList.length)]
    const randomGenre = genres.fullList[Math.floor(Math.random() * genres.fullList.length)]
    const randomMood = moods.fullList[Math.floor(Math.random() * moods.fullList.length)]
    const randomTempo = tempos[Math.floor(Math.random() * tempos.length)]

    const randomStyle = `Instrument: ${randomInstrument}, Genre: ${randomGenre}, Mood: ${randomMood}, Tempo: ${randomTempo}`
    setStyleDescription(randomStyle)
  }

  const clearStyle = () => {
    setStyleDescription("")
  }

  const handleGenerate = async () => {
    if (!story.trim() || !styleDescription.trim() || !selectedVoice) {
      return
    }

    setIsGenerating(true)

    // Simulate API call delay
    setTimeout(() => {
      router.push("/progress")
    }, 1000)
  }

  const isFormValid = story.trim() && styleDescription.trim() && selectedVoice

  const renderTabContent = () => {
    switch (activeTab) {
      case "instrument":
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {instruments.alwaysShow.map((instrument) => (
                <Badge
                  key={instrument}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/20 transition-colors text-sm py-2 px-3"
                  onClick={() => addToStyle("Instrument", instrument)}
                >
                  {instrument}
                </Badge>
              ))}
              {randomSuggestions.instrument.map((instrument) => (
                <Badge
                  key={instrument}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/20 transition-colors text-sm py-2 px-3"
                  onClick={() => addToStyle("Instrument", instrument)}
                >
                  {instrument}
                </Badge>
              ))}
            </div>
          </div>
        )

      case "genre":
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {genres.alwaysShow.map((genre) => (
                <Badge
                  key={genre}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/20 transition-colors text-sm py-2 px-3"
                  onClick={() => addToStyle("Genre", genre)}
                >
                  {genre}
                </Badge>
              ))}
              {randomSuggestions.genre.map((genre) => (
                <Badge
                  key={genre}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/20 transition-colors text-sm py-2 px-3"
                  onClick={() => addToStyle("Genre", genre)}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        )

      case "mood":
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {moods.alwaysShow.map((mood) => (
                <Badge
                  key={mood}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/20 transition-colors text-sm py-2 px-3"
                  onClick={() => addToStyle("Mood", mood)}
                >
                  {mood}
                </Badge>
              ))}
              {randomSuggestions.mood.map((mood) => (
                <Badge
                  key={mood}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/20 transition-colors text-sm py-2 px-3"
                  onClick={() => addToStyle("Mood", mood)}
                >
                  {mood}
                </Badge>
              ))}
            </div>
          </div>
        )

      case "tempo":
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {tempos.map((tempo) => (
                <Badge
                  key={tempo}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/20 transition-colors text-sm py-2 px-3"
                  onClick={() => addToStyle("Tempo", tempo)}
                >
                  {tempo}
                </Badge>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

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
              Tell us your story and define your song's style
            </p>
          </div>

          <div className="space-y-6">
            {/* Step 1: Story */}
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
                    onChange={(e) => {
                      if (e.target.value.length <= 3000) {
                        setStory(e.target.value)
                      }
                    }}
                    className="min-h-48 text-sm resize-y border-2 border-card-border focus:border-primary/50 transition-colors"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Inspired Story
                    </Button>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${story.length >= 3000 ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                        {story.length}/3000
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStory("")}
                        className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Style */}
            <Card className="bg-gradient-to-br from-card to-card/50 border-2 border-card-border shadow-lg dark:shadow-white/5 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="space-y-4">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      2
                    </div>
                    Define Your Style
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Describe your song's style in your own words or select from our categorized options.
                  </p>

                  {/* Style Description Textarea */}
                  <Textarea
                    placeholder="Describe your song's style, mood, genre, and instruments..."
                    value={styleDescription}
                    onChange={(e) => {
                      if (e.target.value.length <= 180) {
                        setStyleDescription(e.target.value)
                      }
                    }}
                    className="min-h-24 text-sm resize-y border-2 border-card-border focus:border-primary/50 transition-colors"
                  />

                  {/* Action Buttons and Style Info */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Inspired Style
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleRandom}
                        className="flex items-center gap-2"
                      >
                        <Shuffle className="w-4 h-4" />
                        Random
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${styleDescription.length >= 180 ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                        {styleDescription.length}/180
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearStyle}
                        className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Category Tabs */}
                  <div className="border-b-2">
                    <div className="flex flex-wrap gap-1">
                      {[
                        { id: "instrument", label: "Instrument" },
                        { id: "genre", label: "Genre" },
                        { id: "mood", label: "Mood" },
                        { id: "tempo", label: "Tempos" }
                      ].map((tab) => (
                        <Button
                          key={tab.id}
                          variant={activeTab === tab.id ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handleTabChange(tab.id)}
                          className={`text-sm rounded-t-lg rounded-b-none ${activeTab === tab.id ? "border-b-0" : ""
                            }`}
                        >
                          {tab.label}
                        </Button>
                      ))}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="link"
                            size="sm"
                            className="text-primary hover:text-primary/80 p-0 px-2 h-auto"
                          >
                            View All
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-96">
                          <DialogHeader>
                            <DialogTitle>All Style Options</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {/* Modal Tabs */}
                            <div className="border-b-2">
                              <div className="flex flex-wrap gap-1">
                                {[
                                  { id: "instrument", label: "Instruments" },
                                  { id: "genre", label: "Genres" },
                                  { id: "mood", label: "Moods" },
                                  { id: "tempo", label: "Tempos" }
                                ].map((tab) => (
                                  <Button
                                    key={tab.id}
                                    variant={activeTab === tab.id ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`text-sm rounded-t-lg rounded-b-none ${activeTab === tab.id ? "border-b-0" : ""
                                      }`}
                                  >
                                    {tab.label}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            {/* Modal Tab Content */}
                            <div className="min-h-64">
                              {activeTab === "instrument" && (
                                <div className="h-64 overflow-y-auto">
                                  <div className="flex flex-wrap gap-2">
                                    {instruments.fullList.map((instrument) => (
                                      <Badge
                                        key={instrument}
                                        variant="outline"
                                        className="cursor-pointer hover:bg-primary/20 transition-colors text-sm py-2 px-3"
                                        onClick={() => addToStyle("Instrument", instrument)}
                                      >
                                        {instrument}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {activeTab === "genre" && (
                                <div className="h-64 overflow-y-auto">
                                  <div className="flex flex-wrap gap-2">
                                    {genres.fullList.map((genre) => (
                                      <Badge
                                        key={genre}
                                        variant="outline"
                                        className="cursor-pointer hover:bg-primary/20 transition-colors text-sm py-2 px-3"
                                        onClick={() => addToStyle("Genre", genre)}
                                      >
                                        {genre}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {activeTab === "mood" && (
                                <div className="h-64 overflow-y-auto">
                                  <div className="flex flex-wrap gap-2">
                                    {moods.fullList.map((mood) => (
                                      <Badge
                                        key={mood}
                                        variant="outline"
                                        className="cursor-pointer hover:bg-primary/20 transition-colors text-sm py-2 px-3"
                                        onClick={() => addToStyle("Mood", mood)}
                                      >
                                        {mood}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {activeTab === "tempo" && (
                                <div className="h-64 overflow-y-auto">
                                  <div className="flex flex-wrap gap-2">
                                    {tempos.map((tempo) => (
                                      <Badge
                                        key={tempo}
                                        variant="outline"
                                        className="cursor-pointer hover:bg-primary/20 transition-colors text-sm py-2 px-3"
                                        onClick={() => addToStyle("Tempo", tempo)}
                                      >
                                        {tempo}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="min-h-32">
                    {renderTabContent()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Voice Selection */}
            <Card className="bg-gradient-to-br from-card to-card/50 border-2 border-card-border shadow-lg dark:shadow-white/5 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="space-y-4">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      3
                    </div>
                    Select Singing Voice
                    <div className="relative group">
                      <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center cursor-help">
                        <span className="text-xs text-gray-600">?</span>
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                        AI-generated vocals may have unexpected traits despite gender settings.
                        <br />
                        This creative variability is part of AI's charm – you can regenerate to find your preferred voice.
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                      </div>
                    </div>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Choose the voice type for your song performance.
                  </p>

                  <div className="flex gap-2">
                    <Button
                      variant={selectedVoice === "random" ? "default" : "outline"}
                      onClick={() => setSelectedVoice("random")}
                    >
                      Random
                    </Button>

                    <Button
                      variant={selectedVoice === "male" ? "default" : "outline"}
                      onClick={() => setSelectedVoice("male")}
                    >
                      Male
                    </Button>

                    <Button
                      variant={selectedVoice === "female" ? "default" : "outline"}
                      onClick={() => setSelectedVoice("female")}
                    >
                      Female
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <div className="text-center">
              <Button
                onClick={handleGenerate}
                disabled={!isFormValid || isGenerating}
                size="lg"
                className={`text-lg px-12 py-6 w-full transition-all duration-300 ${isFormValid
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
