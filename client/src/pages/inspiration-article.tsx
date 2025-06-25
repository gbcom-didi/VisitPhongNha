import { useQuery } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';
import { ArrowLeft, Calendar, User, MapPin, ExternalLink, Home, Compass, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Map } from '@/components/ui/map';
import { cn } from '@/lib/utils';
import type { Article } from '@shared/schema';

export function InspirationArticlePage() {
  const [match, params] = useRoute('/inspiration/:id');
  const articleId = params?.id ? parseInt(params.id) : null;

  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: [`/api/articles/${articleId}`],
    enabled: !!articleId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mango-yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h1>
          <p className="text-gray-600 mb-4">The article you're looking for doesn't exist.</p>
          <Link href="/inspiration">
            <Button className="bg-mango-yellow hover:bg-mango-yellow/90 text-white">
              Back to Inspiration
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Create a mock business object for the map
  const articleLocation = {
    id: article.id,
    name: article.title,
    latitude: parseFloat(article.latitude.toString()),
    longitude: parseFloat(article.longitude.toString()),
    description: article.summary,
    category: { name: 'Article Location', color: '#F4B942' }
  };

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
            <Link href="/" className="flex items-center space-x-3 w-full p-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-100">
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </Link>

            <Link href="/explore" className="flex items-center space-x-3 w-full p-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-100">
              <Compass className="w-5 h-5" />
              <span className="font-medium">Explore</span>
            </Link>

            <Link href="/inspiration" className="flex items-center space-x-3 w-full p-3 rounded-lg transition-colors bg-mango-yellow text-white">
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Inspiration</span>
            </Link>
          </nav>
        </div>
      </div>
      
      <div className="flex-1 ml-80">
        {/* Back to Inspiration Button */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/inspiration">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Inspiration</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Split Screen Layout */}
        <div className="flex h-[calc(100vh-8rem)]">
        {/* Left Side - Article Content */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Article Header */}
            <div className="mb-8">
              {article.mainImageUrl && (
                <img
                  src={article.mainImageUrl}
                  alt={article.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <User className="w-4 h-4 mr-1" />
                <span className="mr-4">{article.author}</span>
                <Calendar className="w-4 h-4 mr-1" />
                <span className="mr-4">{formatDate(article.publicationDate)}</span>
                <MapPin className="w-4 h-4 mr-1" />
                <span>Phong Nha, Vietnam</span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4 font-questrial">
                {article.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-6">
                {article.summary}
              </p>
              
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {article.tags.map(tag => (
                    <Badge key={tag} className="bg-mango-yellow/10 text-mango-yellow hover:bg-mango-yellow/20">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-mango-yellow prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />

            {/* External Link */}
            {article.externalUrl && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <a
                  href={article.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-mango-yellow hover:text-mango-yellow/80 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View original article</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Map */}
        <div className="w-1/2 bg-gray-100 border-l border-gray-200">
          <div className="h-full relative">
            <div className="absolute top-4 left-4 right-4 z-10">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-gray-900 mb-2">Article Location</h3>
                <p className="text-sm text-gray-600 mb-2">{article.title}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span>Lat: {article.latitude.toString()}, Lng: {article.longitude.toString()}</span>
                </div>
              </div>
            </div>
            
            <Map
              businesses={[articleLocation as any]}
              onBusinessClick={() => {}}
              selectedBusiness={null}
              hoveredBusiness={null}
              center={{
                lat: parseFloat(article.latitude.toString()),
                lng: parseFloat(article.longitude.toString())
              }}
              zoom={14}
            />
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}