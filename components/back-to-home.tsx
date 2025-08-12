"use client"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function BackToHome() {
  const router = useRouter()

  return (
    <Button
      onClick={() => router.push("/")}
      variant="ghost"
      className="fixed top-4 left-4 z-50 bg-purple-600/90 hover:bg-purple-700/90 text-white border border-purple-400/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back to Home
    </Button>
  )
}
