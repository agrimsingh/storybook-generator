"use client"
import { useStoryStore } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"

export default function StoryPromptPreview() {
  const { storyPrompt } = useStoryStore()
  const { title, genre, mainCharacter, setting, mood, theme } = storyPrompt

  // Only show the preview if at least some fields are filled
  const hasContent = title || genre || mainCharacter || setting || mood || theme

  if (!hasContent) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="p-4 text-muted-foreground italic text-sm">
          Your story preview will appear here as you fill in the form...
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-muted/50">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium mb-2">Story Preview:</h3>
        <p className="text-sm">
          {`${title ? `"${title}"` : "Your story"} will be a ${genre || "___"} 
          tale about ${mainCharacter || "___"} set in ${setting || "___"}. 
          The narrative will have a ${mood || "___"} atmosphere, 
          exploring the theme of ${theme || "___"}.`}
        </p>
      </CardContent>
    </Card>
  )
}
