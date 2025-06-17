import { Heart, MapPin, Clock, Phone } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import type { BusinessWithCategory } from '@shared/schema';

interface BusinessCardProps {
  business: BusinessWithCategory;
  onLike?: (business: BusinessWithCategory) => void;
  onClick?: (business: BusinessWithCategory) => void;
}

export function BusinessCard({ business, onLike, onClick }: BusinessCardProps) {
  const handleCardClick = () => {
    onClick?.(business);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike?.(business);
  };

  const getDistanceText = () => {
    // Mock distance calculation - in production, use user's location
    const distances = ['1.2 km', '2.5 km', '3.8 km', '5.1 km', '7.3 km'];
    return distances[Math.floor(Math.random() * distances.length)] + ' away';
  };

  return (
    <div 
      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
      onClick={handleCardClick}
    >
      <div className="flex items-start space-x-3">
        {/* Business Image */}
        <div className="w-16 h-16 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
          {business.imageUrl ? (
            <img 
              src={business.imageUrl} 
              alt={business.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>

        {/* Business Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate text-sm">
            {business.name}
          </h4>
          
          {business.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {business.description}
            </p>
          )}

          <div className="flex items-center mt-2 gap-2">
            {business.category && (
              <Badge 
                variant="secondary"
                style={{ 
                  backgroundColor: business.category.color + '20',
                  color: business.category.color,
                  border: `1px solid ${business.category.color}40`
                }}
                className="text-xs"
              >
                {business.category.name}
              </Badge>
            )}
            <span className="text-xs text-gray-500">
              {getDistanceText()}
            </span>
          </div>

          {/* Additional Info */}
          <div className="flex items-center mt-1 text-xs text-gray-500 space-x-3">
            {business.phone && (
              <div className="flex items-center">
                <Phone className="w-3 h-3 mr-1" />
                <span className="truncate">{business.phone}</span>
              </div>
            )}
            {business.hours && (
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span className="truncate">{business.hours}</span>
              </div>
            )}
          </div>
        </div>

        {/* Like Button */}
        <Button
          variant="ghost"
          size="sm"
          className={`p-1 ${
            business.isLiked 
              ? 'text-chili-red hover:text-red-600' 
              : 'text-gray-400 hover:text-chili-red'
          }`}
          onClick={handleLikeClick}
        >
          <Heart 
            className={`w-5 h-5 ${business.isLiked ? 'fill-current' : ''}`} 
          />
        </Button>
      </div>
    </div>
  );
}
