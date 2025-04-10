"use client";
import { Button } from "@/components/ui/button";
import { useStoryStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import VideoPlayer from "@/components/video-player";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import AnimatedReveal from "@/components/animated-reveal";
import { useEffect } from "react";

export default function StoryPage() {
  const router = useRouter();
  const { storyPrompt, generatedStory, isGenerating, error, retryGeneration } =
    useStoryStore();

  useEffect(() => {
    // If there's no story prompt, redirect back to input
    if (
      !storyPrompt.title &&
      !storyPrompt.genre &&
      !storyPrompt.mainCharacter
    ) {
      router.push("/");
    }
  }, [storyPrompt, router]);

  if (isGenerating) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Generating your story...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <div className="space-x-4">
          <Button onClick={() => retryGeneration()} className="mr-2">
            Try Again
          </Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            Return to Story Creator
          </Button>
        </div>
      </div>
    );
  }

  if (!generatedStory) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p>No story has been generated yet.</p>
        <Button onClick={() => router.push("/")} className="mt-4">
          Return to Story Creator
        </Button>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <AnimatedReveal>
            <h1 className="text-3xl font-bold">
              {storyPrompt.title || "Your Generated Story"}
            </h1>
          </AnimatedReveal>
          <AnimatedReveal delay={0.2} direction="left">
            <Link href="/" passHref>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Input
              </Button>
            </Link>
          </AnimatedReveal>
        </div>

        <div className="flex flex-col gap-8">
          {generatedStory.map((segment, index) => (
            <AnimatedReveal
              key={index}
              delay={0.2 + index * 0.15}
              direction={segment.type === "video" ? "right" : "up"}
              className={segment.type === "text" ? "prose max-w-none" : ""}
            >
              {segment.type === "text" ? (
                <p className="text-lg leading-relaxed">{segment.content}</p>
              ) : (
                <VideoPlayer
                  title={
                    segment.description?.split(":")[0] ||
                    `Scene ${Math.floor(index / 3) + 1}`
                  }
                  description={segment.description?.split(":")[1]?.trim()}
                />
              )}
            </AnimatedReveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <AnimatedReveal delay={0.5 + generatedStory.length * 0.15}>
            <Link href="/" passHref>
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Story Input
              </Button>
            </Link>
          </AnimatedReveal>
        </div>
      </div>
    </main>
  );
}
