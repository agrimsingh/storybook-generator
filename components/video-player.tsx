"use client"
import { Play } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface VideoPlayerProps {
  title: string
  description?: string
}

export default function VideoPlayer({ title, description }: VideoPlayerProps) {
  return (
    <Card className="w-full overflow-hidden">
      <div className="relative aspect-video bg-muted cursor-pointer group">
        {/* Use a solid color background instead of trying to load an image */}
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <div className="text-gray-400 text-sm flex flex-col items-center">
            <span className="text-lg mb-2">[Video Placeholder]</span>
            <span>{title}</span>
          </div>
        </div>

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/60 rounded-full p-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
            <Play className="h-8 w-8 fill-white text-white" />
          </div>
        </div>

        {/* Video controls (non-functional) */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-24 h-1 bg-white/30 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-white rounded-full"></div>
              </div>
              <span className="text-white text-xs">0:00 / 2:30</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-white text-xs">HD</div>
              <div className="text-white text-xs">1x</div>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-medium mb-1">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}
