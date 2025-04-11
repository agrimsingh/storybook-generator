"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Book, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-b-accent bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        {/* Bauhaus-inspired logo with geometric shapes */}
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <div className="bg-primary h-8 w-8 rounded-none animate-spin-slow"></div>
            <div className="bg-secondary h-8 w-8 rounded-none -ml-3 mt-3"></div>
            <div className="bg-accent h-8 w-8 rounded-full -ml-3 -mt-3"></div>
          </div>
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight">
              STORYSPINNER
            </Link>
            <p className="text-xs text-muted-foreground leading-tight max-w-[200px]">Your ideas, spun into a living storybook</p>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <Link href="/" passHref>
            <Button 
              variant={pathname === "/" ? "default" : "outline"} 
              size="sm"
              className="rounded-none" // Sharp corners
            >
              <Home className="h-4 w-4 mr-2" />
              Create Story
            </Button>
          </Link>

          <Link href="/story" passHref>
            <Button 
              variant={pathname === "/story" ? "secondary" : "outline"} 
              size="sm"
              className="rounded-none" // Sharp corners
            >
              <Book className="h-4 w-4 mr-2" />
              View Story
            </Button>
          </Link>

          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
