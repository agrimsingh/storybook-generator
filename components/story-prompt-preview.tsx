"use client"
import { useStoryStore } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import AnimatedReveal from "./animated-reveal"

export default function StoryPromptPreview() {
  const { storyPrompt } = useStoryStore()
  const { title, genre, mainCharacter, setting, mood, theme } = storyPrompt

  // Only show the preview if at least some fields are filled
  const hasContent = title || genre || mainCharacter || setting || mood || theme

  if (!hasContent) {
    return (
      <Card className="bg-muted/50 border-0 rounded-none">
        <CardContent className="p-6 text-muted-foreground italic text-base">
          <h3 className="font-bold text-lg uppercase mb-4 tracking-tight">STORY PREVIEW</h3>
          <div className="flex gap-2 items-center mb-4">
            <div className="w-4 h-4 bg-primary"></div>
            <div className="w-4 h-4 bg-secondary"></div>
            <div className="w-4 h-4 bg-accent"></div>
          </div>
          Your story preview will appear here as you fill in the form...
        </CardContent>
      </Card>
    )
  }

  return (
    <AnimatedReveal>
      <Card className="bg-muted/50 border-0 rounded-none shadow-lg">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg uppercase mb-4 tracking-tight flex items-center">
            <span className="mr-2">STORY PREVIEW</span>
            <div className="h-1 bg-secondary flex-grow"></div>
          </h3>
          
          <div className="space-y-4">
            {title && (
              <div className="bg-primary/10 p-3 border-l-4 border-primary">
                <span className="font-bold">Title:</span> "{title}"
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              {genre && (
                <div className="bg-secondary/10 p-3 border-l-4 border-secondary">
                  <span className="font-bold">Genre:</span> {genre}
                </div>
              )}
              
              {mainCharacter && (
                <div className="bg-accent/10 p-3 border-l-4 border-accent">
                  <span className="font-bold">Character:</span> {mainCharacter}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {setting && (
                <div className="bg-secondary/10 p-3 border-l-4 border-secondary">
                  <span className="font-bold">Setting:</span> {setting}
                </div>
              )}
              
              {mood && (
                <div className="bg-accent/10 p-3 border-l-4 border-accent">
                  <span className="font-bold">Mood:</span> {mood}
                </div>
              )}
            </div>
            
            {theme && (
              <div className="bg-primary/10 p-3 border-l-4 border-primary">
                <span className="font-bold">Theme:</span> {theme}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </AnimatedReveal>
  )
}
