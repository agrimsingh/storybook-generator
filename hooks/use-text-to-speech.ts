import { useState, useEffect, useRef } from "react";
import { generateSpeech } from "@/lib/elevenlabs";

export function useTextToSpeech(text: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup audio URL on unmount
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, []);

  const play = async () => {
    try {
      setError(null);

      // If audio is already loaded, just play it
      if (audioRef.current && audioUrlRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
        return;
      }

      setIsLoading(true);
      const audioData = await generateSpeech(text);
      const blob = new Blob([audioData], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);

      // Create new audio element
      const audio = new Audio(url);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setError("Failed to play audio");
        setIsPlaying(false);
      };

      audioRef.current = audio;
      audioUrlRef.current = url;

      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate speech"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return {
    play,
    stop,
    isPlaying,
    isLoading,
    error,
  };
}
