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
    const [showMapInMobile, setShowMapInMobile] = useState(false);
  const [hoveredBusiness, setHoveredBusiness] = useState<BusinessWithCategory | null>(null);

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Fetch businesses
  const { data: businesses = [], isLoading: businessesLoading } = useQuery<BusinessWithCategory[]>({
    queryKey: selectedCategory 
      ? ['/api/businesses', { categoryId: selectedCategory }]
      : ['/api/businesses'],
  });

  // Filter businesses based on selected category for consistent filtering across directory and map
  const filteredBusinesses = businesses.filter((business) => {
    return selectedCategory === null || business.categoryId === selectedCategory;
  });

  // Like/unlike mutation
  const likeMutation = useMutation({
    mutationFn: async (businessId: number) => {
      const response = await apiRequest('POST', '/api/user/likes/toggle', { businessId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/businesses'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to update favorite. Please try again.",
        variant: "destructive",
      });
    },
  });

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
        {/* Mobile Header with Navigation */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between flex-shrink-0 z-20">
          <Link href="/">
            <div className="cursor-pointer">
              <div className="w-8 h-8 bg-chili-red rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Đ</span>
              </div>
            </div>
          </Link>

          <div className="flex items-center space-x-2">
            {/* Map Toggle Button */}
            <button
              className={`px-3 py-2 flex items-center justify-center space-x-2 rounded-md transition-colors ${
                showMapInMobile 
                  ? 'bg-chili-red text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setShowMapInMobile(!showMapInMobile)}
              title={showMapInMobile ? "Show List" : "Show Map"}
            >
              {showMapInMobile ? (
                <>
                  <List className="w-4 h-4" />
                  <span className="text-sm font-medium">List</span>
                </>
              ) : (
                <>
                  <MapIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Map</span>
                </>
              )}
            </button>

            {isAuthenticated ? (
              <button 
                className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => window.location.href = '/api/logout'}
                title="Sign Out"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            ) : (
              <button 
                className="w-10 h-10 flex items-center justify-center bg-chili-red text-white rounded-md hover:bg-red-600 transition-colors"
                onClick={() => window.location.href = '/api/login'}
                title="Sign In"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Business Directory */}
        {!showMapInMobile && (
            <div className="flex-1 bg-white overflow-hidden">
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
        )}

        {/* Mobile Map */}
        {showMapInMobile && (
          <div className="flex-1 bg-white">
            <Map
              businesses={filteredBusinesses}
              onBusinessClick={handleMapPinClick}
              selectedBusiness={selectedBusiness}
              hoveredBusiness={hoveredBusiness}
            />
          </div>
        )}

        {/* Mobile Bottom Navigation */}
        <div className="bg-white border-t border-gray-200 p-2 flex-shrink-0 z-20">
          <div className="flex justify-around">
            {navigationLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <div className={`flex flex-col items-center p-2 rounded-md transition-colors cursor-pointer ${
                  isActiveLink(href) 
                    ? 'text-chili-red' 
                    : 'text-gray-700'
                }`}>
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs">{label}</span>
                </div>
              </Link>
            ))}
            {isAuthenticated && (
              <Link href="/saved">
                <div className="flex flex-col items-center p-2 text-gray-700 rounded-md transition-colors cursor-pointer">
                  <Heart className="w-5 h-5 mb-1" />
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
        <div className="w-16 bg-white border-r border-gray-200 flex-shrink-0 h-screen">
          <div className="p-4 border-b border-gray-200">
            <Link href="/">
              <div className="cursor-pointer flex justify-center">
                <div className="w-8 h-8 bg-chili-red rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Đ</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="p-2 flex flex-col items-center space-y-2">
            {navigationLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <div className={`w-12 h-12 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                  isActiveLink(href) 
                    ? 'bg-chili-red text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`} title={label}>
                  <Icon className="w-5 h-5" />
                </div>
              </Link>
            ))}
            {isAuthenticated && (
              <Link href="/saved">
                <div className="w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-md transition-colors cursor-pointer" title="Saved Places">
                  <Heart className="w-5 h-5" />
                </div>
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="mt-8 pt-8 border-t border-gray-200 px-2">
            {isAuthenticated ? (
              <button 
                className="w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => window.location.href = '/api/logout'}
                title="Sign Out"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            ) : (
              <button 
                className="w-12 h-12 flex items-center justify-center bg-chili-red text-white rounded-md hover:bg-red-600 transition-colors"
                onClick={() => window.location.href = '/api/login'}
                title="Sign In"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
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