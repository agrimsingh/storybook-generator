import { create } from "zustand";
import { generateStory } from "./actions";

// Define the types directly in the store or import from actions
// Assuming types are defined in actions.ts - if not, define here
// type StoryPrompt = { ... };
// type StorySegment = { ... };

// Better: Import types if they are exported from actions.ts
import type { StoryPrompt, StorySegment } from "./actions";

interface StoryState {
  storyPrompt: StoryPrompt;
  generatedStory: StorySegment[] | null;
  isGenerating: boolean;
  error: string | null;
  setStoryPrompt: (prompt: StoryPrompt) => void;
  startGeneration: () => Promise<void>;
  retryGeneration: () => Promise<void>; // Add retry function
}

export const useStoryStore = create<StoryState>((set, get) => ({
  storyPrompt: {
    title: "",
    genre: "",
    mainCharacter: "",
    setting: "",
    mood: "",
    theme: "",
  },
  generatedStory: null,
  isGenerating: false,
  error: null,
  setStoryPrompt: (prompt) => set({ storyPrompt: prompt }),

  startGeneration: async () => {
    const prompt = get().storyPrompt;
    if (!prompt.title) return; // Basic validation

    set({ isGenerating: true, error: null, generatedStory: null });
    try {
      const story = await generateStory(prompt);
      set({ generatedStory: story, isGenerating: false });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      set({ error: errorMessage, isGenerating: false });
      console.error("Story generation failed in store:", err);
    }
  },

  retryGeneration: async () => {
    const prompt = get().storyPrompt;
    if (!prompt.title) {
      set({
        error: "Cannot retry without a valid prompt.",
        isGenerating: false,
      });
      return;
    }
    // Re-trigger generation with the existing prompt
    set({ isGenerating: true, error: null, generatedStory: null });
    try {
      const story = await generateStory(prompt);
      set({ generatedStory: story, isGenerating: false });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      set({ error: errorMessage, isGenerating: false });
      console.error("Story generation retry failed in store:", err);
    }
  },
}));
