import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { tmdbService } from "@/services/tmdbApi";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface Genre {
  id: number;
  name: string;
}

const Genres = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      setLoading(true);
      const response = await tmdbService.getGenres();
      setGenres(response.genres);
    } catch (error) {
      console.error("Error loading genres:", error);
      toast({
        title: "Error",
        description: "Failed to load genres. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenreClick = (genreId: number, genreName: string) => {
    navigate(`/genre/${genreId}?name=${encodeURIComponent(genreName)}`);
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
            Browse by Genre
          </h1>
          <p className="text-muted-foreground">
            Discover movies by your favorite genres
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, index) => (
              <div
                key={index}
                className="h-16 bg-card rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {genres.map((genre) => (
              <Button
                key={genre.id}
                variant="outline"
                className="h-16 text-lg font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
                onClick={() => handleGenreClick(genre.id, genre.name)}
              >
                {genre.name}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Genres;