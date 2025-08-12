"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="h-9 w-9 p-0 relative overflow-hidden group"
    >
      <Moon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Sun className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 dark:from-blue-400 dark:to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity rounded-md" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
