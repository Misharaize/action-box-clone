import { MovieCard } from "./MovieCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genre_ids?: number[];
  overview?: string;
}

interface MovieGridProps {
  title: string;
  movies: Movie[];
  loading?: boolean;
  onMovieClick?: (movieId: number) => void;
  className?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

const genres: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

export const MovieGrid = ({ 
  title, 
  movies, 
  loading = false, 
  onMovieClick,
  className = "",
  showViewAll = true,
  onViewAll
}: MovieGridProps) => {
  const getMovieGenres = (genreIds: number[] = []) => {
    return genreIds.map(id => genres[id]).filter(Boolean);
  };

  const getMovieYear = (releaseDate: string) => {
    return new Date(releaseDate).getFullYear().toString();
  };

  if (loading) {
    return (
      <section className={`py-8 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-9 w-20" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="w-full h-72 rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-8 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {title}
          </h2>
          {showViewAll && (
            <button
              onClick={onViewAll}
              className="text-primary hover:text-primary-glow transition-colors font-medium"
            >
              View All →
            </button>
          )}
        </div>

        {/* Movies Grid */}
        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                poster={movie.poster_path}
                rating={movie.vote_average}
                year={getMovieYear(movie.release_date)}
                genre={getMovieGenres(movie.genre_ids)}
                overview={movie.overview}
                onClick={() => onMovieClick?.(movie.id)}
                size="default"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No movies found</p>
          </div>
        )}
      </div>
    </section>
  );
};