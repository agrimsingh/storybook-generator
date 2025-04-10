"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Book, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Book className="h-6 w-6" />
          <Link href="/" className="text-lg font-semibold">
            Storybook Generator
          </Link>
        </div>

        <nav className="flex items-center gap-4">
          <Link href="/" passHref>
            <Button variant={pathname === "/" ? "default" : "ghost"} size="sm">
              <Home className="h-4 w-4 mr-2" />
              Create Story
            </Button>
          </Link>

          <Link href="/story" passHref>
            <Button variant={pathname === "/story" ? "default" : "ghost"} size="sm">
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
