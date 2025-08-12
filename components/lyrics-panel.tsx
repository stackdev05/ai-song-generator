"use client"

import { ScrollArea } from "@/components/ui/scroll-area"

interface LyricsPanelProps {
  lyrics: string[]
}

export function LyricsPanel({ lyrics }: LyricsPanelProps) {
  return (
    <ScrollArea className="h-96 w-full rounded-lg border bg-muted/30 p-6">
      <div className="space-y-4">
        {lyrics.map((line, index) => (
          <p
            key={index}
            className={`text-sm leading-relaxed transition-colors ${
              line.trim() === "" ? "h-4" : "text-foreground hover:text-primary"
            }`}
          >
            {line || "\u00A0"}
          </p>
        ))}
      </div>
    </ScrollArea>
  )
}
