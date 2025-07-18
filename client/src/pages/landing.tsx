import { Hero } from '@/components/hero';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Map, Heart, Lightbulb, Book, Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
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
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-mango-yellow to-coral-sunset bg-clip-text text-transparent font-questrial">What is Visit Phong Nha?</h2>
          <p className="text-lg text-gray-600 leading-relaxed mt-[15px] mb-[15px]">
            Visit Phong Nha is your intelligent travel companion, built by locals, travelers, and insiders. 
            Whether you're hiking jungle trails, exploring cave rivers, or sipping coffee in the countryside, 
            we help you experience the real Phong Nha—with curated places, expert tips, and community insights.
          </p>
        </div>
      </section>
      {/* Features Highlight Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden pt-[24px] pb-[24px]">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-mango-yellow/10 to-coral-sunset/10 rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-tropical-aqua/10 to-jade-green/10 rounded-full translate-x-48 translate-y-48"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-questrial">
              Your Gateway to 
              <span className="bg-gradient-to-r from-mango-yellow to-coral-sunset bg-clip-text text-transparent"> Adventure</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Everything you need to discover, plan, and experience the magic of Phong Nha's hidden wonders
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Enhanced Features */}
            <div className="space-y-6">
              {/* Interactive Map Feature */}
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50">
                <div className="flex items-start space-x-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-mango-yellow to-yellow-400 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Map className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-mango-yellow transition-colors">
                      Interactive Explorer
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      Navigate through Phong Nha's mysteries with our intelligent map. Discover hidden caves, 
                      local eateries, and secret spots curated by adventurers and locals.
                    </p>
                    <Button 
                      className="bg-gradient-to-r from-mango-yellow to-yellow-400 hover:from-yellow-400 hover:to-mango-yellow text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => window.location.href = '/explore'}
                    >
                      Start Exploring <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Favorites Feature */}
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50">
                <div className="flex items-start space-x-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-chili-red to-red-400 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">♥</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-chili-red transition-colors">
                      Personal Collection
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      Curate your perfect adventure by saving places that inspire you. 
                      Build your dream itinerary and never miss a hidden gem.
                    </p>
                    <Button 
                      variant="outline"
                      className="border-2 border-chili-red text-chili-red hover:bg-chili-red hover:text-white transition-all duration-300"
                      onClick={() => window.location.href = '/explore'}
                    >
                      Build Your List <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stories & Community */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-tropical-aqua to-cyan-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-tropical-aqua transition-colors">
                    Stories & Guides
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Authentic adventures and insider knowledge from fellow travelers.
                  </p>
                  <Button 
                    variant="link" 
                    className="text-tropical-aqua hover:text-tropical-aqua/80 p-0 font-semibold"
                    onClick={() => window.location.href = '/inspiration'}
                  >
                    Read Stories <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>

                <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-jade-green to-green-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Book className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-jade-green transition-colors">
                    Travel Community
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Connect with travelers and share your own Phong Nha experiences.
                  </p>
                  <Button 
                    variant="link" 
                    className="text-jade-green hover:text-jade-green/80 p-0 font-semibold"
                    onClick={() => window.location.href = '/guestbook'}
                  >
                    Join Community <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right side - Enhanced Image with Overlays */}
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative group">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                  <img 
                    src="/images/DJI_0411.jpg"
                    alt="Phong Nha cave exploration"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                </div>
                
                {/* Floating Stats Cards */}
                <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-xl border border-gray-100/50 backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-mango-yellow to-yellow-400 rounded-xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-white fill-current" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Curated by Locals</p>
                      <p className="text-xs text-gray-600">500+ verified places</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100/50 backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-jade-green to-green-400 rounded-lg flex items-center justify-center">
                      <Heart className="w-4 h-4 text-white fill-current" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Loved by Travelers</p>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background decoration */}
              <div className="absolute -z-10 top-8 left-8 w-full h-full bg-gradient-to-br from-coral-sunset/20 to-mango-yellow/20 rounded-3xl"></div>
            </div>
          </div>
        </div>
      </section>
      {/* Premium Business Carousel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-tropical-aqua mb-4 font-questrial">Featured Places</h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Handpicked locations that offer exceptional experiences in Phong Nha
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
                              {/* Removed Premium badge */}
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
