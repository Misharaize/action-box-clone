import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Play, Download, DollarSign } from "lucide-react";
import { tmdbService, type StreamingInfo } from "@/services/tmdbApi";

interface WatchProvidersProps {
  movieId: number;
  movieTitle: string;
}

export const WatchProviders = ({ movieId, movieTitle }: WatchProvidersProps) => {
  const [providers, setProviders] = useState<StreamingInfo>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const data = await tmdbService.getWatchProviders(movieId);
        setProviders(data);
      } catch (error) {
        console.error("Error loading watch providers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProviders();
  }, [movieId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Where to Watch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasProviders = providers.flatrate?.length || providers.rent?.length || providers.buy?.length;

  if (!hasProviders) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Where to Watch</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Streaming information not available for this movie.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getProviderLogo = (logoPath: string) => {
    return `https://image.tmdb.org/t/p/w92${logoPath}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5" />
          Where to Watch
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Streaming Services */}
        {providers.flatrate && providers.flatrate.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                <Play className="w-3 h-3 mr-1" />
                Stream
              </Badge>
              <span className="text-sm text-muted-foreground">Available with subscription</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {providers.flatrate.map((provider) => (
                <Button
                  key={provider.id}
                  variant="outline"
                  className="p-2 h-auto flex flex-col items-center gap-2 hover:bg-primary/10"
                  onClick={() => providers.link && window.open(providers.link, '_blank')}
                >
                  <img
                    src={getProviderLogo(provider.logo_path)}
                    alt={provider.name}
                    className="w-8 h-8 rounded"
                  />
                  <span className="text-xs">{provider.name}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Rental Services */}
        {providers.rent && providers.rent.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                <DollarSign className="w-3 h-3 mr-1" />
                Rent
              </Badge>
              <span className="text-sm text-muted-foreground">Rent for limited time</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {providers.rent.map((provider) => (
                <Button
                  key={provider.id}
                  variant="outline"
                  className="p-2 h-auto flex flex-col items-center gap-2 hover:bg-primary/10"
                  onClick={() => providers.link && window.open(providers.link, '_blank')}
                >
                  <img
                    src={getProviderLogo(provider.logo_path)}
                    alt={provider.name}
                    className="w-8 h-8 rounded"
                  />
                  <span className="text-xs">{provider.name}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Purchase Services */}
        {providers.buy && providers.buy.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                <Download className="w-3 h-3 mr-1" />
                Buy
              </Badge>
              <span className="text-sm text-muted-foreground">Purchase to own</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {providers.buy.map((provider) => (
                <Button
                  key={provider.id}
                  variant="outline"
                  className="p-2 h-auto flex flex-col items-center gap-2 hover:bg-primary/10"
                  onClick={() => providers.link && window.open(providers.link, '_blank')}
                >
                  <img
                    src={getProviderLogo(provider.logo_path)}
                    alt={provider.name}
                    className="w-8 h-8 rounded"
                  />
                  <span className="text-xs">{provider.name}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {providers.link && (
          <Button 
            className="w-full" 
            onClick={() => window.open(providers.link, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View All Options
          </Button>
        )}
      </CardContent>
    </Card>
  );
};