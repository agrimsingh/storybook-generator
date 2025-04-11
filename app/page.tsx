"use client";
import StoryInputForm from "@/components/story-input-form";
import LoadingState from "@/components/loading-state";
import { useStoryStore } from "@/lib/store";

export default function Home() {
  const { isGenerating } = useStoryStore();

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Storybook Generator
      </h1>
      {isGenerating ? (
        <LoadingState className="min-h-[calc(100vh-10rem)]" />
      ) : (
        <StoryInputForm />
      )}
    </main>
  );
}
