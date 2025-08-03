import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { MovieGrid } from "@/components/MovieGrid";
import { tmdbService, type Movie } from "@/services/tmdbApi";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CategoryMovies = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categoryTitles: { [key: string]: string } = {
    trending: "Trending Movies",
    popular: "Popular Movies",
    "top-rated": "Top Rated Movies",
    upcoming: "Upcoming Movies",
    "now-playing": "Now Playing",
  };

  useEffect(() => {
    loadMovies(1);
  }, [category]);

  const loadMovies = async (page: number) => {
    if (!category) return;

    try {
      setLoading(true);
      let response;

      switch (category) {
        case 'trending':
          response = await tmdbService.getTrendingMovies();
          break;
        case 'popular':
          response = await tmdbService.getPopularMovies(page);
          break;
        case 'top-rated':
          response = await tmdbService.getTopRatedMovies(page);
          break;
        case 'upcoming':
          response = await tmdbService.getUpcomingMovies(page);
          break;
        case 'now-playing':
          response = await tmdbService.getNowPlayingMovies(page);
          break;
        default:
          response = await tmdbService.getPopularMovies(page);
      }

      setMovies(response.results);
      setTotalPages(Math.min(response.total_pages, 500)); // TMDB API limit
      setCurrentPage(page);
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

  const handlePrevPage = () => {
    if (currentPage > 1) {
      loadMovies(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      loadMovies(currentPage + 1);
    }
  };

  const handleSearch = async (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen">
      <Header onSearch={handleSearch} />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {categoryTitles[category || 'popular'] || 'Movies'}
          </h1>
          <p className="text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
        </div>

        <MovieGrid
          title=""
          movies={movies}
          loading={loading}
          onMovieClick={handleMovieClick}
          showViewAll={false}
        />

        {/* Pagination */}
        {!loading && movies.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <span className="text-muted-foreground px-4">
              {currentPage} / {totalPages}
            </span>
            
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryMovies;