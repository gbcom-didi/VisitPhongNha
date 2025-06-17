import { useState, useEffect } from 'react';
import { useQuery, useMutation, queryClient } from '@tanstack/react-query';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { BusinessDirectory } from '@/components/business-directory';
import { BusinessModal } from '@/components/business-modal';
import { Map } from '@/components/ui/map';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import { apiRequest } from '@/lib/queryClient';
import type { BusinessWithCategory, Category } from '@shared/schema';

export default function Explore() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessWithCategory | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize data on first load
  useEffect(() => {
    const initializeData = async () => {
      try {
        await apiRequest('POST', '/api/init-data');
      } catch (error) {
        // Data might already be initialized, that's okay
      }
    };
    initializeData();
  }, []);

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Fetch businesses
  const { data: businesses = [], isLoading: businessesLoading } = useQuery<BusinessWithCategory[]>({
    queryKey: ['/api/businesses', selectedCategory],
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

  if (businessesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chili-red mx-auto mb-4"></div>
            <p className="text-gray-600">Loading places to explore...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 lg:mb-0 font-questrial">
              Explore Ninh Thuan
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {businesses.length} places found
              </div>
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:flex lg:h-screen">
        {/* Directory Sidebar */}
        <BusinessDirectory
          businesses={businesses}
          categories={categories}
          onBusinessClick={handleBusinessClick}
          onBusinessLike={handleBusinessLike}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Map */}
        <div className="lg:flex-1 h-96 lg:h-auto">
          <Map
            businesses={businesses}
            onBusinessClick={handleBusinessClick}
            selectedBusiness={selectedBusiness}
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

      <Footer />
    </div>
  );
}
