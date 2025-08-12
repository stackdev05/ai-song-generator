"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

export function PageHeader() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="w-full bg-background/80 backdrop-blur-sm border-b border-border/50 py-3 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-sm font-medium">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
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
  )
}
