"use client";
import { Button } from "@/components/ui/button";
import { useStoryStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import VideoPlayer from "@/components/video-player";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import AnimatedReveal from "@/components/animated-reveal";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import NarratedText from "@/components/narrated-text";

export default function StoryPage() {
  const router = useRouter();
  const { storyPrompt, generatedStory, isGenerating, error, retryGeneration } =
    useStoryStore();

  const [loadingStep, setLoadingStep] = useState(0);
  const loadingMessages = [
    "Warming up the story engine...",
    "Generating Act 1 narrative...",
    "Directing the first scene (Video 1)...",
    "Generating Act 2 narrative...",
    "Directing the second scene (Video 2)...",
    "Generating Act 3 narrative...",
    "Directing the final scene (Video 3)...",
    "Finalizing the story...",
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isGenerating) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) =>
          prev < loadingMessages.length - 1 ? prev + 1 : prev
        );
      }, 2500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating, loadingMessages.length]);

  useEffect(() => {
    if (
      !isGenerating &&
      !generatedStory &&
      !error &&
      !storyPrompt.title &&
      !storyPrompt.genre &&
      !storyPrompt.mainCharacter
    ) {
      router.push("/");
    }
  }, [storyPrompt, router, isGenerating, generatedStory, error]);

  if (isGenerating) {
    const progressValue = (loadingStep / (loadingMessages.length - 1)) * 100;
    return (
      <div className="container mx-auto py-10 px-4 text-center flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="mb-4 text-lg">{loadingMessages[loadingStep]}</p>
        <Progress value={progressValue} className="w-full max-w-md mb-8" />
        <p className="text-sm text-muted-foreground">
          Generating your story... this may take a few minutes.
        </p>
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
            <h1 className="text-3xl font-bold relative inline-block">
              <span className="relative z-10">{storyPrompt.title || "YOUR STORYSPINNER TALE"}</span>
              <div className="absolute bottom-0 left-0 w-full h-2 bg-accent -z-0"></div>
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
                <NarratedText text={segment.content || ""} autoPlay />
              ) : (
                <VideoPlayer
                  title={
                    segment.description?.split(":")[0] ||
                    `Scene ${Math.floor(index / 3) + 1}`
                  }
                  description={segment.description?.split(":")[1]?.trim()}
                  videoUrl={segment.videoUrl}
                  autoPlay={true}
                  loop={true}
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
