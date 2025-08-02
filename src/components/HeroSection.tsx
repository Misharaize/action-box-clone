import { useState, useEffect } from "react";
import { Play, Info, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

interface HeroSectionProps {
  movies?: Movie[];
  onPlayMovie?: (movieId: number) => void;
  onInfoMovie?: (movieId: number) => void;
}

const genres: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

export const HeroSection = ({ movies = [], onPlayMovie, onInfoMovie }: HeroSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Sample featured movies if none provided
  const featuredMovies = movies.length > 0 ? movies.slice(0, 5) : [
    {
      id: 1,
      title: "John Wick: Chapter 4",
      overview: "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe.",
      backdrop_path: "/rMvPXy8PUjj1o8o1pzgQbdNCsvj.jpg",
      poster_path: "/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
      vote_average: 7.8,
      release_date: "2023-03-24",
      genre_ids: [28, 53, 80]
    },
    {
      id: 2,
      title: "Fast X",
      overview: "Over many missions and against impossible odds, Dom Toretto and his family have outsmarted, out-nerved and outdriven every foe in their path. Now, they confront the most lethal opponent they've ever faced.",
      backdrop_path: "/4XM8DUTQb3lhLemJC51Jx4a2EuA.jpg",
      poster_path: "/fiVW06jE7z9YnO4trhaMEdclSiC.jpg",
      vote_average: 7.2,
      release_date: "2023-05-19",
      genre_ids: [28, 80, 53]
    }
  ];

  const currentMovie = featuredMovies[currentIndex] || featuredMovies[0];

  useEffect(() => {
    if (featuredMovies.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
        setImageError(false);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [featuredMovies.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    setImageError(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
    setImageError(false);
  };

  const backdropUrl = imageError 
    ? "/placeholder.svg"
    : currentMovie?.backdrop_path?.startsWith('http')
      ? currentMovie.backdrop_path
      : `https://image.tmdb.org/t/p/original${currentMovie?.backdrop_path}`;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={backdropUrl}
          alt={currentMovie?.title}
          className="w-full h-full object-cover transition-transform duration-1000 scale-110"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-2xl animate-fade-in">
            {/* Movie Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
              {currentMovie?.title}
            </h1>

            {/* Movie Details */}
            <div className="flex items-center gap-4 mb-6">
              <Badge className="bg-secondary/90 text-secondary-foreground border-0">
                ⭐ {currentMovie?.vote_average?.toFixed(1)}
              </Badge>
              <span className="text-white/80">
                {new Date(currentMovie?.release_date).getFullYear()}
              </span>
              <div className="flex gap-2">
                {currentMovie?.genre_ids?.slice(0, 3).map((genreId) => (
                  <Badge key={genreId} variant="outline" className="border-white/30 text-white">
                    {genres[genreId]}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Overview */}
            <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-xl">
              {currentMovie?.overview}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => onPlayMovie?.(currentMovie?.id)}
                className="animate-glow-pulse"
              >
                <Play className="w-6 h-6 mr-2 fill-current" />
                Watch Now
              </Button>
              
              <Button 
                variant="glass" 
                size="xl"
                onClick={() => onInfoMovie?.(currentMovie?.id)}
              >
                <Info className="w-6 h-6 mr-2" />
                More Info
              </Button>
              
              <Button variant="ghost" size="xl" className="text-white border-white/30 hover:bg-white/10">
                <Plus className="w-6 h-6 mr-2" />
                My List
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {featuredMovies.length > 1 && (
        <>
          <Button
            variant="glass"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20"
            onClick={prevSlide}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <Button
            variant="glass"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20"
            onClick={nextSlide}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* Slide Indicators */}
      {featuredMovies.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-primary w-8' : 'bg-white/40'
              }`}
              onClick={() => {
                setCurrentIndex(index);
                setImageError(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};