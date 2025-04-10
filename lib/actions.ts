"use server";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";

type StoryPrompt = {
  title: string;
  genre: string;
  mainCharacter: string;
  setting: string;
  mood: string;
  theme: string;
};

type StorySegment = {
  type: "text" | "video";
  content?: string;
  description?: string;
};

export async function generateStory(
  prompt: StoryPrompt
): Promise<StorySegment[]> {
  const { title, genre, mainCharacter, setting, mood, theme } = prompt;

  const aiPrompt = `You are a story generation AI. Generate a story based on the following parameters. Return ONLY a JSON array containing exactly three objects with 'content' fields. Do not include any markdown formatting, code blocks, or explanatory text.

Parameters:
- Title: ${title || "Untitled Story"}
- Genre: ${genre || "fantasy"}
- Main Character: ${mainCharacter || "a protagonist"}
- Setting: ${setting || "a mysterious land"}
- Mood: ${mood || "mysterious"}
- Theme: ${theme || "discovery"}

The story should be in three acts:
1. Setup - Introduce the character and setting
2. Confrontation - Present the main conflict
3. Resolution - Show how the character overcomes challenges

Example format (replace with actual story):
[{"content":"Act 1 content..."},{"content":"Act 2 content..."},{"content":"Act 3 content..."}]`;

  try {
    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      prompt: aiPrompt,
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Clean up the response - remove any markdown or code block formatting
    const cleanedText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .replace(/^\s*\[\n?/, "[")
      .replace(/\n?\]\s*$/, "]")
      .trim();

    const parsedResponse = JSON.parse(cleanedText);

    if (!Array.isArray(parsedResponse) || parsedResponse.length !== 3) {
      throw new Error("Invalid story format received");
    }

    // Convert the 3 acts into a story with interspersed video segments
    const storySegments: StorySegment[] = [];

    // Act 1
    storySegments.push({
      type: "text",
      content: parsedResponse[0].content,
    });

    // Video 1 - Setup
    storySegments.push({
      type: "video",
      description: `Scene 1: Establishing ${setting} and introducing ${mainCharacter}. The ${mood} atmosphere is evident as we see the character's daily life and the first hints of the upcoming adventure.`,
    });

    // Act 2
    storySegments.push({
      type: "text",
      content: parsedResponse[1].content,
    });

    // Video 2 - Confrontation
    storySegments.push({
      type: "video",
      description: `Scene 2: The major conflict unfolds. ${mainCharacter} faces significant challenges, with the ${mood} tone intensifying. The ${theme} becomes more apparent through visual storytelling.`,
    });

    // Act 3
    storySegments.push({
      type: "text",
      content: parsedResponse[2].content,
    });

    // Video 3 - Resolution
    storySegments.push({
      type: "video",
      description: `Scene 3: The climactic resolution. ${mainCharacter}'s journey reaches its peak, with the ${genre} elements and ${theme} coming together in a visually striking conclusion.`,
    });

    return storySegments;
  } catch (error) {
    console.error("Error generating story:", error);
    throw error;
  }
}
