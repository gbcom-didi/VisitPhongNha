import { X, MapPin, Phone, Clock, Globe, Heart, ExternalLink } from 'lucide-react';
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

            {/* Opening Hours Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-600" />
                Opening Hours
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium">8:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium">9:00 AM - 11:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium">10:00 AM - 9:00 PM</span>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <span className="text-green-600 font-medium text-xs">● Open Now</span>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Recent Reviews</h4>
              <div className="space-y-4">
                <div className="border-l-4 border-chili-red pl-4">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 text-sm mr-2">
                      ★★★★★
                    </div>
                    <span className="text-sm font-medium text-gray-700">Sarah M.</span>
                    <span className="text-xs text-gray-500 ml-2">2 days ago</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    "Amazing experience! The staff was incredibly friendly and the location is perfect. Highly recommend for anyone visiting Phan Rang."
                  </p>
                </div>

                <div className="border-l-4 border-sea-blue pl-4">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 text-sm mr-2">
                      ★★★★☆
                    </div>
                    <span className="text-sm font-medium text-gray-700">Minh T.</span>
                    <span className="text-xs text-gray-500 ml-2">5 days ago</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    "Great value for money. Clean, comfortable, and the local recommendations were spot on. Will definitely come back!"
                  </p>
                </div>

                <div className="border-l-4 border-tropical-aqua pl-4">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 text-sm mr-2">
                      ★★★★★
                    </div>
                    <span className="text-sm font-medium text-gray-700">Emma L.</span>
                    <span className="text-xs text-gray-500 ml-2">1 week ago</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    "Authentic local experience with modern amenities. The team went above and beyond to make our stay memorable."
                  </p>
                </div>
              </div>
            </div>
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
                  className="text-sm hover:text-chili-red transition-colors"
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
                  className="text-sm hover:text-chili-red transition-colors flex items-center"
                >
                  Visit Website
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <Button
            className="flex-1 bg-chili-red hover:bg-red-600 text-white"
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