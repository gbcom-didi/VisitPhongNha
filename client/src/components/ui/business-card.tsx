import { Heart, MapPin, Clock, Phone } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import type { BusinessWithCategory } from '@shared/schema';

interface BusinessCardProps {
  business: BusinessWithCategory;
  onLike?: (business: BusinessWithCategory) => void;
  onClick?: (business: BusinessWithCategory) => void;
  onHover?: (business: BusinessWithCategory) => void;
}

export function BusinessCard({ business, onLike, onClick, onHover }: BusinessCardProps) {
  const handleCardClick = () => {
    onClick?.(business);
  };

  const handleCardHover = () => {
    onHover?.(business);
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
      className="bg-white rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all border border-gray-100 overflow-hidden"
      onClick={handleCardClick}
      onMouseEnter={handleCardHover}
    >
      {/* Business Image */}
      <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
        {business.imageUrl ? (
          <img 
            src={business.imageUrl} 
            alt={business.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <MapPin className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        {/* Like Button Overlay */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-3 right-3 p-2 bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-full ${
            business.isLiked 
              ? 'text-chili-red hover:text-red-600' 
              : 'text-gray-600 hover:text-chili-red'
          }`}
          onClick={handleLikeClick}
        >
          <Heart 
            className={`w-5 h-5 ${business.isLiked ? 'fill-current' : ''}`} 
          />
        </Button>

        {/* Info Button */}
        <div className="absolute bottom-3 right-3">
          <div className="w-6 h-6 bg-black/40 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">i</span>
          </div>
        </div>
      </div>

      {/* Business Info */}
      <div className="p-4">
        <h4 className="font-semibold text-gray-900 text-base mb-1 line-clamp-1">
          {business.name}
        </h4>
        
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span>Ninh Thuan Province, Vietnam</span>
        </div>

        {business.category && (
          <Badge 
            variant="secondary"
            style={{ 
              backgroundColor: business.category.color + '20',
              color: business.category.color,
              border: `1px solid ${business.category.color}40`
            }}
            className="text-xs mb-2"
          >
            {business.category.name}
          </Badge>
        )}

        {business.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {business.description}
          </p>
        )}

        {/* Additional Info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{getDistanceText()}</span>
          {business.hours && (
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span className="truncate">{business.hours}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
