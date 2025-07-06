import { Heart, Star } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import type { BusinessWithCategory } from '@shared/schema';

interface BusinessCardProps {
  business: BusinessWithCategory;
  onLike?: (business: BusinessWithCategory) => void;
  onClick?: (business: BusinessWithCategory) => void;
  onHover?: (business: BusinessWithCategory) => void;
  onLeave?: () => void;
}

export function BusinessCard({ business, onLike, onClick, onHover, onLeave }: BusinessCardProps) {
  const handleCardClick = () => {
    onClick?.(business);
  };

  const handleCardHover = () => {
    onHover?.(business);
  };

  const handleCardLeave = () => {
    onLeave?.();
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike?.(business);
  };

  const getBusinessImageUrl = () => {
    // Use the authentic imageUrl from CSV data first (this is the mainImageURL)
    if (business.imageUrl && business.imageUrl.trim() !== '' && !business.imageUrl.includes('google.com/maps/search/')) {
      return business.imageUrl;
    }
    
    // If imageUrl is a Google Maps search URL, use category-based fallback images
    const categoryName = business.category?.name?.toLowerCase();
    
    if (categoryName?.includes('food') || categoryName?.includes('restaurant')) {
      return 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400';
    }
    if (categoryName?.includes('street food')) {
      return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400';
    }
    if (categoryName?.includes('cave')) {
      return 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop';
    }
    if (categoryName?.includes('accommodation') || categoryName?.includes('hotel')) {
      return 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400';
    }
    if (categoryName?.includes('attraction')) {
      return 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=800&h=600&fit=crop';
    }
    
    // Default fallback for Phong Nha region
    return 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=800&h=600&fit=crop';
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all border border-gray-100 overflow-hidden"
      onClick={handleCardClick}
      onMouseEnter={handleCardHover}
      onMouseLeave={handleCardLeave}
    >
      {/* Business Image */}
      <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
        <img 
          src={getBusinessImageUrl()} 
          alt={business.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // If image fails to load, try fallback image based on category
            const target = e.target as HTMLImageElement;
            const categoryName = business.category?.name?.toLowerCase();
            
            // Use high-quality fallback images specific to business categories
            let fallbackUrl = '';
            if (categoryName?.includes('accommodation') || categoryName?.includes('hotel')) {
              fallbackUrl = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&auto=format';
            } else if (categoryName?.includes('cave')) {
              fallbackUrl = 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop&auto=format';
            } else if (categoryName?.includes('food') || categoryName?.includes('restaurant')) {
              fallbackUrl = 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop&auto=format';
            } else if (categoryName?.includes('attraction')) {
              fallbackUrl = 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=800&h=600&fit=crop&auto=format';
            } else {
              fallbackUrl = 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=800&h=600&fit=crop&auto=format';
            }
            
            // If we haven't tried a fallback yet, try it
            if (!target.src.includes('unsplash.com')) {
              target.src = fallbackUrl;
            } else {
              // If even fallback failed, show placeholder
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                `;
              }
            }
          }}
        />
        
        {/* Like Button Overlay */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-3 right-3 p-2 bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-full ${
            business.isLiked 
              ? 'text-red-500 hover:text-red-600' 
              : 'text-gray-600 hover:text-red-500'
          }`}
          onClick={handleLikeClick}
        >
          <Heart 
            className={`w-5 h-5 ${business.isLiked ? 'fill-current' : ''}`} 
          />
        </Button>

        
      </div>

      {/* Business Info */}
      <div className="p-5">
        <h4 className="font-medium text-gray-900 text-sm mb-3 line-clamp-1">
          {business.name}
        </h4>

        {/* Category Badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          {business.categories && business.categories.length > 0 ? (
            business.categories.map((category) => (
              <Badge 
                key={category.id}
                variant="secondary"
                style={{ 
                  backgroundColor: category.color + '20',
                  color: category.color,
                  border: `1px solid ${category.color}40`
                }}
                className="text-xs px-2 py-0.5 text-xs font-medium"
              >
                {category.name}
              </Badge>
            ))
          ) : business.category ? (
            <Badge 
              variant="secondary"
              style={{ 
                backgroundColor: business.category.color + '20',
                color: business.category.color,
                border: `1px solid ${business.category.color}40`
              }}
              className="text-xs px-2 py-0.5 text-xs font-medium"
            >
              {business.category.name}
            </Badge>
          ) : null}
        </div>

        {/* Rating */}
        {business.rating && (
          <div className="flex items-center">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-xs font-medium text-gray-900">{parseFloat(business.rating || '0').toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
