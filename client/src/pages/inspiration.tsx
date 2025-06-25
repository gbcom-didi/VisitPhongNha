import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, Link } from 'wouter';
import { Search, Filter, Calendar, MapPin, User, Tag, Home, Compass, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/navigation';
import type { Article } from '@shared/schema';

export function InspirationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showFeatured, setShowFeatured] = useState(false);

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles', { tag: selectedTag, featured: showFeatured }],
  });

  // Get unique tags from all articles
  const allTags = Array.from(
    new Set(articles.flatMap(article => article.tags || []))
  ).sort();

  // Filter articles based on search query
  const filteredArticles = articles.filter(article => {
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  // Separate featured and regular articles
  const featuredArticles = filteredArticles.filter(article => article.isFeatured);
  const regularArticles = filteredArticles.filter(article => !article.isFeatured);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mango-yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inspiration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <div className="fixed inset-y-0 left-0 w-80 bg-white border-r border-gray-200 overflow-y-auto z-30">
        <div className="p-6">
          {/* Logo */}
          <Link href="/" className="flex items-center mb-8">
            <div className="w-12 h-12 mr-3">
              <img 
                src="/images/VisitPhongNha-Logo-02.png" 
                alt="Visit Phong Nha Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-mango-yellow font-questrial">Visit Phong Nha</h1>
              <p className="text-xs text-gray-500">Quang Binh Travel Hub</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-2 mb-8">
            <Link href="/" className={cn(
              "flex items-center space-x-3 w-full p-3 rounded-lg transition-colors",
              location === "/" ? "bg-mango-yellow text-white" : "text-gray-600 hover:bg-gray-100"
            )}>
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </Link>

            <Link href="/explore" className={cn(
              "flex items-center space-x-3 w-full p-3 rounded-lg transition-colors",
              location.startsWith("/explore") ? "bg-mango-yellow text-white" : "text-gray-600 hover:bg-gray-100"
            )}>
              <Compass className="w-5 h-5" />
              <span className="font-medium">Explore</span>
            </Link>

            <Link href="/inspiration" className={cn(
              "flex items-center space-x-3 w-full p-3 rounded-lg transition-colors",
              location.startsWith("/inspiration") ? "bg-mango-yellow text-white" : "text-gray-600 hover:bg-gray-100"
            )}>
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Inspiration</span>
            </Link>
          </nav>
        </div>
      </div>
      
      <div className="flex-1 ml-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 font-questrial mb-4">Inspiration</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Discover the magic of Phong Nha through stories, guides, and local experiences that will inspire your next adventure.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={showFeatured ? "default" : "outline"}
                onClick={() => setShowFeatured(!showFeatured)}
                className={showFeatured ? "bg-mango-yellow hover:bg-mango-yellow/90 text-white" : ""}
              >
                Featured
              </Button>
            </div>
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTag === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(null)}
                className={selectedTag === null ? "bg-mango-yellow hover:bg-mango-yellow/90 text-white" : ""}
              >
                All Topics
              </Button>
              {allTags.map(tag => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                  className={selectedTag === tag ? "bg-mango-yellow hover:bg-mango-yellow/90 text-white" : ""}
                >
                  {tag}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && !selectedTag && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Guides</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles.map(article => (
                <ArticleCard key={article.id} article={article} featured />
              ))}
            </div>
          </div>
        )}

        {/* All Articles */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedTag ? `Articles about ${selectedTag}` : 'Latest Articles'}
          </h2>
          
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(selectedTag ? filteredArticles : regularArticles).map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const [, navigate] = useLocation();

  const handleClick = () => {
    navigate(`/inspiration/${article.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fallback image based on tags
  const getFallbackImage = (tags: string[] = []) => {
    if (tags.includes('food')) return 'https://images.unsplash.com/photo-1559847844-5315695b6851?w=400&h=300&fit=crop';
    if (tags.includes('adventure')) return 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop';
    if (tags.includes('culture')) return 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=300&fit=crop';
    if (tags.includes('nature')) return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop';
    return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop';
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow ${
        featured ? 'ring-2 ring-mango-yellow ring-opacity-50' : ''
      }`}
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={article.mainImageUrl || getFallbackImage(article.tags)}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
        {featured && (
          <Badge className="absolute top-3 left-3 bg-mango-yellow text-white">
            Featured
          </Badge>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <User className="w-4 h-4 mr-1" />
          <span>{article.author}</span>
          <Calendar className="w-4 h-4 ml-4 mr-1" />
          <span>{formatDate(article.publicationDate)}</span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.summary}
        </p>
        
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{article.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}