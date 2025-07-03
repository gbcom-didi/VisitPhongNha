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

        {/* Photo Grid */}
        <div className="w-full h-80 mb-4 relative">
          {allImages.length > 0 ? (
            <div className="flex gap-2 h-full">
              {/* Main Large Photo */}
              <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden relative cursor-pointer">
                <img 
                  src={allImages[0]} 
                  alt={business.name}
                  className="w-full h-full object-cover"
                  onClick={() => {
                    setSelectedImageIndex(0);
                    setShowGallery(true);
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const categoryName = business.category?.name?.toLowerCase();
                    
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
                    
                    if (!target.src.includes('unsplash.com')) {
                      target.src = fallbackUrl;
                    } else {
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full bg-gradient-to-br from-tropical-aqua to-jade-green flex items-center justify-center">
                            <svg class="w-16 h-16 text-white opacity-50" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                          </div>
                        `;
                      }
                    }
                  }}
                />
              </div>
              
              {/* Right Grid of 4 smaller photos */}
              {allImages.length > 1 && (
                <div className="w-64 grid grid-cols-2 gap-2">
                  {allImages.slice(1, 5).map((image, index) => (
                    <div 
                      key={index} 
                      className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden relative cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <img 
                        src={image} 
                        alt={`${business.name} - Image ${index + 2}`}
                        className="w-full h-full object-cover"
                        onClick={() => {
                          setSelectedImageIndex(index + 1);
                          setShowGallery(true);
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      {/* Show all photos overlay on last image if more than 5 photos */}
                      {index === 3 && allImages.length > 5 && (
                        <div 
                          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowGallery(true);
                          }}
                        >
                          <div className="text-white text-center">
                            <Images className="w-6 h-6 mx-auto mb-1" />
                            <span className="text-sm font-medium">Show all photos</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Fill empty grid spots if less than 4 additional images */}
                  {Array.from({ length: Math.max(0, 4 - (allImages.length - 1)) }, (_, index) => (
                    <div key={`empty-${index}`} className="bg-gray-100 rounded-lg"></div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Fallback when no images */
            <div className="w-full h-full bg-gradient-to-br from-tropical-aqua to-jade-green rounded-lg flex items-center justify-center">
              <div className="text-white text-center">
                <Images className="w-16 h-16 mx-auto mb-2 opacity-50" />
                <p className="text-lg font-medium">No photos available</p>
              </div>
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
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-gray-900">{parseFloat(business.rating).toFixed(1)}</span>
                {business.reviewCount && business.reviewCount > 0 && (
                  <span className="text-sm text-gray-500">({business.reviewCount} reviews)</span>
                )}
              </div>
            )}
          </div>


        </div>

        {/* Smart Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
          {/* Contact Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border border-gray-200 rounded-lg bg-gray-50">
            {business.address && (
              <div className="flex items-center justify-center text-center px-4">
                <div>
                  <MapPin className="w-5 h-5 mx-auto mb-1 text-gray-500" />
                  <p className="text-sm text-gray-700 font-medium">Address</p>
                  <p className="text-xs text-gray-600">{business.address}</p>
                </div>
              </div>
            )}
            
            {business.phone && (
              <div className="flex items-center justify-center text-center px-4 border-l border-r border-gray-300">
                <div>
                  <Phone className="w-5 h-5 mx-auto mb-1 text-gray-500" />
                  <p className="text-sm text-gray-700 font-medium">Phone</p>
                  <a 
                    href={`tel:${business.phone}`}
                    className="text-xs text-tropical-aqua hover:text-tropical-aqua-700 transition-colors"
                  >
                    {business.phone}
                  </a>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-center text-center px-4">
              <div>
                <Globe className="w-5 h-5 mx-auto mb-1 text-gray-500" />
                <p className="text-sm text-gray-700 font-medium">Location</p>
                <button
                  onClick={handleDirectionsClick}
                  className="text-xs text-tropical-aqua hover:text-tropical-aqua-700 transition-colors"
                >
                  View on Google Maps
                </button>
              </div>
            </div>
          </div>

          {/* Smart Booking/Website Buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
            {business.website && (
              <Button
                className="bg-tropical-aqua hover:bg-tropical-aqua-600 text-white"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const url = business.website?.trim();
                  console.log('Website URL:', url);
                  console.log('Business object:', business);
                  
                  if (url && url !== '') {
                    try {
                      // Clean the URL and ensure it has a protocol
                      let finalUrl = url;
                      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
                        finalUrl = `https://${finalUrl}`;
                      }
                      
                      // For better compatibility, prefer HTTPS for known working sites
                      if (finalUrl.startsWith('http://') && !finalUrl.includes('localhost')) {
                        finalUrl = finalUrl.replace('http://', 'https://');
                      }
                      
                      console.log('Final URL:', finalUrl);
                      
                      // Try to open the URL
                      const newWindow = window.open(finalUrl, '_blank', 'noopener,noreferrer');
                      if (!newWindow) {
                        console.error('Popup blocked or failed to open');
                        alert('Popup blocked. Please allow popups for this site or copy this URL: ' + finalUrl);
                      }
                    } catch (error) {
                      console.error('Error opening website:', error);
                      alert(`Could not open website: ${url}`);
                    }
                  } else {
                    console.error('No valid website URL found');
                    alert('No website URL available for this business');
                  }
                }}
              >
                <Globe className="w-4 h-4 mr-2" />
                Visit Website
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={handleDirectionsClick}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Get Directions
            </Button>
            
            {business.affiliateLink && (
              <Button
                variant="outline"
                onClick={() => window.open(business.affiliateLink || '', '_blank')}
              >
                Book Now
              </Button>
            )}
            
            {business.directBookingContact && (
              <Button
                variant="outline"
                onClick={() => {
                  const contact = business.directBookingContact;
                  if (contact?.includes('@')) {
                    window.open(`mailto:${contact}`, '_blank');
                  } else if (contact?.includes('http')) {
                    window.open(contact, '_blank');
                  } else if (contact) {
                    window.open(`tel:${contact}`, '_blank');
                  }
                }}
              >
                Direct Booking
              </Button>
            )}
            
            {/* Like Button */}
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