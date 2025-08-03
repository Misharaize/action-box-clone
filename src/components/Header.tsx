import { useState } from "react";
import { Search, Menu, User, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

interface HeaderProps {
  onSearch?: (query: string) => void;
  className?: string;
}

export const Header = ({ onSearch, className }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-glass backdrop-blur-lg border-b border-border/20",
      className
    )}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Play className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ACTION BOX
          </h1>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => navigate('/')} 
            className={cn("transition-colors", location.pathname === '/' ? "text-primary" : "text-muted-foreground hover:text-primary")}
          >
            Home
          </button>
          <button 
            onClick={() => navigate('/popular')} 
            className={cn("transition-colors", location.pathname === '/popular' ? "text-primary" : "text-muted-foreground hover:text-primary")}
          >
            Popular
          </button>
          <button 
            onClick={() => navigate('/trending')} 
            className={cn("transition-colors", location.pathname === '/trending' ? "text-primary" : "text-muted-foreground hover:text-primary")}
          >
            Trending
          </button>
          <button 
            onClick={() => navigate('/genres')} 
            className={cn("transition-colors", location.pathname === '/genres' ? "text-primary" : "text-muted-foreground hover:text-primary")}
          >
            Genres
          </button>
        </nav>

        {/* Search & User Actions */}
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden sm:flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search movies, series..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-muted/20 border-border/50 focus:border-primary"
              />
            </div>
          </form>
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="w-5 h-5" />
          </Button>

          <Button variant="spotlight" size="icon">
            <User className="w-5 h-5" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-border/20 p-4">
          <nav className="flex flex-col gap-4">
            <button 
              onClick={() => { navigate('/'); setIsMenuOpen(false); }} 
              className={cn("text-left transition-colors", location.pathname === '/' ? "text-primary" : "text-muted-foreground hover:text-primary")}
            >
              Home
            </button>
            <button 
              onClick={() => { navigate('/popular'); setIsMenuOpen(false); }} 
              className={cn("text-left transition-colors", location.pathname === '/popular' ? "text-primary" : "text-muted-foreground hover:text-primary")}
            >
              Popular
            </button>
            <button 
              onClick={() => { navigate('/trending'); setIsMenuOpen(false); }} 
              className={cn("text-left transition-colors", location.pathname === '/trending' ? "text-primary" : "text-muted-foreground hover:text-primary")}
            >
              Trending
            </button>
            <button 
              onClick={() => { navigate('/genres'); setIsMenuOpen(false); }} 
              className={cn("text-left transition-colors", location.pathname === '/genres' ? "text-primary" : "text-muted-foreground hover:text-primary")}
            >
              Genres
            </button>
          </nav>
          <form onSubmit={handleSearch} className="mt-4 flex gap-2">
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-muted/20 border-border/50"
            />
            <Button type="submit" variant="default" size="icon">
              <Search className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </header>
  );
};