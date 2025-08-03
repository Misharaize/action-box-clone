import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { MovieGrid } from "@/components/MovieGrid";
import { tmdbService, type Movie } from "@/services/tmdbApi";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Filter } from "lucide-react";

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      handleSearch(searchQuery);
    }
  }, [searchParams]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const results = await tmdbService.searchMovies(searchQuery);
      setMovies(results.results);
      setTotalResults(results.total_results);
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Error",
        description: "Failed to search movies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen">
      <Header onSearch={() => {}} />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Search Movies
          </h1>
          
          <form onSubmit={handleSearchSubmit} className="flex gap-4 max-w-2xl">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-8">
              Search
            </Button>
          </form>
        </div>

        {/* Results */}
        {totalResults > 0 && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              Found {totalResults.toLocaleString()} results for "{searchParams.get('q')}"
            </p>
          </div>
        )}

        <MovieGrid
          title=""
          movies={movies}
          loading={loading}
          onMovieClick={handleMovieClick}
          showViewAll={false}
        />

        {!loading && movies.length === 0 && query && (
          <div className="text-center py-16">
            <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No movies found</h3>
            <p className="text-muted-foreground">
              Try searching with different keywords
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;