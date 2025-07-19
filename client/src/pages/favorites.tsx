import { useQuery } from '@tanstack/react-query';
import { Heart, MapPin, Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BusinessModal } from '@/components/business-modal';
import { Navigation } from '@/components/navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { BusinessWithCategory } from '@shared/schema';

export function Favorites() {
  const { isAuthenticated } = useAuth();
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessWithCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: favoriteBusinesses = [], isLoading } = useQuery<BusinessWithCategory[]>({
    queryKey: ["/api/user/likes"],
    enabled: isAuthenticated,
  });

  const handleBusinessClick = (business: BusinessWithCategory) => {
    setSelectedBusiness(business);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBusiness(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sea-blue to-tropical-aqua flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center">
          <div className="w-20 h-20 bg-tropical-aqua rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-6">
            Please sign in to view and manage your saved places in Phan Rang.
          </p>
          <Button 
            className="w-full bg-tropical-aqua text-white hover:bg-tropical-aqua/90"
            onClick={() => window.location.href = '/api/login'}
          >
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tropical-aqua"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#f35f4a]">
              <Heart className="w-6 h-6 text-white fill-current" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Saved Places</h1>
              <p className="text-gray-600">Build your dream itinerary and never miss a hidden gem.</p>
            </div>
          </div>
          
          {favoriteBusinesses.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {favoriteBusinesses.length} place{favoriteBusinesses.length !== 1 ? 's' : ''} saved
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = '/explore'}
                  className="text-tropical-aqua border-tropical-aqua hover:bg-tropical-aqua hover:text-white"
                >
                  Discover More Places
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Favorites Grid */}
        {favoriteBusinesses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Saved Places Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring Phan Rang and save places you love by clicking the heart icon on any business.
            </p>
            <Button 
              className="bg-tropical-aqua text-white hover:bg-tropical-aqua/90"
              onClick={() => window.location.href = '/explore'}
            >
              Start Exploring
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteBusinesses.map((business) => (
              <Card 
                key={business.id} 
                className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-0 shadow-sm"
                onClick={() => handleBusinessClick(business)}
              >
                <div className="relative">
                  {/* Business Image */}
                  <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden">
                    <img
                      src={business.imageUrl || `https://source.unsplash.com/400x300/?${business.category?.name || 'business'}`}
                      alt={business.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full bg-gradient-to-br from-sea-blue to-tropical-aqua flex items-center justify-center">
                              <svg class="w-16 h-16 text-white opacity-50" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                              </svg>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>

                  {/* Favorite Heart Indicator */}
                  <div className="absolute top-3 right-3">
                    <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                    </div>
                  </div>

                  {/* Category Badge */}
                  {business.category && (
                    <div className="absolute top-3 left-3">
                      <Badge
                        style={{
                          backgroundColor: business.category.color + '20',
                          color: business.category.color,
                          border: `1px solid ${business.category.color}40`
                        }}
                        className="text-xs"
                      >
                        {business.category.name}
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Business Name */}
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-tropical-aqua transition-colors">
                      {business.name}
                    </h3>

                    {/* Location */}
                    {business.address && (
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{business.address}</span>
                      </div>
                    )}

                    {/* Rating */}
                    {business.rating && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-900">{parseFloat(business.rating || '0').toFixed(1)}</span>
                        </div>
                        {business.reviewCount && (
                          <span className="text-sm text-gray-500">({business.reviewCount} reviews)</span>
                        )}
                      </div>
                    )}

                    {/* Description */}
                    {business.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {business.description}
                      </p>
                    )}

                    {/* Quick Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-tropical-aqua border-tropical-aqua hover:bg-tropical-aqua hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBusinessClick(business);
                        }}
                      >
                        View Details
                      </Button>
                      
                      {business.website && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(business.website, '_blank');
                          }}
                          className="text-gray-600 hover:text-tropical-aqua"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      {/* Business Modal */}
      {selectedBusiness && (
        <BusinessModal
          business={selectedBusiness}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}