import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { MovieGrid } from "@/components/MovieGrid";
import { tmdbService, type Movie } from "@/services/tmdbApi";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      
      // Load all movie categories in parallel
      const [popular, topRated, trending] = await Promise.all([
        tmdbService.getPopularMovies(),
        tmdbService.getTopRatedMovies(),
        tmdbService.getTrendingMovies(),
      ]);

      setPopularMovies(popular.results);
      setTopRatedMovies(topRated.results);
      setTrendingMovies(trending.results);
      
      // Use trending movies for featured section
      setFeaturedMovies(trending.results.slice(0, 5));
      
    } catch (error) {
      console.error("Error loading movies:", error);
      toast({
        title: "Error",
        description: "Failed to load movies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header onSearch={handleSearch} />

      {/* Hero Section */}
      <HeroSection
        movies={featuredMovies}
        onPlayMovie={handleMovieClick}
        onInfoMovie={handleMovieClick}
      />

      {/* Movie Sections */}
      <div className="relative z-10 -mt-32">
        <MovieGrid
          title="Trending Now"
          movies={trendingMovies.slice(0, 12)}
          loading={loading}
          onMovieClick={handleMovieClick}
          onViewAll={() => navigate("/trending")}
        />

        <MovieGrid
          title="Popular Movies"
          movies={popularMovies.slice(0, 12)}
          loading={loading}
          onMovieClick={handleMovieClick}
          onViewAll={() => navigate("/popular")}
        />

        <MovieGrid
          title="Top Rated"
          movies={topRatedMovies.slice(0, 12)}
          loading={loading}
          onMovieClick={handleMovieClick}
          onViewAll={() => navigate("/top-rated")}
        />
      </div>

      {/* Footer */}
      <footer className="bg-card/50 backdrop-blur-sm border-t border-border/20 py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">AB</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ACTION BOX
              </span>
            </div>
            <div className="text-muted-foreground text-sm">
              © 2024 Action Box. Your ultimate movie streaming destination.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
