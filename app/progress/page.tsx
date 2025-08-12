"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Check, FileText, Music, Sparkles } from "lucide-react"
import { PageHeader } from "@/components/page-header"

const steps = [
  {
    id: "processing",
    title: "Processing Story",
    description: "Analyzing your story for themes and emotions",
    icon: FileText,
    duration: 3000,
  },
  {
    id: "lyrics",
    title: "Creating Lyrics",
    description: "Crafting personalized lyrics from your narrative",
    icon: Sparkles,
    duration: 4000,
  },
  {
    id: "music",
    title: "Composing Music",
    description: "Generating melody and arrangement",
    icon: Music,
    duration: 5000,
  },
]

export default function ProgressPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const processSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i)

        const startProgress = (i / steps.length) * 100
        const endProgress = ((i + 1) / steps.length) * 100
        const stepDuration = steps[i].duration

        // Animate progress for current step
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            const increment = (endProgress - startProgress) / (stepDuration / 100)
            const newProgress = prev + increment

            if (newProgress >= endProgress) {
              clearInterval(progressInterval)
              return endProgress
            }
            return newProgress
          })
        }, 100)

        // Wait for step to complete
        await new Promise((resolve) => setTimeout(resolve, stepDuration))

        // Mark step as completed
        setCompletedSteps((prev) => [...prev, i])
        clearInterval(progressInterval)
      }

      // Wait a moment before redirecting
      setTimeout(() => {
        router.push("/result")
      }, 1500)
    }

    processSteps()
  }, [router])

  return (
    <div className="flex flex-col">
      <PageHeader />

      <div className="py-8 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="bg-gradient-to-br from-card to-card/50 border-[2px] border-card-border shadow-lg dark:shadow-white/5 backdrop-blur-sm">
            <CardContent className="p-8">
              {/* Header - reduced margin from mb-12 to mb-8 */}
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Creating Your Song
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground">Our AI is working its magic on your story</p>
              </div>

              {/* Progress Bar - reduced margin from mb-12 to mb-8 */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3 bg-secondary" />
              </div>

              {/* Steps - reduced spacing from space-y-8 to space-y-6 */}
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
                      {/* Step Icon - reduced size from w-16 h-16 to w-14 h-14 */}
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

              {/* Loading Animation - reduced margin from mt-12 to mt-8 */}
              <div className="mt-8 text-center">
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
                <p className="text-sm text-muted-foreground mt-4">This usually takes 10-15 seconds</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
