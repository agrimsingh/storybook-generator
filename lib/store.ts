import { create } from "zustand"

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
  thumbnailUrl?: string
}

type StoryState = {
  storyPrompt: StoryPrompt
  generatedStory: StorySegment[] | null
  setTitle: (title: string) => void
  setGenre: (genre: string) => void
  setMainCharacter: (character: string) => void
  setSetting: (setting: string) => void
  setMood: (mood: string) => void
  setTheme: (theme: string) => void
  resetStoryPrompt: () => void
  generateMockStory: () => void
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

  generateMockStory: () => {
    const { storyPrompt } = get()
    const { title, genre, mainCharacter, setting, mood, theme } = storyPrompt

    // Create a mock story with exactly 3 videos for 3 scenes
    const mockStory: StorySegment[] = [
      {
        type: "text",
        content: `In the ${setting || "mysterious land"}, there lived ${mainCharacter || "a protagonist"} who was about to embark on an unexpected journey. The air was filled with a ${mood || "strange"} feeling. Everyone could sense that something extraordinary was about to happen.`,
      },
      {
        type: "video",
        description: `Scene 1: Establishing shot of ${setting || "the setting"} with ${mood || "atmospheric"} music`,
        thumbnailUrl: "/placeholder.svg?height=400&width=600",
      },
      {
        type: "text",
        content: `${mainCharacter || "Our hero"} had always been fascinated by ${theme || "the unknown"}, but never imagined becoming so deeply involved with it. As the ${genre || "story"} unfolds, we discover that not everything is as it seems.`,
      },
      {
        type: "text",
        content: `The ${mood || "atmosphere"} intensifies when a mysterious stranger arrives with an unusual proposition. "I've been watching you for some time," the stranger said. "You have a unique connection to ${theme || "this matter"}. We need your help."`,
      },
      {
        type: "video",
        description: `Scene 2: The mysterious stranger approaches ${mainCharacter || "the protagonist"} with an offer that will change everything`,
        thumbnailUrl: "/placeholder.svg?height=400&width=600",
      },
      {
        type: "text",
        content: `${mainCharacter || "Our protagonist"} hesitated, knowing that accepting would change everything. But the allure of adventure was too strong to resist. "I'll do it," ${mainCharacter || "they"} said, not fully understanding what lay ahead.`,
      },
      {
        type: "text",
        content: `What follows is a tale of discovery, challenges, and ultimately transformation. Through the journey, ${mainCharacter || "our protagonist"} learns valuable lessons about ${theme || "life"} and finds unexpected allies along the way.`,
      },
      {
        type: "video",
        description: `Scene 3: The climactic moment where ${mainCharacter || "the hero"} faces their greatest challenge and emerges transformed`,
        thumbnailUrl: "/placeholder.svg?height=400&width=600",
      },
      {
        type: "text",
        content: `In the end, after facing numerous obstacles and moments of doubt, ${mainCharacter || "the hero"} emerges changed. The ${setting || "world"} would never be the same again, and neither would anyone who heard this ${genre || "tale"}.`,
      },
    ]

    set({ generatedStory: mockStory })
  },
}))
