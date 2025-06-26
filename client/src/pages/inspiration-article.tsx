import { useQuery } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';
import { ArrowLeft, Calendar, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Map } from '@/components/ui/map';
import { SidebarNavigation } from '@/components/sidebar-navigation';
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
      <div className="min-h-screen bg-gray-50 flex">
        <SidebarNavigation />
        <div className="flex-1 ml-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mango-yellow mx-auto mb-4"></div>
            <p className="text-gray-600">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <SidebarNavigation />
        <div className="flex-1 ml-16 flex items-center justify-center">
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
      </div>
    );
  }

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Create a business object for the map
  const articleLocation = {
    id: article.id,
    name: article.title,
    latitude: parseFloat(article.latitude.toString()),
    longitude: parseFloat(article.longitude.toString()),
    description: article.summary,
    address: 'Phong Nha, Quang Binh Province',
    phone: null,
    website: null,
    email: null,
    imageUrl: article.mainImageUrl,
    tags: article.tags,
    priceRange: null,
    amenities: null,
    bookingType: null,
    affiliateLink: null,
    directBookingContact: null,
    enquiryFormEnabled: false,
    featuredText: null,
    isVerified: false,
    isRecommended: false,
    ownerId: null,
    rating: null,
    reviewCount: null,
    reviews: null,
    gallery: null,
    operatingHours: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    categories: [{ id: 1, name: 'Article Location', color: '#F4B942', icon: 'map-pin', emoji: '📍' }]
  } as any;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarNavigation />

      {/* Split Screen Layout */}
      <div className="flex-1 ml-16 flex h-screen">
        {/* Left Side - Article Content */}
        <div className="w-1/2 bg-white overflow-y-auto h-full">
          <div className="p-8">
            {/* Back Button */}
            <Link href="/inspiration">
              <Button variant="ghost" className="mb-6 -ml-3">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Inspiration
              </Button>
            </Link>

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

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Article Content - Full HTML Display */}
            <div className="prose prose-lg max-w-none mb-8 article-content">
              <div dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
            </div>

            {/* Article Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200 mb-8">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Published on {formatDate(article.publicationDate)}
                </div>
                <Link href="/inspiration">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    More Stories
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Interactive Map */}
        <div className="w-1/2 bg-gray-100 relative h-full">
          <div className="absolute inset-0">
            <Map
              businesses={[articleLocation]}
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
  );
}