import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { useToast } from '@/hooks/use-toast';
import { InteractiveHero } from '@/components/interactive-hero';
import { Button } from '@/components/ui/button';
import { Heart, Map, TrendingUp } from 'lucide-react';

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && user) {
      toast({
        title: "Welcome back!",
        description: `Hello ${user.firstName || 'there'}, ready to explore Phong Nha's amazing caves?`,
      });
    }
  }, [user, isLoading, toast]);

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

      {/* Welcome Section */}
      <section id="what-is-visit-phong-nha" className="py-16 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4 font-questrial" style={{ color: '#FF8B7A' }}>
              What is Visit Phong Nha?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm">
              Your intelligent travel companion for Phong Nha region. We combine local expertise 
              with modern technology to help you discover the world's most spectacular cave systems, 
              authentic local culture, and hidden gems known only to locals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-mango-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <Map className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#F7E74A' }}>Explore Places</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Discover spectacular caves, local restaurants, and unique attractions on our interactive map.
              </p>
              <Button 
                className="bg-tropical-aqua hover:bg-cyan-600 text-white"
                onClick={() => window.location.href = '/explore'}
              >
                Start Exploring
              </Button>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-coral-sunset rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#FF5733' }}>Save Favorites</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Create your personal travel wishlist by liking caves and places you want to explore.
              </p>
              <Button 
                variant="outline"
                className="border-tropical-aqua text-tropical-aqua hover:bg-tropical-aqua hover:text-white"
                onClick={() => window.location.href = '/explore'}
              >
                Find Places to Save
              </Button>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-jade-green rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#0AA892' }}>Get Inspired</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Read local stories and discover hidden adventures from fellow travelers.
              </p>
              <Button 
                variant="outline"
                className="border-tropical-aqua text-tropical-aqua hover:bg-tropical-aqua hover:text-white"
                onClick={() => window.location.href = '/inspiration'}
              >
                Get Inspired
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-xl font-bold mb-4 font-questrial" style={{ color: '#0AA892' }}>Featured Places</h3>
            <p className="text-gray-600 text-sm">Discover extraordinary places that showcase the best of Phong Nha</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div 
              className="group cursor-pointer bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-200"
              onClick={() => window.location.href = '/explore?category=kiting'}
            >
              <div className="flex items-center mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                  style={{ backgroundColor: '#3FC1C4' }}
                >
                  <Map className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-base font-semibold" style={{ color: '#137065' }}>Kitesurfing Schools</h4>
                  <p className="text-xs text-gray-600">Learn from the pros</p>
                </div>
              </div>
              <p className="text-gray-600 text-xs">
                Find the best kitesurfing schools and spots with perfect wind conditions.
              </p>
            </div>

            <div 
              className="group cursor-pointer bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-200"
              onClick={() => window.location.href = '/explore?category=food-drink'}
            >
              <div className="flex items-center mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                  style={{ backgroundColor: '#F7BAAD' }}
                >
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-base font-semibold" style={{ color: '#137065' }}>Local Cuisine</h4>
                  <p className="text-xs text-gray-600">Authentic flavors</p>
                </div>
              </div>
              <p className="text-gray-600 text-xs">
                Discover authentic local restaurants and street food favorites.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
