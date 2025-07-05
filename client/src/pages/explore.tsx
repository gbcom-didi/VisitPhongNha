import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { BusinessDirectory } from '@/components/business-directory';
import { BusinessModal } from '@/components/business-modal';
import { Map } from '@/components/ui/map';
import { SidebarNavigation } from '@/components/sidebar-navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { BusinessWithCategory, Category } from '@shared/schema';

import { useLocation, Link } from 'wouter';
import { Heart, Map as MapIcon, List, Menu, Navigation } from 'lucide-react';

export default function Explore() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessWithCategory | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMapInMobile, setShowMapInMobile] = useState(true);
  const [hoveredBusiness, setHoveredBusiness] = useState<BusinessWithCategory | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Fetch businesses
  const { data: businesses = [], isLoading: businessesLoading } = useQuery<BusinessWithCategory[]>({
    queryKey: ['/api/businesses'],
  });

  // Like/Unlike mutation
  const likeMutation = useMutation({
    mutationFn: (businessId: number) => apiRequest('POST', '/api/user/likes/toggle', { businessId }),
    onMutate: async (businessId: number) => {
      // Cancel outgoing refetches to prevent race conditions
      await queryClient.cancelQueries({ queryKey: ['/api/businesses'] });
      const previousBusinesses = queryClient.getQueryData(['/api/businesses']);
      
      // Optimistically update the UI for immediate feedback
      queryClient.setQueryData(['/api/businesses'], (old: BusinessWithCategory[] | undefined) => {
        if (!old) return old;
        return old.map(business => 
          business.id === businessId 
            ? { ...business, isLiked: !business.isLiked }
            : business
        );
      });
      
      return { previousBusinesses };
    },
    onError: (error: any, businessId: number, context: any) => {
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
    onSuccess: () => {
      // Immediately refetch to get the updated like status
      queryClient.invalidateQueries({ queryKey: ['/api/businesses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/likes'] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/businesses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/likes'] });
    },
  });

  // Filter businesses by selected category
  const filteredBusinesses = selectedCategory 
    ? businesses.filter(business => 
        business.categories?.some(cat => cat.id === selectedCategory) || 
        business.category?.id === selectedCategory
      )
    : businesses;

  const handleBusinessClick = (business: BusinessWithCategory) => {
    setSelectedBusiness(business);
    setIsModalOpen(true);
  };

  const handleMapPinClick = (business: BusinessWithCategory) => {
    setSelectedBusiness(business);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBusiness(null);
  };

  const handleBusinessLike = (business: BusinessWithCategory) => {
    likeMutation.mutate(business.id);
  };

  const handleBusinessHover = (business: BusinessWithCategory | null) => {
    setHoveredBusiness(business);
  };

  const handleBusinessLeave = () => {
    setHoveredBusiness(null);
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  if (businessesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <SidebarNavigation />
        <div className="flex-1 ml-16 flex items-center justify-center">
          <div className="text-lg text-gray-600">Loading businesses...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-screen">
        {/* Mobile Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex justify-between items-center px-3 py-2">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 mr-2">
                <img 
                  src="/images/VisitPhongNha-Logo-02.png" 
                  alt="Visit Phong Nha Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-mango-yellow font-bold">Visit Phong Nha</span>
            </Link>
            
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {showMobileMenu && (
            <div className="border-t border-gray-200 bg-white">
              <div className="p-4 space-y-1">
                <Link href="/">
                  <button 
                    className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-md transition-colors font-medium"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Home
                  </button>
                </Link>
                <Link href="/explore">
                  <button 
                    className="w-full text-left py-3 px-4 bg-mango-yellow text-white rounded-md font-medium"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Explore
                  </button>
                </Link>
                <Link href="/inspiration">
                  <button 
                    className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-md transition-colors font-medium"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Inspiration
                  </button>
                </Link>
                <Link href="/guestbook">
                  <button 
                    className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-md transition-colors font-medium"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Guestbook
                  </button>
                </Link>
                <Link href="/getting-here">
                  <button 
                    className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-md transition-colors font-medium"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Getting Here
                  </button>
                </Link>
                <Link href="/about">
                  <button 
                    className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-md transition-colors font-medium"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    About
                  </button>
                </Link>
                <Link href="/contact">
                  <button 
                    className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-md transition-colors font-medium"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Contact
                  </button>
                </Link>
                {isAuthenticated && (
                  <Link href="/saved">
                    <button 
                      className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-md transition-colors font-medium flex items-center"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Saved Places
                    </button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile List */}
        {!showMapInMobile && (
          <div className="flex-1 bg-white relative">
            <BusinessDirectory
              businesses={filteredBusinesses}
              categories={categories}
              onBusinessClick={handleBusinessClick}
              onBusinessLike={handleBusinessLike}
              onBusinessHover={handleBusinessHover}
              onBusinessLeave={handleBusinessLeave}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
            
            <button
              className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full flex items-center space-x-1 shadow-lg z-30"
              onClick={() => setShowMapInMobile(true)}
            >
              <MapIcon className="w-4 h-4" />
              <span className="font-medium text-sm">Map</span>
            </button>
          </div>
        )}

        {/* Mobile Map */}
        {showMapInMobile && (
          <div className="flex-1 bg-white relative">
            <Map
              businesses={filteredBusinesses}
              onBusinessClick={handleMapPinClick}
              selectedBusiness={selectedBusiness}
              hoveredBusiness={hoveredBusiness}
            />
            
            <button
              className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full flex items-center space-x-1 shadow-lg z-30"
              onClick={() => setShowMapInMobile(false)}
            >
              <List className="w-4 h-4" />
              <span className="font-medium text-sm">List</span>
            </button>
          </div>
        )}


      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex">
        <SidebarNavigation />

        {/* Business Directory Panel */}
        <div className="fixed left-16 top-0 w-96 h-full bg-white border-r border-gray-200 overflow-y-auto z-40">
          <BusinessDirectory
            businesses={filteredBusinesses}
            categories={categories}
            onBusinessClick={handleBusinessClick}
            onBusinessLike={handleBusinessLike}
            onBusinessHover={handleBusinessHover}
            onBusinessLeave={handleBusinessLeave}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Map - Takes remaining space */}
        <div className="fixed left-[28rem] top-0 right-0 h-full">
          <Map
            businesses={filteredBusinesses}
            onBusinessClick={handleMapPinClick}
            selectedBusiness={selectedBusiness}
            hoveredBusiness={hoveredBusiness}
          />
        </div>
      </div>

      {/* Business Detail Modal */}
      <BusinessModal
        business={selectedBusiness}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onLike={handleBusinessLike}
      />
    </div>
  );
}