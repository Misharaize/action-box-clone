import { useState } from "react";
import { Play, Pause, X, Volume2, VolumeX, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  url: string;
  title: string;
  onClose?: () => void;
  autoPlay?: boolean;
  poster?: string;
}

export const VideoPlayer = ({ 
  url, 
  title, 
  onClose, 
  autoPlay = false,
  poster 
}: VideoPlayerProps) => {
  const [showControls, setShowControls] = useState(true);

  // For demo purposes, we'll show a video placeholder with controls
  // In production, you would integrate with your preferred video player
  const videoUrl = url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  return (
    <div className="relative w-full h-full bg-black">
      {/* Video Element */}
      <video
        className="w-full h-full object-cover"
        controls={false}
        autoPlay={autoPlay}
        poster={poster}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <source src={videoUrl} type="video/mp4" />
        <p className="text-white p-4">Your browser doesn't support video playback.</p>
      </video>

      {/* Controls Overlay */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
        onMouseEnter={() => setShowControls(true)}
      >
        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
          {onClose && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>
          )}
        </div>

        {/* Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="hero"
            size="xl"
            className="animate-glow-pulse bg-primary/20 backdrop-blur-sm"
          >
            <Play className="w-12 h-12 fill-current" />
          </Button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Play className="w-6 h-6 fill-current" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Volume2 className="w-6 h-6" />
              </Button>
              <span className="text-sm">0:00 / 2:30</span>
            </div>
            
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Maximize className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Demo Message */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 text-white">
          <p className="text-lg font-semibold mb-2">Video Player Demo</p>
          <p className="text-sm opacity-80">In production, integrate with your video streaming service</p>
        </div>
      </div>
    </div>
  );
};