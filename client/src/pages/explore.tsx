
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
import { 
  Sidebar, 
  SidebarContent, 
  SidebarProvider,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader
} from '@/components/ui/sidebar';
import { Link, useLocation } from 'wouter';
import { Heart, Home, Compass, Plane, Info, Phone } from 'lucide-react';

export default function Explore() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessWithCategory | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Main Navigation Sidebar */}
        <Sidebar className="border-r border-gray-200 w-16">
          <SidebarHeader className="p-4 border-b border-gray-200">
            <Link href="/">
              <div className="cursor-pointer flex justify-center">
                <div className="w-8 h-8 bg-chili-red rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Đ</span>
                </div>
              </div>
            </Link>
          </SidebarHeader>
          
          <SidebarContent className="p-2">
            <SidebarMenu>
              {navigationLinks.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton asChild isActive={isActiveLink(href)} className="w-12 h-12 p-0 justify-center">
                    <Link href={href}>
                      <a className="flex items-center justify-center w-full h-full" title={label}>
                        <Icon className="w-5 h-5" />
                      </a>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {isAuthenticated && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="w-12 h-12 p-0 justify-center">
                    <Link href="/saved">
                      <a className="flex items-center justify-center w-full h-full" title="Saved Places">
                        <Heart className="w-5 h-5" />
                      </a>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>

            {/* Auth Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
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
          </SidebarContent>
        </Sidebar>

        {/* Business Directory Sidebar */}
        <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto">
          <BusinessDirectory
            businesses={businesses}
            categories={categories}
            onBusinessClick={handleBusinessClick}
            onBusinessLike={handleBusinessLike}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Map - Full Screen */}
        <div className="flex-1 h-screen">
          <Map
            businesses={businesses}
            onBusinessClick={handleBusinessClick}
            selectedBusiness={selectedBusiness}
          />
        </div>

        {/* Business Detail Modal */}
        <BusinessModal
          business={selectedBusiness}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onLike={handleBusinessLike}
        />
      </div>
    </SidebarProvider>
  );
}
