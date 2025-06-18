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
          {business.imageUrl ? (
            <img 
              src={business.imageUrl} 
              alt={business.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-sea-blue to-tropical-aqua flex items-center justify-center">
              <MapPin className="w-16 h-16 text-white opacity-50" />
            </div>
          )}
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

          {business.description && (
            <p className="text-gray-600 leading-relaxed">
              {business.description}
            </p>
          )}

          {/* Contact Information */}
          <div className="space-y-3">
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
                ? 'text-chili-red border-chili-red hover:bg-red-50' 
                : 'text-gray-600 hover:text-chili-red hover:border-chili-red'
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
