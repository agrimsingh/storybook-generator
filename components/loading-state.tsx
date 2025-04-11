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
      <h2 className="text-2xl font-bold mb-6 relative inline-block">
        <span className="relative z-10">SPINNING YOUR STORY</span>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-accent -z-0"></div>
      </h2>
      
      <div className="flex items-center justify-center mb-8">
        <div className="bg-primary h-10 w-10 rounded-none animate-spin-slow"></div>
        <div className="bg-secondary h-10 w-10 rounded-none -ml-4 mt-4"></div>
        <div className="bg-accent h-10 w-10 rounded-full -ml-4 -mt-4"></div>
      </div>
      
      <p className="mb-4 text-lg font-medium">{loadingMessages[loadingStep]}</p>
      <Progress value={progressValue} className="w-full max-w-md mb-8 h-2 rounded-none bg-muted/50 border border-secondary" />
      <p className="text-sm text-muted-foreground">
        Your ideas are being spun into a living storybook—this may take a few minutes.
      </p>
    </div>
  );
}
