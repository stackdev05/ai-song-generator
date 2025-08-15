"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Music, Plus, BarChart3 } from "lucide-react"
import { useTheme } from "next-themes"

export function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="w-full bg-background/80 backdrop-blur-sm border-b border-border/50 py-3 px-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.jpg"
            alt="AI2Song Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI2Song
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/create">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 relative overflow-hidden group"
              title="Create Song"
            >
              <Plus className="h-4 w-4 transition-all group-hover:scale-110" />
              <span className="sr-only">Create song</span>
            </Button>
          </Link>
          
          <Link href="/progress">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 relative overflow-hidden group"
              title="Progress"
            >
              <BarChart3 className="h-4 w-4 transition-all group-hover:scale-110" />
              <span className="sr-only">View progress</span>
            </Button>
          </Link>
          
          <Link href="/result">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 relative overflow-hidden group"
              title="Results"
            >
              <Music className="h-4 w-4 transition-all group-hover:scale-110" />
              <span className="sr-only">Go to results</span>
            </Button>
          </Link>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="h-9 w-9 p-0 relative overflow-hidden group"
          >
            <Moon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Sun className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
