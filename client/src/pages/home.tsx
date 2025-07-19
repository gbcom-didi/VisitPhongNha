import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { useToast } from '@/hooks/use-toast';
import { InteractiveHero } from '@/components/interactive-hero';
import { Button } from '@/components/ui/button';
import { Heart, Map, Lightbulb, BookOpen, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { BusinessModal } from '@/components/business-modal';
import type { BusinessWithCategory } from '@shared/schema';

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessWithCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all businesses
  const { data: businesses = [] } = useQuery<BusinessWithCategory[]>({
    queryKey: ['/api/businesses'],
    enabled: true,
  });

  // Get only premium businesses for carousel
  const featuredBusinesses = businesses.filter(business => business.isPremium);

  useEffect(() => {
    if (!isLoading && user) {
      toast({
        title: "Welcome back!",
        description: `Hello ${user.firstName || 'there'}, ready to explore Phong Nha's amazing caves?`,
      });
    }
  }, [user, isLoading, toast]);

  // Simple grid layout - no carousel navigation needed

  const handleBusinessClick = (business: BusinessWithCategory) => {
    setSelectedBusiness(business);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBusiness(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chili-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <InteractiveHero />
      {/* What is Visit Phong Nha Section */}
      <section id="what-is-visit-phong-nha" className="py-16 bg-white scroll-mt-20 pt-[34px] pb-[34px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-bold mb-4 font-questrial bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 bg-clip-text text-transparent text-[26px]">
              What is Visit Phong Nha?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm">
              Visit Phong Nha is your intelligent travel companion, built by locals, travelers, and insiders. Whether 
              you're hiking jungle trails, exploring cave rivers, or sipping coffee in the countryside, we help you 
              experience the real Phong Nha—with curated places, expert tips, and community insights.
            </p>
          </div>
        </div>
      </section>
      {/* Your Gateway to Adventure Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="font-bold mb-4 font-questrial text-gray-900 text-[28px]">
              Your Gateway to <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">Adventure</span>
            </h3>
            <p className="text-gray-600 text-sm">
              Everything you need to discover, plan, and experience the magic of Phong Nha's hidden wonders
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Features */}
            <div className="space-y-8">
              {/* Interactive Explorer */}
              <div className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-mango-yellow to-yellow-500 shadow-md">
                  <Map className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2 bg-gradient-to-r from-teal-700 to-teal-600 bg-clip-text text-[#ecb412]">Interactive Explorer</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Navigate through Phong Nha's mysteries with our intelligent map. Discover hidden caves, local eateries, and 
                    secret spots curated by adventurers and locals.
                  </p>
                  <Button 
                    className="bg-gradient-to-r from-mango-yellow to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white text-sm shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => window.location.href = '/explore'}
                  >
                    Start Exploring →
                  </Button>
                </div>
              </div>

              {/* Personal Collection */}
              <div className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-coral-sunset to-red-500 shadow-md">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2 bg-gradient-to-r from-teal-700 to-teal-600 bg-clip-text text-[#f35f4a]">Personal Collection</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Curate your perfect adventure by saving places that inspire you. Build your dream itinerary and never miss a hidden gem.
                  </p>
                  <Button 
                    variant="outline"
                    className="border-coral-sunset text-coral-sunset hover:bg-gradient-to-r hover:from-coral-sunset hover:to-red-500 hover:text-white text-sm shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => window.location.href = '/explore'}
                  >
                    Build Your List →
                  </Button>
                </div>
              </div>

              {/* Bottom Features Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 bg-gradient-to-br from-tropical-aqua to-cyan-600 shadow-md">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <h5 className="font-semibold mb-2 bg-gradient-to-r from-teal-700 to-teal-600 bg-clip-text text-transparent">Stories & Guides</h5>
                  <p className="text-gray-600 text-xs mb-3">
                    Authentic adventures and insider knowledge from fellow travelers.
                  </p>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-tropical-aqua text-tropical-aqua hover:bg-gradient-to-r hover:from-tropical-aqua hover:to-cyan-600 hover:text-white text-xs shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => window.location.href = '/inspiration'}
                  >
                    Read Stories →
                  </Button>
                </div>

                <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 bg-gradient-to-br from-jade-green to-teal-600 shadow-md">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h5 className="font-semibold mb-2 bg-gradient-to-r from-teal-700 to-teal-600 bg-clip-text text-transparent">Travel Community</h5>
                  <p className="text-gray-600 text-xs mb-3">
                    Connect with travelers and share your own Phong Nha experiences.
                  </p>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-jade-green text-jade-green hover:bg-gradient-to-r hover:from-jade-green hover:to-teal-600 hover:text-white text-xs shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => window.location.href = '/guestbook'}
                  >
                    Join Community →
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Side - Image with overlay */}
            <div className="relative">
              <div className="relative h-96 rounded-xl overflow-hidden shadow-xl">
                <img 
                  src="/images/DJI_0411.jpg" 
                  alt="Phong Nha Cave Adventure"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-2 flex items-center space-x-2 shadow-lg">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-gray-700">Loved by Travelers</span>
                </div>
                <div className="absolute bottom-4 left-4 bg-gradient-to-r from-mango-yellow to-yellow-500 rounded-lg px-3 py-2 flex items-center space-x-2 shadow-lg">
                  <Star className="w-4 h-4 text-white fill-current" />
                  <span className="text-sm font-medium text-white">Curated by Locals</span>
                  <span className="text-xs text-white">100+ verified places</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Featured Places Carousel */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4 font-questrial bg-gradient-to-r from-tropical-aqua to-cyan-600 bg-clip-text text-transparent">Featured Places</h3>
            <p className="text-gray-600 text-sm">Handpicked locations that offer exceptional experiences in Phong Nha</p>
          </div>

          {featuredBusinesses.length > 0 ? (
            <div className="relative">
              {/* Business Cards Grid/Carousel */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredBusinesses.map((business) => (
                  <div 
                    key={business.id}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                    onClick={() => handleBusinessClick(business)}
                  >
                    {/* Business Image */}
                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                      <img 
                        src={business.imageUrl || '/images/my-hoa-lagoon-3.jpg'} 
                        alt={business.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    
                    {/* Business Info */}
                    <div className="p-6">
                      <div className="mb-3">
                        <h4 className="text-lg font-semibold mb-2 line-clamp-1" style={{ color: '#137065' }}>
                          {business.name}
                        </h4>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {business.description}
                        </p>
                      </div>
                      
                      {/* Rating and Location */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Vietnam</span>
                        </div>
                        
                        {business.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{parseFloat(business.rating).toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Category Badge */}
                      {business.category && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <span 
                            className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: business.category.color }}
                          >
                            {business.category.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Explore More Button */}
              <div className="text-center mt-8">
                <Link href="/explore">
                  <Button
                    size="lg"
                    className="bg-coral-sunset hover:bg-coral-sunset/90 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Explore More
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No premium places available at the moment.</p>
            </div>
          )}
        </div>
      </section>
      {/* Business Modal */}
      {selectedBusiness && (
        <BusinessModal
          business={selectedBusiness}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
      <Footer />
    </div>
  );
}
