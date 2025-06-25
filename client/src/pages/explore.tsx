import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { BusinessDirectory } from '@/components/business-directory';
import { BusinessModal } from '@/components/business-modal';
import { Map } from '@/components/ui/map';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { BusinessWithCategory, Category } from '@shared/schema';

import { Link, useLocation } from 'wouter';
import { Heart, Home, Compass, Plane, Info, Phone, Map as MapIcon, List } from 'lucide-react';

export default function Explore() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessWithCategory | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [showMapInMobile, setShowMapInMobile] = useState(true);
  const [hoveredBusiness, setHoveredBusiness] = useState<BusinessWithCategory | null>(null);

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Fetch businesses
  const { data: businesses = [], isLoading: businessesLoading } = useQuery<BusinessWithCategory[]>({
    queryKey: selectedCategory 
      ? ['/api/businesses', selectedCategory]
      : ['/api/businesses'],
    queryFn: async () => {
      const url = selectedCategory 
        ? `/api/businesses?categoryId=${selectedCategory}`
        : '/api/businesses';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch businesses');
      return response.json();
    }
  });

  // Use businesses directly since filtering is done server-side
  const filteredBusinesses = businesses;

  // Like/unlike mutation with optimistic updates
  const likeMutation = useMutation({
    mutationFn: async (businessId: number) => {
      return apiRequest('POST', '/api/user/likes/toggle', { businessId });
    },
    onMutate: async (businessId: number) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['/api/businesses'] });
      
      // Snapshot the previous value
      const previousBusinesses = queryClient.getQueryData(['/api/businesses']);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['/api/businesses'], (old: BusinessWithCategory[] | undefined) => {
        if (!old) return old;
        return old.map(business => 
          business.id === businessId 
            ? { ...business, isLiked: !business.isLiked }
            : business
        );
      });
      
      // Return a context object with the snapshotted value
      return { previousBusinesses };
    },
    onError: (error: any, businessId: number, context: any) => {
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

  const handleLikeBusiness = (business: BusinessWithCategory) => {
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

  const handleBusinessClick = (business: BusinessWithCategory) => {
    setSelectedBusiness(business);
    setIsModalOpen(true);
  };

  const handleBusinessHover = (business: BusinessWithCategory) => {
    // Set hovered business for map zoom animation
    setHoveredBusiness(business);
  };

  const handleBusinessLeave = () => {
    // Clear hovered business and return to normal zoom
    setHoveredBusiness(null);
  };

  const handleMapPinClick = (business: BusinessWithCategory) => {
    setSelectedBusiness(business);
    setIsModalOpen(true);
  };

  const handleBusinessLike = async (business: BusinessWithCategory) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save places to your favorites.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1500);
      return;
    }

    likeMutation.mutate(business.id);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBusiness(null);
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  const navigationLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/explore', label: 'Explore', icon: Compass },
    { href: '/getting-here', label: 'Getting Here', icon: Plane },
    { href: '/about', label: 'About', icon: Info },
    { href: '/contact', label: 'Contact', icon: Phone },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/' && location === '/') return true;
    if (href !== '/' && location.startsWith(href)) return true;
    return false;
  };

  if (businessesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chili-red mx-auto mb-4"></div>
            <p className="text-gray-600">Loading places to explore...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="md:hidden h-screen flex flex-col">

        {/* Mobile Business Directory */}
        {!showMapInMobile && (
            <div className="flex-1 bg-white overflow-hidden flex flex-col relative">
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
              
              {/* Floating Map Button */}
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
            
            {/* Floating List Button */}
            <button
              className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full flex items-center space-x-1 shadow-lg z-30"
              onClick={() => setShowMapInMobile(false)}
            >
              <List className="w-4 h-4" />
              <span className="font-medium text-sm">List</span>
            </button>
          </div>
        )}

        {/* Mobile Bottom Navigation */}
        <div className="bg-white border-t border-gray-200 py-1 px-2 flex-shrink-0 z-20">
          <div className="flex justify-around">
            {navigationLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <div className={`flex flex-col items-center py-1 px-2 rounded-md transition-colors cursor-pointer ${
                  isActiveLink(href) 
                    ? 'text-chili-red' 
                    : 'text-gray-700'
                }`}>
                  <Icon className="w-4 h-4 mb-0.5" />
                  <span className="text-xs">{label}</span>
                </div>
              </Link>
            ))}
            {isAuthenticated && (
              <Link href="/saved">
                <div className={`flex flex-col items-center py-1 px-2 rounded-md transition-colors cursor-pointer ${
                  isActiveLink('/saved')
                    ? 'text-chili-red' 
                    : 'text-gray-700'
                }`}>
                  <Heart className="w-4 h-4 mb-0.5" />
                  <span className="text-xs">Saved</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex">
        {/* Main Navigation Sidebar */}
        <div className="w-16 bg-white border-r border-gray-200 flex-shrink-0 h-screen relative">
          <div className="p-2 border-b border-gray-200">
            <Link href="/">
              <div className="cursor-pointer flex justify-center">
                <div className="w-12 h-12">
                  <img 
                    src="/images/VisitPhongNha-Logo-02.png" 
                    alt="Visit Phong Nha Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </Link>
          </div>

          <div className="p-2 flex flex-col items-center space-y-2">
            {navigationLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <div className={`w-12 h-12 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                  isActiveLink(href) 
                    ? 'bg-tropical-aqua text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`} title={label}>
                  <Icon className="w-5 h-5" />
                </div>
              </Link>
            ))}
            {isAuthenticated && (
              <Link href="/saved">
                <div className={`w-12 h-12 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                  location === '/saved'
                    ? 'bg-tropical-aqua text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`} title="Saved Places">
                  <Heart className="w-5 h-5" />
                </div>
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="absolute bottom-4 left-2 right-2">
            {isAuthenticated ? (
              <button 
                className="w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-md transition-colors mx-auto"
                onClick={() => window.location.href = '/api/logout'}
                title="Sign Out"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            ) : (
              <button 
                className="w-12 h-12 flex items-center justify-center bg-tropical-aqua text-white rounded-md hover:bg-tropical-aqua/90 transition-colors mx-auto"
                onClick={() => window.location.href = '/api/login'}
                title="Sign In"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Business Directory Panel */}
        <div className="w-96 bg-white border-r border-gray-200 flex-shrink-0 h-screen overflow-hidden">
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
        <div className="flex-1 h-screen">
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