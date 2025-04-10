"use client";
import { Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface VideoPlayerProps {
  title: string;
  description?: string;
  videoUrl?: string;
}

export default function VideoPlayer({
  title,
  description,
  videoUrl,
}: VideoPlayerProps) {
  return (
    <Card className="w-full overflow-hidden">
      <div className="relative aspect-video bg-muted cursor-pointer group">
        {videoUrl ? (
          <video
            className="w-full h-full object-cover"
            controls
            src={videoUrl}
            poster="/video-placeholder.png"
          />
        ) : (
          <>
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <div className="text-gray-400 text-sm flex flex-col items-center">
                <span className="text-lg mb-2">[Video Loading...]</span>
                <span>{title}</span>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/60 rounded-full p-4 opacity-80">
                <Play className="h-8 w-8 fill-white text-white" />
              </div>
            </div>
          </>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-medium mb-1">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
