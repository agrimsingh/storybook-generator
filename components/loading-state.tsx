import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface LoadingStateProps {
  className?: string;
}

export default function LoadingState({ className = "" }: LoadingStateProps) {
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
    const interval = setInterval(() => {
      setLoadingStep((prev) =>
        prev < loadingMessages.length - 1 ? prev + 1 : prev
      );
    }, 2500);
    return () => clearInterval(interval);
  }, [loadingMessages.length]);

  const progressValue = (loadingStep / (loadingMessages.length - 1)) * 100;

  return (
    <div
      className={`text-center flex flex-col items-center justify-center ${className}`}
    >
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
      <p className="mb-4 text-lg">{loadingMessages[loadingStep]}</p>
      <Progress value={progressValue} className="w-full max-w-md mb-8" />
      <p className="text-sm text-muted-foreground">
        Generating your story... this may take a few minutes.
      </p>
    </div>
  );
}
