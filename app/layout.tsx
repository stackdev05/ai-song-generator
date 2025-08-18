import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Story Chord - Turn Your Story into Music",
  description: "Transform your personal stories into beautiful AI-generated songs with custom lyrics and melodies.",
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange={false}>
          <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 relative overflow-hidden flex flex-col">
            <div className="fixed inset-0 pointer-events-none z-0">
              <div className="stars-container">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={`star-${i}`}
                    className="star"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${-10 + Math.random() * 20}%`,
                      animationDelay: `${Math.random() * 5}s`,
                      animationDuration: `${4 + Math.random() * 3}s`,
                    }}
                  />
                ))}
              </div>
              <div className="bubbles-container">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={`bubble-${i}`}
                    className="bubble"
                    style={{
                      left: `${Math.random() * 100}%`,
                      bottom: `${-10 + Math.random() * 20}%`,
                      animationDelay: `${Math.random() * 8}s`,
                      animationDuration: `${6 + Math.random() * 4}s`,
                    }}
                  />
                ))}
              </div>
              
              {/* Floating Elements for Visual Interest */}
              <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl animate-float" />
              <div
                className="absolute top-40 right-10 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl animate-float"
                style={{ animationDelay: "1s" }}
              />
              <div
                className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full opacity-20 blur-xl animate-float"
                style={{ animationDelay: "2s" }}
              />
            </div>
            
            {/* Header - appears on every page */}
            <Header />
            
            {/* Main content */}
            <main className="relative z-10 flex-1 pt-0">{children}</main>
            
            {/* Footer - appears on every page */}
            <footer className="py-4 border-t border-border/50 flex-shrink-0 relative z-10">
              <div className="container mx-auto px-4 text-center">
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Story Chord. Made with ❤️ for storytellers everywhere.
                </p>
              </div>
            </footer>
            
            {/* Toast notifications */}
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
