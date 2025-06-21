import { X, MapPin, Phone, Clock, Globe, Heart, ExternalLink, Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { BusinessWithCategory } from '@shared/schema';

interface BusinessModalProps {
  business: BusinessWithCategory | null;
  isOpen: boolean;
  onClose: () => void;
  onLike?: (business: BusinessWithCategory) => void;
}

// Function to generate a fallback image URL based on business name
const getBusinessImageUrl = (business: BusinessWithCategory | null): string => {
  if (!business) return '';

  const nameHash = business.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageId = nameHash % 1000; // Ensure the ID is within a reasonable range

  return `https://source.unsplash.com/random/400x400/?${business.category?.name || 'business'}&sig=${imageId}`;
};

export function BusinessModal({ business, isOpen, onClose, onLike }: BusinessModalProps) {
  if (!business) return null;

  const handleLikeClick = () => {
    onLike?.(business);
  };

  const handleBookClick = () => {
    // In production, this would integrate with booking systems
    if (business.website) {
      window.open(business.website, '_blank');
    }
  };

  const handleDirectionsClick = () => {
    const lat = parseFloat(business.latitude);
    const lng = parseFloat(business.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-tropical-aqua-200">
        <DialogHeader>
          <DialogTitle className="sr-only">Business Details</DialogTitle>
        </DialogHeader>

        {/* Business Image */}
        <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-4">
          <img 
            src={business.imageUrl || getBusinessImageUrl(business)} 
            alt={business.name}
            className="w-full h-full object-cover"
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

        {/* Business Info */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{business.name}</h3>
              {business.category && (
                <Badge
                  style={{
                    backgroundColor: business.category.color + '20',
                    color: business.category.color,
                    border: `1px solid ${business.category.color}40`
                  }}
                  className="mb-3"
                >
                  {business.category.name}
                </Badge>
              )}
            </div>
          </div>

          {/* Enhanced Description */}
          <div className="space-y-4">
            <p className="text-gray-600 leading-relaxed">
              {business.description || `Experience the best of ${business.name} in Phan Rang. This highly-rated establishment offers exceptional service and authentic local experiences that showcase the unique culture and hospitality of the region.`}
            </p>

            {/* Reviews Section */}
            {business.rating && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-lg">Reviews</h4>
                <div className="flex items-start gap-4">
                  <div className="text-4xl font-bold text-gray-900">
                    {business.rating}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center text-gray-600 mb-2">
                      <Star className="w-3 h-3 fill-gray-800 text-gray-800 mr-1" />
                      <span className="text-sm">
                        {business.reviewCount && business.reviewCount > 0 
                          ? `${business.reviewCount.toLocaleString()} reviews`
                          : '2.5k reviews'}
                      </span>
                    </div>
                    {business.googleMapsUrl && (
                      <a 
                        href={business.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-tropical-aqua hover:text-tropical-aqua-800 transition-colors flex items-center"
                      >
                        View on Google Maps
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-3 border-t border-gray-200 pt-4">
            {business.address && (
              <div className="flex items-start text-gray-600">
                <MapPin className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{business.address}</span>
              </div>
            )}

            {business.phone && (
              <div className="flex items-center text-gray-600">
                <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
                <a 
                  href={`tel:${business.phone}`}
                  className="text-sm hover:text-tropical-aqua transition-colors"
                >
                  {business.phone}
                </a>
              </div>
            )}

            {business.hours && (
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="text-sm">{business.hours}</span>
              </div>
            )}

            {business.website && (
              <div className="flex items-center text-gray-600">
                <Globe className="w-5 h-5 mr-3 flex-shrink-0" />
                <a 
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-tropical-aqua transition-colors flex items-center"
                >
                  Visit Website
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            )}

            {business.googleMapsUrl && (
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-3 flex-shrink-0" />
                <a 
                  href={business.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-tropical-aqua transition-colors flex items-center"
                >
                  View on Google Maps
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <Button
            className="flex-1 bg-tropical-aqua hover:bg-tropical-aqua-600 text-white"
            onClick={handleBookClick}
          >
            {business.website ? 'Visit Website' : 'Book Now'}
          </Button>

          <Button
            variant="outline"
            className="flex-1"
            onClick={handleDirectionsClick}
          >
            Get Directions
          </Button>

          <Button
            variant="outline"
            className={`px-4 ${
              business.isLiked 
                ? 'text-tropical-aqua border-tropical-aqua hover:bg-teal-50' 
                : 'text-gray-600 hover:text-tropical-aqua hover:border-tropical-aqua'
            }`}
            onClick={handleLikeClick}
          >
            <Heart className={`w-4 h-4 ${business.isLiked ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}