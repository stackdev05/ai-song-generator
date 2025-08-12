import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, PenTool, Music, Sparkles } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <header className="w-full py-4 px-4 flex-shrink-0">
        <div className="container mx-auto flex justify-end">
          <ModeToggle />
        </div>
      </header>

      {/* Hero Section - full screen height */}
      <section className="relative overflow-hidden flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Headline */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                Turn Your Story into a Song with AI
              </span>
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
              Transform your personal stories, memories, and experiences into beautiful, custom songs with AI-generated
              lyrics and melodies that capture your unique voice.
            </p>

            {/* CTA Button - added icon on the right */}
            <div className="mb-8">
              <Link href="/create">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  Generate Song Using AI
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>


          </div>
        </div>
      </section>

      {/* How It Works Section - positioned at bottom */}
      <section className="py-8 bg-gradient-to-b from-background to-secondary/10 flex-shrink-0">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-3">How It Works</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Create your personalized song in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {/* Step 1: Tell Your Story */}
            <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 border-[3px] border-card-border shadow-lg dark:shadow-white/5">
              <CardContent className="p-4 text-center">
                <div className="relative mb-3">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <PenTool className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 blur-lg group-hover:opacity-30 transition-opacity" />
                </div>
                <h3 className="text-lg font-semibold mb-2 font-playfair">Tell Your Story</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Share your personal story, memory, or experience. Our AI understands the emotions and themes that
                  matter to you.
                </p>
              </CardContent>
            </Card>

            {/* Step 2: Pick Style & Mood */}
            <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 border-[3px] border-card-border shadow-lg dark:shadow-white/5">
              <CardContent className="p-4 text-center">
                <div className="relative mb-3">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Music className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 blur-lg group-hover:opacity-30 transition-opacity" />
                </div>
                <h3 className="text-lg font-semibold mb-2 font-playfair">Pick Style & Mood</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Choose your preferred musical genre and emotional tone. From upbeat pop to soulful ballads, we've got
                  you covered.
                </p>
              </CardContent>
            </Card>

            {/* Step 3: Get Your Song */}
            <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 border-[3px] border-card-border shadow-lg dark:shadow-white/5">
              <CardContent className="p-4 text-center">
                <div className="relative mb-3">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-r from-pink-500 to-blue-500 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full opacity-20 blur-lg group-hover:opacity-30 transition-opacity" />
                </div>
                <h3 className="text-lg font-semibold mb-2 font-playfair">Get Your Song</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Receive your custom AI-generated song with personalized lyrics, melody, and vocals that bring your
                  story to life.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


    </div>
  )
}
