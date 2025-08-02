import { useState } from "react";
import { Play, Star, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  id: number;
  title: string;
  poster: string;
  rating: number;
  year: string;
  duration?: string;
  genre?: string[];
  overview?: string;
  onClick?: () => void;
  className?: string;
  size?: "default" | "large" | "small";
}

export const MovieCard = ({
  id,
  title,
  poster,
  rating,
  year,
  duration,
  genre = [],
  overview,
  onClick,
  className,
  size = "default"
}: MovieCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    small: "w-40 h-56",
    default: "w-48 h-72", 
    large: "w-56 h-80"
  };

  const posterUrl = imageError 
    ? "/placeholder.svg" 
    : poster?.startsWith('http') 
      ? poster 
      : `https://image.tmdb.org/t/p/w500${poster}`;

  return (
    <div 
      className={cn(
        "group relative cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10",
        sizeClasses[size],
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Movie Poster */}
      <div className="relative w-full h-full rounded-lg overflow-hidden bg-muted/20 border border-border/20 shadow-card group-hover:shadow-glow">
        <img
          src={posterUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={() => setImageError(true)}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Rating Badge */}
        <div className="absolute top-2 right-2">
          <Badge className="bg-black/60 text-secondary border-0 backdrop-blur-sm">
            <Star className="w-3 h-3 mr-1 fill-current" />
            {rating.toFixed(1)}
          </Badge>
        </div>

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button variant="hero" size="lg" className="animate-glow-pulse">
            <Play className="w-6 h-6 mr-2 fill-current" />
            Watch Now
          </Button>
        </div>

        {/* Movie Info Overlay */}
        {isHovered && size !== "small" && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
            <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">{title}</h3>
            <div className="flex items-center gap-2 text-xs text-white/80 mb-2">
              <Calendar className="w-3 h-3" />
              <span>{year}</span>
              {duration && (
                <>
                  <Clock className="w-3 h-3 ml-2" />
                  <span>{duration}</span>
                </>
              )}
            </div>
            {genre.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {genre.slice(0, 2).map((g, index) => (
                  <Badge key={index} variant="secondary" className="text-xs py-0 px-2">
                    {g}
                  </Badge>
                ))}
              </div>
            )}
            {overview && size === "large" && (
              <p className="text-xs text-white/70 line-clamp-2">{overview}</p>
            )}
          </div>
        )}
      </div>

      {/* Movie Title (always visible for small cards) */}
      {(size === "small" || !isHovered) && (
        <div className="mt-2 px-1">
          <h3 className="font-medium text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="w-3 h-3 fill-current text-secondary" />
              {rating.toFixed(1)}
            </div>
            <span className="text-xs text-muted-foreground">{year}</span>
          </div>
        </div>
      )}
    </div>
  );
};