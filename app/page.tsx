"use client";
import StoryInputForm from "@/components/story-input-form";
import LoadingState from "@/components/loading-state";
import { useStoryStore } from "@/lib/store";
import StoryPromptPreview from "@/components/story-prompt-preview";

export default function Home() {
  const { isGenerating } = useStoryStore();

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="mb-10 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-3 relative inline-block">
          <span className="relative z-10">STORYSPINNER</span>
          <div className="absolute bottom-0 left-0 w-full h-3 bg-accent -z-0"></div>
        </h1>
        <p className="text-xl text-muted-foreground">Your ideas, spun into a living storybook—text, art, and voice, instantly.</p>
      </div>
      
      {isGenerating ? (
        <LoadingState className="min-h-[calc(100vh-10rem)]" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <div className="space-y-4">
            <div className="bg-secondary h-2 w-16 mb-6"></div>
            <StoryInputForm />
          </div>
          <div className="border-l-4 border-accent pl-6 pt-4">
            <div className="bg-primary h-2 w-16 mb-6"></div>
            <StoryPromptPreview />
          </div>
        </div>
      )}
    </main>
  );
}
