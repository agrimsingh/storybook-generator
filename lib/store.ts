import { create } from "zustand"
import { generateStory } from "./actions"

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

type StoryState = {
  storyPrompt: StoryPrompt
  generatedStory: StorySegment[] | null
  isGenerating: boolean
  error: string | null
  setTitle: (title: string) => void
  setGenre: (genre: string) => void
  setMainCharacter: (character: string) => void
  setSetting: (setting: string) => void
  setMood: (mood: string) => void
  setTheme: (theme: string) => void
  resetStoryPrompt: () => void
  generateAIStory: () => Promise<void>
}

const initialStoryPrompt: StoryPrompt = {
  title: "",
  genre: "",
  mainCharacter: "",
  setting: "",
  mood: "",
  theme: "",
}

export const useStoryStore = create<StoryState>((set, get) => ({
  storyPrompt: initialStoryPrompt,
  generatedStory: null,
  isGenerating: false,
  error: null,

  setTitle: (title: string) =>
    set((state) => ({
      storyPrompt: { ...state.storyPrompt, title },
    })),

  setGenre: (genre: string) =>
    set((state) => ({
      storyPrompt: { ...state.storyPrompt, genre },
    })),

  setMainCharacter: (mainCharacter: string) =>
    set((state) => ({
      storyPrompt: { ...state.storyPrompt, mainCharacter },
    })),

  setSetting: (setting: string) =>
    set((state) => ({
      storyPrompt: { ...state.storyPrompt, setting },
    })),

  setMood: (mood: string) =>
    set((state) => ({
      storyPrompt: { ...state.storyPrompt, mood },
    })),

  setTheme: (theme: string) =>
    set((state) => ({
      storyPrompt: { ...state.storyPrompt, theme },
    })),

  resetStoryPrompt: () => set({ storyPrompt: initialStoryPrompt }),

  generateAIStory: async () => {
    const { storyPrompt } = get()

    set({ isGenerating: true, error: null })

    try {
      const story = await generateStory(storyPrompt)
      set({ generatedStory: story, isGenerating: false })
    } catch (error) {
      console.error("Failed to generate story:", error)
      set({
        error: "Failed to generate story. Please try again.",
        isGenerating: false,
      })
    }
  },
}))
