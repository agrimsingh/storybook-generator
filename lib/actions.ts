"use server"

import { generateText } from "ai"
import { google } from "@ai-sdk/google"

type StoryPrompt = {
  title: string
  genre: string
  mainCharacter: string
  setting: string
  mood: string
  theme: string
}

type StorySegment = {
  type: "text" | "video"
  content?: string
  description?: string
}

export async function generateStory(prompt: StoryPrompt): Promise<StorySegment[]> {
  try {
    const { title, genre, mainCharacter, setting, mood, theme } = prompt

    // Create a detailed prompt for the AI
    const aiPrompt = `
      Create a short story with the following characteristics:
      - Title: ${title || "Untitled Story"}
      - Genre: ${genre || "fantasy"}
      - Main Character: ${mainCharacter || "a protagonist"}
      - Setting: ${setting || "a mysterious land"}
      - Mood: ${mood || "mysterious"}
      - Theme: ${theme || "discovery"}

      The story should have exactly 3 distinct scenes that would work well as videos.
      
      Format your response as a JSON array with the following structure:
      [
        {"type": "text", "content": "First paragraph of text..."},
        {"type": "video", "description": "Scene 1: Description of the first video scene"},
        {"type": "text", "content": "Next paragraph of text..."},
        {"type": "text", "content": "Another paragraph of text..."},
        {"type": "video", "description": "Scene 2: Description of the second video scene"},
        {"type": "text", "content": "More text..."},
        {"type": "video", "description": "Scene 3: Description of the final video scene"},
        {"type": "text", "content": "Concluding paragraph..."}
      ]

      IMPORTANT: Do not include any URLs, image data, or video data in your response. The video segments should only contain a text description of what the video would show. Do not include thumbnailUrl or any other media-related properties in your JSON.
    `

    // Generate the story using Gemini model
    const { text } = await generateText({
      model: google("gemini-2.0-pro"),
      prompt: aiPrompt,
      temperature: 0.7,
    })

    // Parse the response as JSON
    let storySegments: StorySegment[]
    try {
      // Parse the JSON response
      const parsedResponse = JSON.parse(text)

      // Filter out any unexpected properties that might cause issues
      storySegments = parsedResponse.map((segment: any) => ({
        type: segment.type,
        content: segment.type === "text" ? segment.content : undefined,
        description: segment.type === "video" ? segment.description : undefined,
      }))

      // Validate that we have exactly 3 video segments
      const videoCount = storySegments.filter((segment) => segment.type === "video").length
      if (videoCount !== 3) {
        console.warn(`Expected 3 video segments, but got ${videoCount}. Using fallback story.`)
        return createMockStory(prompt)
      }
    } catch (error) {
      console.error("Failed to parse AI response:", error)
      // Fallback to a simple structure if parsing fails
      return createMockStory(prompt)
    }

    return storySegments
  } catch (error) {
    console.error("Error generating story:", error)
    return createMockStory(prompt)
  }
}

// Create a mock story with exactly 3 video segments
function createMockStory(prompt: StoryPrompt): StorySegment[] {
  const { title, genre, mainCharacter, setting, mood, theme } = prompt

  return [
    {
      type: "text",
      content: `In the ${setting || "mysterious land"} of ${title || "our story"}, there lived ${mainCharacter || "a protagonist"} who was about to embark on an unexpected journey. The air was filled with a ${mood || "strange"} feeling. Everyone could sense that something extraordinary was about to happen.`,
    },
    {
      type: "video",
      description: `Scene 1: Establishing shot of ${setting || "the setting"} with ${mood || "atmospheric"} music. The camera pans across the landscape, eventually focusing on ${mainCharacter || "our protagonist"} going about their daily routine.`,
    },
    {
      type: "text",
      content: `${mainCharacter || "Our hero"} had always been fascinated by ${theme || "the unknown"}, but never imagined becoming so deeply involved with it. As the ${genre || "story"} unfolds, we discover that not everything is as it seems. The ${mood || "atmosphere"} intensifies when a mysterious stranger arrives with an unusual proposition.`,
    },
    {
      type: "text",
      content: `"I've been watching you for some time," the stranger said. "You have a unique connection to ${theme || "this matter"}. We need your help." ${mainCharacter || "Our protagonist"} hesitated, knowing that accepting would change everything.`,
    },
    {
      type: "video",
      description: `Scene 2: The mysterious stranger approaches ${mainCharacter || "the protagonist"} in a dimly lit setting. Their conversation is tense, with close-up shots capturing the emotional reactions as the proposition is made. The music builds tension throughout the scene.`,
    },
    {
      type: "text",
      content: `Despite the risks, ${mainCharacter || "our hero"} accepted the challenge. The journey would take them through uncharted territories, facing dangers that would test not just their courage, but their understanding of ${theme || "reality"} itself.`,
    },
    {
      type: "text",
      content: `What follows is a tale of discovery, challenges, and ultimately transformation. Through the journey, ${mainCharacter || "our protagonist"} learns valuable lessons about ${theme || "life"} and finds unexpected allies along the way.`,
    },
    {
      type: "video",
      description: `Scene 3: The climactic moment where ${mainCharacter || "the hero"} faces their greatest challenge. The scene is visually stunning with dramatic lighting and intense action. As they overcome the obstacle, there's a visible transformation in their demeanor, symbolizing their growth throughout the story.`,
    },
    {
      type: "text",
      content: `In the end, after facing numerous obstacles and moments of doubt, ${mainCharacter || "the hero"} emerges changed. The ${setting || "world"} would never be the same again, and neither would anyone who heard this ${genre || "tale"}. As they looked toward the horizon, they knew this was not an end, but a beginning.`,
    },
  ]
}
