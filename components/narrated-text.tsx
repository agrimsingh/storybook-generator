import { useTextToSpeech } from "@/hooks/use-text-to-speech";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Square } from "lucide-react";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

interface NarratedTextProps {
  text: string;
  className?: string;
  autoPlay?: boolean;
}

export default function NarratedText({
  text,
  className = "",
  autoPlay = false,
}: NarratedTextProps) {
  const { play, stop, isPlaying, isLoading, error } = useTextToSpeech(text);
  const hasPlayedRef = useRef(false);
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(() => {
    if (autoPlay && inView && !hasPlayedRef.current) {
      play();
      hasPlayedRef.current = true;
    }
  }, [inView, autoPlay, play]);

  return (
    <div ref={ref} className={`relative group ${className}`}>
      <p className="text-lg leading-relaxed">{text}</p>
      <div className="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={isPlaying ? stop : play}
          disabled={isLoading}
          className="h-8 w-8"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isPlaying ? (
            <Square className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-2">
          Failed to generate narration: {error}
        </p>
      )}
    </div>
  );
}
