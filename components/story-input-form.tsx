"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStoryStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import StoryPromptPreview from "./story-prompt-preview"
import { Loader2 } from "lucide-react"

export default function StoryInputForm() {
  const router = useRouter()
  const {
    storyPrompt,
    setTitle,
    setGenre,
    setMainCharacter,
    setSetting,
    setMood,
    setTheme,
    generateAIStory,
    isGenerating,
    error,
  } = useStoryStore()

  const handleGenerateStory = async () => {
    await generateAIStory()
    router.push("/story")
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create Your Story</CardTitle>
        <CardDescription>Fill in the details below to generate a custom story with videos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Story Title</Label>
          <Input
            id="title"
            placeholder="Enter a title for your story"
            value={storyPrompt.title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="genre">Genre</Label>
          <Select value={storyPrompt.genre} onValueChange={setGenre}>
            <SelectTrigger id="genre">
              <SelectValue placeholder="Select a genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fantasy">Fantasy</SelectItem>
              <SelectItem value="sci-fi">Science Fiction</SelectItem>
              <SelectItem value="mystery">Mystery</SelectItem>
              <SelectItem value="romance">Romance</SelectItem>
              <SelectItem value="adventure">Adventure</SelectItem>
              <SelectItem value="horror">Horror</SelectItem>
              <SelectItem value="comedy">Comedy</SelectItem>
              <SelectItem value="drama">Drama</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="main-character">Main Character</Label>
          <Input
            id="main-character"
            placeholder="Describe your main character"
            value={storyPrompt.mainCharacter}
            onChange={(e) => setMainCharacter(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="setting">Setting</Label>
          <Input
            id="setting"
            placeholder="Where does your story take place?"
            value={storyPrompt.setting}
            onChange={(e) => setSetting(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mood">Mood</Label>
          <Select value={storyPrompt.mood} onValueChange={setMood}>
            <SelectTrigger id="mood">
              <SelectValue placeholder="Select a mood" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="happy">Happy</SelectItem>
              <SelectItem value="sad">Sad</SelectItem>
              <SelectItem value="mysterious">Mysterious</SelectItem>
              <SelectItem value="tense">Tense</SelectItem>
              <SelectItem value="peaceful">Peaceful</SelectItem>
              <SelectItem value="chaotic">Chaotic</SelectItem>
              <SelectItem value="romantic">Romantic</SelectItem>
              <SelectItem value="nostalgic">Nostalgic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <Input
            id="theme"
            placeholder="What's the central theme of your story?"
            value={storyPrompt.theme}
            onChange={(e) => setTheme(e.target.value)}
          />
        </div>

        {error && <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">{error}</div>}

        <StoryPromptPreview />
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button variant="outline" className="ml-auto">
          Save Prompt
        </Button>
        <Button onClick={handleGenerateStory} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Story"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
