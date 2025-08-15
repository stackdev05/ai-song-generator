"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface LyricsPanelProps {
  lyrics: string[]
}

export function LyricsPanel({ lyrics }: LyricsPanelProps) {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null)
  const { toast } = useToast()

  const copyLine = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: "Lyrics line copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      })
    }
  }

  return (
    <ScrollArea className="h-80 w-full rounded-md border border-border/50 p-4 bg-black/50 [&_.radix-scrollbar-thumb]:bg-muted-foreground/40 [&_.radix-scrollbar-thumb]:hover:bg-muted-foreground/60">
      <div className="space-y-3 text-center">
        {lyrics.map((line, index) => (
          <div
            key={index}
            className="group relative flex items-center justify-center gap-2"
            onMouseEnter={() => setHoveredLine(index)}
            onMouseLeave={() => setHoveredLine(null)}
          >
            <p
              className={`text-xl leading-relaxed transition-all duration-300 hover:scale-105 ${
                line.trim() === "" ? "h-4" : "text-white/80 hover:text-white"
              }`}
            >
              {line || "\u00A0"}
            </p>
            {hoveredLine === index && line.trim() !== "" && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-80 hover:opacity-100 transition-opacity text-white"
                onClick={() => copyLine(line)}
                title="Copy line"
              >
                <Copy className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
