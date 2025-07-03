import { X, MapPin, Phone, Clock, Globe, Heart, ExternalLink, Star, User, Images, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import { apiRequest, queryClient } from '@/lib/queryClient';
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

  // Use the authentic imageUrl from CSV data first (this is the mainImageURL)
  if (business.imageUrl && business.imageUrl.trim() !== '' && !business.imageUrl.includes('google.com/maps/search/')) {
    return business.imageUrl;
  }

  // Fallback to category-based images if no authentic image available
  const categoryName = business.category?.name?.toLowerCase();
  
  if (categoryName?.includes('cave')) {
    return 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop';
  }
  if (categoryName?.includes('accommodation') || categoryName?.includes('hotel')) {
    return 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop';
  }
  if (categoryName?.includes('food') || categoryName?.includes('restaurant')) {
    return 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop';
  }
  if (categoryName?.includes('street food')) {
    return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop';
  }
  if (categoryName?.includes('attraction')) {
    return 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=800&h=600&fit=crop';
  }

  return 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=800&h=600&fit=crop';
};

export function BusinessModal({ business, isOpen, onClose, onLike }: BusinessModalProps) {
  if (!business) return null;

  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [localIsLiked, setLocalIsLiked] = useState(business.isLiked);

  // Update local state when business prop changes
  useEffect(() => {
    setLocalIsLiked(business.isLiked);
  }, [business.isLiked]);

  // Like/unlike mutation with optimistic updates
  const likeMutation = useMutation({
    mutationFn: async (businessId: number) => {
      return apiRequest('POST', '/api/user/likes/toggle', { businessId });
    },
    onMutate: async (businessId: number) => {
      // Optimistically update local state for immediate visual feedback
      setLocalIsLiked(prev => !prev);
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['/api/businesses'] });
      
      // Snapshot the previous value
      const previousBusinesses = queryClient.getQueryData(['/api/businesses']);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['/api/businesses'], (old: BusinessWithCategory[] | undefined) => {
        if (!old) return old;
        return old.map(b => 
          b.id === businessId 
            ? { ...b, isLiked: !b.isLiked }
            : b
        );
      });
      
      // Return a context object with the snapshotted value
      return { previousBusinesses, previousIsLiked: business.isLiked };
    },
    onError: (error: any, businessId: number, context: any) => {
      // Rollback local state
      setLocalIsLiked(context?.previousIsLiked || false);
      
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(['/api/businesses'], context?.previousBusinesses);
      
      if (isUnauthorizedError(error)) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to like businesses",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update favorite",
          variant: "destructive",
        });
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure server state
      queryClient.invalidateQueries({ queryKey: ['/api/businesses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/likes'] });
    },
  });

  const handleLikeClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to like businesses",
        variant: "destructive",
      });
      return;
    }
    likeMutation.mutate(business.id);
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

  // Combine main image and gallery images
  const allImages = [
    business.imageUrl || getBusinessImageUrl(business),
    ...(business.gallery || [])
  ].filter(Boolean);

  const hasMultipleImages = allImages.length > 1;
  const thumbnailImages = allImages.slice(1, 5); // Show max 4 thumbnails

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-tropical-aqua-200">
        <DialogHeader>
          <DialogTitle className="sr-only">Business Details</DialogTitle>
          <DialogDescription className="sr-only">
            Information about {business.name} including location, contact details, and booking options.
          </DialogDescription>
        </DialogHeader>

        {/* Business Image Gallery */}
        <div className="w-full h-64 mb-4 relative">
          {hasMultipleImages ? (
            <div className="flex gap-2 h-full">
              {/* Main Image */}
              <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden relative">
                <img 
                  src={allImages[0]} 
                  alt={business.name}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setShowGallery(true)}
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
              
              {/* Thumbnail Grid */}
              <div className="w-32 flex flex-col gap-2">
                {thumbnailImages.slice(0, 3).map((image, index) => (
                  <div key={index} className="h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={image} 
                      alt={`${business.name} - Image ${index + 2}`}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        setSelectedImageIndex(index + 1);
                        setShowGallery(true);
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                ))}
                
                {/* Show All Photos Button */}
                {allImages.length > 4 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-20 flex flex-col items-center justify-center text-xs border-tropical-aqua-200 hover:bg-tropical-aqua-50"
                    onClick={() => setShowGallery(true)}
                  >
                    <Images className="w-4 h-4 mb-1" />
                    Show all photos
                  </Button>
                )}
                
                {allImages.length === 4 && (
                  <div className="h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={thumbnailImages[3]} 
                      alt={`${business.name} - Image 4`}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        setSelectedImageIndex(3);
                        setShowGallery(true);
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Single Image */
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
              <img 
                src={allImages[0]} 
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

          {/* Enhanced Description */}
          <div className="space-y-4">
            <p className="text-gray-600 leading-relaxed">
              {business.description || `Experience the best of ${business.name} in Phan Rang. This highly-rated establishment offers exceptional service and authentic local experiences that showcase the unique culture and hospitality of the region.`}
            </p>

            {/* Reviews Section */}
            {business.rating && (
              <div className="bg-gray-50 rounded-lg p-3 border">
                <h4 className="font-semibold text-gray-900 mb-2">Reviews</h4>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold text-gray-900">
                      {business.rating ? parseFloat(business.rating).toFixed(1) : 'N/A'}
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${
                            i < Math.floor(parseFloat(business.rating || '0')) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'fill-gray-200 text-gray-200'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center text-gray-600 mb-1">
                      <User className="w-3 h-3 mr-1" />
                      <span className="text-sm">
                        {business.reviewCount && business.reviewCount > 0 
                          ? `${business.reviewCount.toLocaleString()} reviews`
                          : '6 reviews'}
                      </span>
                    </div>
                    {business.googleMapsUrl && (
                      <a 
                        href={business.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-tropical-aqua hover:text-tropical-aqua-800 transition-colors"
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
              localIsLiked 
                ? 'text-red-500 border-red-500 hover:bg-red-50' 
                : 'text-gray-600 hover:text-red-500 hover:border-red-500'
            }`}
            onClick={handleLikeClick}
            disabled={likeMutation.isPending}
          >
            <Heart className={`w-4 h-4 ${localIsLiked ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    {/* Full Screen Gallery Modal */}
    {showGallery && (
      <Dialog open={showGallery} onOpenChange={setShowGallery}>
        <DialogContent className="max-w-6xl max-h-[95vh] w-[95vw] p-0 bg-black border-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Photo Gallery</DialogTitle>
          </DialogHeader>
          
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full"
              onClick={() => setShowGallery(false)}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Navigation Arrows */}
            {allImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 z-50 text-white hover:bg-white/20 rounded-full"
                  onClick={() => setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : allImages.length - 1)}
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 z-50 text-white hover:bg-white/20 rounded-full"
                  onClick={() => setSelectedImageIndex(selectedImageIndex < allImages.length - 1 ? selectedImageIndex + 1 : 0)}
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}

            {/* Main Gallery Image */}
            <div className="w-full h-full flex items-center justify-center p-8">
              <img
                src={allImages[selectedImageIndex]}
                alt={`${business.name} - Image ${selectedImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>

            {/* Image Counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {allImages.length}
              </div>
            )}

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
                {allImages.map((image, index) => (
                  <div
                    key={index}
                    className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      index === selectedImageIndex ? 'border-tropical-aqua' : 'border-transparent opacity-60 hover:opacity-80'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )}
    </>
  );
}