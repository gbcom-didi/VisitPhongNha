import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Search, Filter, MapPin, User, Tag, Clock, Calendar, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarNavigation } from '@/components/sidebar-navigation';
import type { Article } from '@shared/schema';

export function InspirationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
  });

  // Get unique tags from all articles
  const allTags = Array.from(
    new Set(articles.flatMap(article => article.tags || []))
  ).sort();

  // Filter articles based on search query and selected tag
  const filteredArticles = articles.filter(article => {
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = !selectedTag || (article.tags && article.tags.includes(selectedTag));
    
    return matchesSearch && matchesTag;
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
      <SidebarNavigation />
      
      <div className="flex-1 ml-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 font-questrial mb-3">Inspiration</h1>
          <p className="text-base text-gray-600 max-w-3xl">
            Discover the magic of Phong Nha through stories, guides, and local experiences that will inspire your next adventure.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-9 pr-9 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 w-4 h-4"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            

          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <Button
                variant={selectedTag === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(null)}
                className={selectedTag === null ? "bg-mango-yellow hover:bg-mango-yellow/90 text-white text-xs px-3 py-1.5" : "text-xs px-3 py-1.5"}
              >
                All Topics
              </Button>
              {allTags.map(tag => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                  className={selectedTag === tag ? "bg-mango-yellow hover:bg-mango-yellow/90 text-white text-xs px-3 py-1.5" : "text-xs px-3 py-1.5"}
                >
                  {tag}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Featured Articles - Only show when no tag filter is applied */}
        {!selectedTag && featuredArticles.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Featured Guides</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredArticles.map(article => (
                <ArticleCard key={article.id} article={article} featured />
              ))}
            </div>
          </div>
        )}

        {/* All Articles */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {selectedTag ? `Articles about ${selectedTag}` : 'Latest Articles'}
          </h2>
          
          {filteredArticles.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="w-8 h-8 mx-auto text-gray-300 mb-3" />
              <h3 className="text-base font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-sm text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(selectedTag ? filteredArticles : regularArticles).map((article: Article) => (
                <ArticleCard key={article.id} article={article} featured={article.isFeatured && !selectedTag} />
              ))}
            </div>
          )}
          </div>
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

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fallback image based on tags
  const getFallbackImage = (tags: string[] | null = []) => {
    const tagArray = tags || [];
    if (tagArray.includes('food')) return 'https://images.unsplash.com/photo-1559847844-5315695b6851?w=400&h=300&fit=crop';
    if (tagArray.includes('adventure')) return 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop';
    if (tagArray.includes('culture')) return 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=300&fit=crop';
    if (tagArray.includes('nature')) return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop';
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
          className="w-full h-32 object-cover"
        />
        {featured && (
          <Badge className="absolute top-3 left-3 bg-mango-yellow text-white">
            Featured
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <User className="w-3 h-3 mr-1" />
          <span>{article.author}</span>
          <Calendar className="w-3 h-3 ml-3 mr-1" />
          <span>{formatDate(article.publicationDate)}</span>
        </div>
        
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-gray-600 text-xs mb-3 line-clamp-3">
          {article.summary}
        </p>
        
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5 bg-mango-yellow text-white">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}