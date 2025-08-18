"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Music, Guitar, Piano, Mic, Heart, Smile, CloudRain, Zap, Coffee, Sun, Moon, Sparkles, Shuffle, Trash2, ChevronDown, HelpCircle, ArrowLeft } from "lucide-react"

import { useToast } from "@/hooks/use-toast"

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
  const [isGettingStoryAssist, setIsGettingStoryAssist] = useState(false)
  const [isGettingStyleAssist, setIsGettingStyleAssist] = useState(false)
  const [isAddingStyle, setIsAddingStyle] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  
  // Add ref to track last click time to prevent rapid multiple clicks on mobile
  const lastClickTime = useRef<number>(0)

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
    // Prevent rapid multiple clicks on mobile (within 300ms)
    const now = Date.now()
    if (now - lastClickTime.current < 500) {
      return
    }
    lastClickTime.current = now
    
    // Set loading state to prevent multiple rapid clicks
    setIsAddingStyle(true)
    
    const newStyle = styleDescription ? `${styleDescription}, ${category}: ${value}` : `${category}: ${value}`
    setStyleDescription(newStyle)
    
    // Show success feedback
    toast({
      title: "Style Added",
      description: `"${category}: ${value}" has been added.`,
      duration: 1500,
    })
    
    // Reset loading state after a short delay
    setTimeout(() => {
      setIsAddingStyle(false)
    }, 200)
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
    // Validation
    const storyExists = story.trim().length > 0
    const storyValidLength = story.trim().length <= 250
    const styleExists = styleDescription.trim().length > 0
    const styleValidLength = styleDescription.trim().length <= 150
    const voiceValid = ["random", "male", "female"].includes(selectedVoice)
    

    
    // Check if all validations pass and show specific error messages
    if (!storyExists) {
      toast({
        title: "Story Required",
        description: "Please write a story before generating your song.",
        variant: "destructive",
      })
      return
    }
    
    if (!storyValidLength) {
      toast({
        title: "Story Too Long",
        description: "Your story must be 250 characters or less. Current length: " + story.trim().length,
        variant: "destructive",
      })
      return
    }
    
    if (!styleExists) {
      toast({
        title: "Style Required",
        description: "Please add a style description before generating your song.",
        variant: "destructive",
      })
      return
    }
    
    if (!styleValidLength) {
      toast({
        title: "Style Too Long",
        description: "Your style description must be 150 characters or less. Current length: " + styleDescription.trim().length,
        variant: "destructive",
      })
      return
    }
    
    if (!voiceValid) {
      toast({
        title: "Invalid Voice Selection",
        description: "Please select a valid voice: Random, Male, or Female.",
        variant: "destructive",
      })
      return
    }
    

    
    // Create and save generate task to localStorage
    const generateTask = {
      style: styleDescription.trim(),
      story: story.trim(),
      voice: selectedVoice,
      timestamp: Date.now(),
      taskId: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    
    localStorage.setItem('generateTask', JSON.stringify(generateTask))

    
    // Navigate to progress page
    router.push('/progress')
  }

  const handleStoryAssist = async () => {
    if (!story.trim()) {
      toast({
        title: "Story Required",
        description: "Please write a brief story first to get AI assistance.",
        variant: "destructive",
      })
      return
    }

    setIsGettingStoryAssist(true)
    
    try {
      const response = await fetch('/api/v1/assist-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: story }),
      })

      if (!response.ok) {
        throw new Error('Failed to get story assistance')
      }

      const data = await response.json()
      setStory(data.story)
      
      toast({
        title: "Story Enhanced!",
        description: "AI has helped enhance your story with creative details.",
      })
    } catch (error) {
      console.error('Error getting story assistance:', error)
      toast({
        title: "Error",
        description: "Failed to get AI assistance. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGettingStoryAssist(false)
    }
  }

  const handleStyleAssist = async () => {
    if (!styleDescription.trim()) {
      toast({
        title: "Style Required",
        description: "Please add some style content first to get AI assistance.",
        variant: "destructive",
      })
      return
    }

    setIsGettingStyleAssist(true)
    
    try {
      // If story exists, use it for context; if not, just enhance the existing style
      const query = story.trim() 
        ? `Story: ${story}\n\nCurrent Style: ${styleDescription}\n\nPlease enhance or refine the style based on the story context.`
        : `Current Style: ${styleDescription}\n\nPlease enhance and refine this style description to make it more inspiring and detailed.`
      
      const response = await fetch('/api/v1/assist-style', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error('Failed to get style assistance')
      }

      const data = await response.json()
      setStyleDescription(data.style)
      
      toast({
        title: "Style Enhanced!",
        description: story.trim() 
          ? "AI has enhanced your style description based on your story."
          : "AI has enhanced your style description to be more inspiring.",
      })
    } catch (error) {
      console.error('Error getting style assistance:', error)
      toast({
        title: "Error",
        description: "Failed to get AI assistance. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGettingStyleAssist(false)
    }
  }

  const isFormValid = story.trim().length > 0 && 
                     story.trim().length <= 250 && 
                     styleDescription.trim().length > 0 && 
                     styleDescription.trim().length <= 150 && 
                     ["random", "male", "female"].includes(selectedVoice)

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
                  className={`cursor-pointer hover:bg-primary/20 transition-colors text-sm py-2 px-3 touch-manipulation ${
                    isAddingStyle ? 'opacity-70 pointer-events-none' : ''
                  }`}
                  onClick={() => addToStyle("Instrument", instrument)}
                >
                  {instrument}
                </Badge>
              ))}
              {randomSuggestions.instrument.map((instrument) => (
                <Badge
                  key={instrument}
                  variant="outline"
                  className={`cursor-pointer hover:bg-primary/20 transition-colors text-sm py-2 px-3 touch-manipulation ${
                    isAddingStyle ? 'opacity-70 pointer-events-none' : ''
                  }`}
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
                  className={`cursor-pointer hover:bg-primary/20 transition-colors text-sm py-2 px-3 touch-manipulation ${
                    isAddingStyle ? 'opacity-70 pointer-events-none' : ''
                  }`}
                  onClick={() => addToStyle("Genre", genre)}
                >
                  {genre}
                </Badge>
              ))}
              {randomSuggestions.genre.map((genre) => (
                <Badge
                  key={genre}
                  variant="outline"
                  className={`cursor-pointer hover:bg-primary/20 transition-colors text-sm py-2 px-3 touch-manipulation ${
                    isAddingStyle ? 'opacity-70 pointer-events-none' : ''
                  }`}
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
                  className={`cursor-pointer hover:bg-primary/20 transition-colors text-sm py-2 px-3 touch-manipulation ${
                    isAddingStyle ? 'opacity-70 pointer-events-none' : ''
                  }`}
                  onClick={() => addToStyle("Mood", mood)}
                >
                  {mood}
                </Badge>
              ))}
              {randomSuggestions.mood.map((mood) => (
                <Badge
                  key={mood}
                  variant="outline"
                  className={`cursor-pointer hover:bg-primary/20 transition-colors text-sm py-2 px-3 touch-manipulation ${
                    isAddingStyle ? 'opacity-70 pointer-events-none' : ''
                  }`}
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
                  className={`cursor-pointer hover:bg-primary/20 transition-colors text-sm py-2 px-3 touch-manipulation ${
                    isAddingStyle ? 'opacity-70 pointer-events-none' : ''
                  }`}
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
      <div className="py-6">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

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
                <div className="space-y-4">
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
                    className="min-h-32 text-sm resize-y border-2 border-card-border focus:border-primary/50 transition-colors"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={handleStoryAssist}
                        disabled={isGettingStoryAssist}
                      >
                        <Sparkles className="w-4 h-4" />
                        {isGettingStoryAssist ? "Getting AI Help..." : "Inspired Story"}
                      </Button>
                      <div className="relative group">
                        <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                          Get AI assistance to enhance your story with creative details and emotional depth
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${story.length >= 250 ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                        {story.length}/250
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
                    onChange={(e) => setStyleDescription(e.target.value)}
                    className="min-h-20 text-sm resize-y border-2 border-card-border focus:border-primary/50 transition-colors"
                  />

                  {/* Action Buttons and Style Info */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={handleStyleAssist}
                          disabled={isGettingStyleAssist}
                        >
                          <Sparkles className="w-4 h-4" />
                          {isGettingStyleAssist ? "Getting AI Help..." : "Inspired Style"}
                        </Button>
                        <div className="relative group">
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                            Get AI assistance to enhance your existing style description. <br />
                            Add some style content first, then click for AI enhancement. <br />
                            Having a story makes the enhancement even better!
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      </div>
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
                      <span className={`text-xs ${styleDescription.length >= 150 ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                        {styleDescription.length}/150
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
                                        className={`cursor-pointer hover:bg-primary/20 transition-colors text-sm py-2 px-3 touch-manipulation ${
                                          isAddingStyle ? 'opacity-70 pointer-events-none' : ''
                                        }`}
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
                                        className={`cursor-pointer hover:bg-primary/20 transition-colors text-sm py-2 px-3 touch-manipulation ${
                                          isAddingStyle ? 'opacity-70 pointer-events-none' : ''
                                        }`}
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
                                        className={`cursor-pointer hover:bg-primary/20 transition-colors text-sm py-2 px-3 touch-manipulation ${
                                          isAddingStyle ? 'opacity-70 pointer-events-none' : ''
                                        }`}
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
                                        className={`cursor-pointer hover:bg-primary/20 transition-colors text-sm py-2 px-3 touch-manipulation ${
                                          isAddingStyle ? 'opacity-70 pointer-events-none' : ''
                                        }`}
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
                size="lg"
                className="text-lg px-12 py-6 w-full transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl"
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
              <p className="text-sm text-muted-foreground mt-3 font-medium">
                Click to generate your song. We'll validate everything and let you know if anything needs to be fixed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
