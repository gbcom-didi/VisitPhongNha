import { Hero } from '@/components/hero';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Map, Heart, BookOpen, MessageSquare, Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { BusinessModal } from '@/components/business-modal';
import type { Business } from '@shared/schema';

export default function Landing() {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch premium businesses for the carousel
  const { data: businesses = [] } = useQuery({
    queryKey: ['/api/businesses'],
  });

  const premiumBusinesses = (businesses as Business[]).filter((business: Business) => business.isPremium);

  const scrollToExplore = () => {
    const exploreSection = document.getElementById('explore');
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, premiumBusinesses.length - 2));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(1, premiumBusinesses.length - 2)) % Math.max(1, premiumBusinesses.length - 2));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Hero />
      
      {/* What is Visit Phong Nha Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 font-questrial">What is Visit Phong Nha?</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Visit Phong Nha is your intelligent travel companion, built by locals, travelers, and insiders. 
            Whether you're hiking jungle trails, exploring cave rivers, or sipping coffee in the countryside, 
            we help you experience the real Phong Nha—with curated places, expert tips, and community insights.
          </p>
        </div>
      </section>

      {/* Features Highlight Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Features list */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-mango-yellow rounded-xl flex items-center justify-center flex-shrink-0">
                  <Map className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Explore the Interactive Map</h3>
                  <p className="text-gray-600">
                    Discover curated locations across Phong Nha with our detailed interactive map featuring caves, 
                    restaurants, accommodations, and hidden gems hand-picked by locals and experienced travelers.
                  </p>
                  <Button 
                    variant="link" 
                    className="text-mango-yellow hover:text-mango-yellow/80 p-0 mt-2"
                    onClick={() => window.location.href = '/explore'}
                  >
                    Start exploring <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-chili-red rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Save Your Favourite Places</h3>
                  <p className="text-gray-600">
                    Build your personal travel wishlist by saving the places that catch your eye. 
                    Create the perfect itinerary for your Phong Nha adventure.
                  </p>
                  <Button 
                    variant="link" 
                    className="text-chili-red hover:text-chili-red/80 p-0 mt-2"
                    onClick={() => window.location.href = '/saved'}
                  >
                    View saved places <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-tropical-aqua rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Inspiration</h3>
                  <p className="text-gray-600">
                    Discover the magic of Phong Nha through stories, guides, and local experiences. 
                    Get inspired by authentic adventures and insider knowledge from fellow travelers.
                  </p>
                  <Button 
                    variant="link" 
                    className="text-tropical-aqua hover:text-tropical-aqua/80 p-0 mt-2"
                    onClick={() => window.location.href = '/inspiration'}
                  >
                    Read stories <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-jade-green rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Guestbook</h3>
                  <p className="text-gray-600">
                    Share your experiences, memories, and recommendations with fellow travelers. 
                    Connect with the community and leave your mark on Phong Nha's story.
                  </p>
                  <Button 
                    variant="link" 
                    className="text-jade-green hover:text-jade-green/80 p-0 mt-2"
                    onClick={() => window.location.href = '/guestbook'}
                  >
                    Share your story <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right side - Hero image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                  alt="Phong Nha cave exploration"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-mango-yellow fill-current" />
                  <span className="text-sm font-medium text-gray-900">Curated by locals</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Premium Business Carousel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-questrial">Featured Premium Places</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked premium locations that offer exceptional experiences in Phong Nha
            </p>
          </div>

          {premiumBusinesses.length > 0 ? (
            <div className="relative">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{
                    transform: `translateX(-${currentSlide * (100 / 3)}%)`
                  }}
                >
                  {premiumBusinesses.map((business) => (
                    <div key={business.id} className="w-1/3 flex-shrink-0 px-3">
                      <div 
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
                        onClick={() => setSelectedBusiness(business)}
                      >
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={business.imageUrl || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400'}
                            alt={business.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">{business.name}</h3>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-mango-yellow fill-current" />
                              <span className="text-sm text-gray-600">Premium</span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {business.description || 'Discover this premium location in Phong Nha'}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {business.address ? business.address.split(',').slice(-1)[0] : 'Phong Nha'}
                            </span>
                            {business.rating && (
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-mango-yellow fill-current" />
                                <span className="text-xs text-gray-600">
                                  {parseFloat(business.rating.toString()).toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation buttons */}
              {premiumBusinesses.length > 3 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p>Premium places coming soon...</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="bg-mango-yellow hover:bg-mango-yellow/90 text-white px-8 py-3"
              onClick={() => window.location.href = '/explore'}
            >
              Explore All Places
            </Button>
          </div>
        </div>
      </section>
      <Footer />
      
      {/* Business Modal */}
      {selectedBusiness && (
        <BusinessModal
          business={selectedBusiness}
          isOpen={!!selectedBusiness}
          onClose={() => setSelectedBusiness(null)}
          onLike={() => {}} // Premium carousel doesn't need like functionality
        />
      )}
    </div>
  );
}
