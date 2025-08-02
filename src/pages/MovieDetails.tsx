import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Plus, Share, Star, Calendar, Clock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { VideoPlayer } from "@/components/VideoPlayer";
import { MovieGrid } from "@/components/MovieGrid";
import { WatchProviders } from "@/components/WatchProviders";
import { tmdbService, type MovieDetails, type Movie } from "@/services/tmdbApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    if (id) {
      loadMovieDetails(parseInt(id));
    }
  }, [id]);

  const loadMovieDetails = async (movieId: number) => {
    try {
      setLoading(true);
      
      // Load movie details
      const movieDetails = await tmdbService.getMovieDetails(movieId);
      setMovie(movieDetails);

      // Load similar movies
      const similar = await tmdbService.getSimilarMovies(movieId);
      setSimilarMovies(similar.results.slice(0, 12));

      // Try to get trailer
      const videos = await tmdbService.getMovieVideos(movieId);
      const trailer = videos.results.find(
        (video: any) => video.type === "Trailer" && video.site === "YouTube"
      );
      if (trailer) {
        setTrailerUrl(`https://www.youtube.com/watch?v=${trailer.key}`);
      }

    } catch (error) {
      console.error("Error loading movie details:", error);
      toast({
        title: "Error",
        description: "Failed to load movie details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlayMovie = () => {
    if (trailerUrl) {
      setShowPlayer(true);
    } else {
      toast({
        title: "Trailer not available",
        description: "This movie doesn't have a trailer available",
      });
    }
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16">
        {/* Hero Skeleton */}
        <div className="relative h-screen">
          <Skeleton className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent">
            <div className="container mx-auto px-4 h-full flex items-end pb-20">
              <div className="space-y-4 max-w-2xl">
                <Skeleton className="h-12 w-96" />
                <div className="flex gap-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-20 w-full" />
                <div className="flex gap-4">
                  <Skeleton className="h-12 w-32" />
                  <Skeleton className="h-12 w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
          <Button onClick={() => navigate("/")} variant="default">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "/placeholder.svg";

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder.svg";

  return (
    <div className="min-h-screen">
      {/* Video Player Modal */}
      {showPlayer && (
        <div className="fixed inset-0 z-50 bg-black">
          <VideoPlayer
            url={trailerUrl}
            title={movie.title}
            onClose={() => setShowPlayer(false)}
            autoPlay={true}
            poster={backdropUrl}
          />
        </div>
      )}

      {/* Hero Section */}
      <div className="relative h-screen">
        <img
          src={backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Back Button */}
        <Button
          variant="glass"
          size="icon"
          className="absolute top-20 left-4 z-10"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>

        {/* Movie Details */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-20">
            <div className="flex flex-col lg:flex-row gap-8 max-w-6xl">
              {/* Poster */}
              <div className="flex-shrink-0">
                <img
                  src={posterUrl}
                  alt={movie.title}
                  className="w-64 h-96 object-cover rounded-lg shadow-hero"
                />
              </div>

              {/* Info */}
              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                    {movie.title}
                  </h1>
                  {movie.tagline && (
                    <p className="text-xl text-secondary italic mb-4">
                      "{movie.tagline}"
                    </p>
                  )}
                </div>

                {/* Movie Meta */}
                <div className="flex flex-wrap items-center gap-4 text-white">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-current text-secondary" />
                    <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                    <span className="text-white/60">({movie.vote_count.toLocaleString()} votes)</span>
                  </div>
                  <Separator orientation="vertical" className="h-5 bg-white/30" />
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                  <Separator orientation="vertical" className="h-5 bg-white/30" />
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                  {movie.homepage && (
                    <>
                      <Separator orientation="vertical" className="h-5 bg-white/30" />
                      <a 
                        href={movie.homepage} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Website</span>
                      </a>
                    </>
                  )}
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Badge key={genre.id} variant="outline" className="border-white/30 text-white">
                      {genre.name}
                    </Badge>
                  ))}
                </div>

                {/* Overview */}
                <p className="text-lg text-white/90 leading-relaxed max-w-3xl">
                  {movie.overview}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                  <Button 
                    variant="hero" 
                    size="xl"
                    onClick={handlePlayMovie}
                    className="animate-glow-pulse"
                  >
                    <Play className="w-6 h-6 mr-2 fill-current" />
                    Watch Trailer
                  </Button>
                  
                  <Button variant="glass" size="xl">
                    <Plus className="w-6 h-6 mr-2" />
                    Add to List
                  </Button>
                  
                  <Button variant="ghost" size="xl" className="text-white border-white/30 hover:bg-white/10">
                    <Share className="w-6 h-6 mr-2" />
                    Share
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/80 text-sm">
                  {movie.budget > 0 && (
                    <div>
                      <span className="font-semibold">Budget:</span> {formatCurrency(movie.budget)}
                    </div>
                  )}
                  {movie.revenue > 0 && (
                    <div>
                      <span className="font-semibold">Revenue:</span> {formatCurrency(movie.revenue)}
                    </div>
                  )}
                  <div>
                    <span className="font-semibold">Status:</span> {movie.status}
                  </div>
                  <div>
                    <span className="font-semibold">Language:</span> {movie.original_language.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Watch Providers Section */}
      <div className="container mx-auto px-4 py-12">
        <WatchProviders movieId={movie.id} movieTitle={movie.title} />
      </div>

      {/* Similar Movies */}
      {similarMovies.length > 0 && (
        <MovieGrid
          title="More Like This"
          movies={similarMovies}
          onMovieClick={(movieId) => navigate(`/movie/${movieId}`)}
          showViewAll={false}
        />
      )}
    </div>
  );
}