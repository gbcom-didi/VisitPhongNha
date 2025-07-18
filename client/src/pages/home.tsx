import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { useToast } from '@/hooks/use-toast';
import { InteractiveHero } from '@/components/interactive-hero';
import { Button } from '@/components/ui/button';
import { Heart, Map, Lightbulb, BookOpen, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch featured businesses
  const { data: businesses = [] } = useQuery({
    queryKey: ['/api/businesses'],
    enabled: true,
  });

  // Get premium/featured businesses (first 3 for carousel)
  const featuredBusinesses = businesses.slice(0, 3);

  useEffect(() => {
    if (!isLoading && user) {
      toast({
        title: "Welcome back!",
        description: `Hello ${user.firstName || 'there'}, ready to explore Phong Nha's amazing caves?`,
      });
    }
  }, [user, isLoading, toast]);

  // Auto-advance carousel
  useEffect(() => {
    if (featuredBusinesses.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredBusinesses.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredBusinesses.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredBusinesses.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredBusinesses.length) % featuredBusinesses.length);
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
      <section id="what-is-visit-phong-nha" className="py-16 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4 font-questrial" style={{ color: '#FF8B7A' }}>
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
            <h3 className="text-2xl font-bold mb-4 font-questrial" style={{ color: '#F4B942' }}>
              Your Gateway to <span style={{ color: '#F4B942' }}>Adventure</span>
            </h3>
            <p className="text-gray-600 text-sm">
              Everything you need to discover, plan, and experience the magic of Phong Nha's hidden wonders
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Features */}
            <div className="space-y-8">
              {/* Interactive Explorer */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-mango-yellow rounded-lg flex items-center justify-center flex-shrink-0">
                  <Map className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2" style={{ color: '#137065' }}>Interactive Explorer</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Navigate through Phong Nha's mysteries with our intelligent map. Discover hidden caves, local eateries, and 
                    secret spots curated by adventurers and locals.
                  </p>
                  <Button 
                    className="bg-mango-yellow hover:bg-yellow-500 text-white text-sm"
                    onClick={() => window.location.href = '/explore'}
                  >
                    Start Exploring →
                  </Button>
                </div>
              </div>

              {/* Personal Collection */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-coral-sunset rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2" style={{ color: '#137065' }}>Personal Collection</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Curate your perfect adventure by saving places that inspire you. Build your dream itinerary and never miss a hidden gem.
                  </p>
                  <Button 
                    variant="outline"
                    className="border-coral-sunset text-coral-sunset hover:bg-coral-sunset hover:text-white text-sm"
                    onClick={() => window.location.href = '/explore'}
                  >
                    Build Your List →
                  </Button>
                </div>
              </div>

              {/* Bottom Features Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-tropical-aqua rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <h5 className="font-semibold mb-2" style={{ color: '#137065' }}>Stories & Guides</h5>
                  <p className="text-gray-600 text-xs mb-3">
                    Authentic adventures and insider knowledge from fellow travelers.
                  </p>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-tropical-aqua text-tropical-aqua hover:bg-tropical-aqua hover:text-white text-xs"
                    onClick={() => window.location.href = '/inspiration'}
                  >
                    Read Stories →
                  </Button>
                </div>

                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-jade-green rounded-lg flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h5 className="font-semibold mb-2" style={{ color: '#137065' }}>Travel Community</h5>
                  <p className="text-gray-600 text-xs mb-3">
                    Connect with travelers and share your own Phong Nha experiences.
                  </p>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-jade-green text-jade-green hover:bg-jade-green hover:text-white text-xs"
                    onClick={() => window.location.href = '/guestbook'}
                  >
                    Join Community →
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Side - Image with overlay */}
            <div className="relative">
              <div className="relative h-96 rounded-xl overflow-hidden">
                <img 
                  src="/images/vpn-hero-02.png" 
                  alt="Phong Nha Cave Adventure"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-2 flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-gray-700">Loved by Travelers</span>
                </div>
                <div className="absolute bottom-4 left-4 bg-mango-yellow rounded-lg px-3 py-2 flex items-center space-x-2">
                  <Star className="w-4 h-4 text-white fill-current" />
                  <span className="text-sm font-medium text-white">Curated by Locals</span>
                  <span className="text-xs text-white">500+ verified places</span>
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
            <h3 className="text-2xl font-bold mb-4 font-questrial" style={{ color: '#00BCD4' }}>Featured Places</h3>
            <p className="text-gray-600 text-sm">Handpicked locations that offer exceptional experiences in Phong Nha</p>
          </div>

          {featuredBusinesses.length > 0 && (
            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ 
                  transform: `translateX(-${currentSlide * 33.333}%)`,
                  width: `${featuredBusinesses.length * 33.333}%`
                }}
              >
                {featuredBusinesses.map((business, index) => (
                  <div 
                    key={business.id}
                    className="flex-shrink-0 px-3"
                    style={{ width: `${100 / featuredBusinesses.length}%` }}
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <div className="h-48 bg-gray-200 relative">
                        <img 
                          src={business.imageUrl || '/images/my-hoa-lagoon-3.jpg'} 
                          alt={business.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h4 className="text-lg font-semibold mb-2" style={{ color: '#137065' }}>{business.name}</h4>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{business.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">{business.location || 'Vietnam'}</span>
                            {business.rating && (
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-medium">{parseFloat(business.rating).toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Navigation */}
              {featuredBusinesses.length > 1 && (
                <>
                  <button 
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow z-10"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow z-10"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-600" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
