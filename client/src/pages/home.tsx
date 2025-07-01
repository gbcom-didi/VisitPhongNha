import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { useToast } from '@/hooks/use-toast';
import { Hero } from '@/components/hero';
import { Button } from '@/components/ui/button';
import { Heart, Map, TrendingUp } from 'lucide-react';

export default function Home() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && user) {
      toast({
        title: "Welcome back!",
        description: `Hello ${user.firstName || 'there'}, ready to explore Ninh Thuan?`,
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
      <Hero />

      {/* Welcome Section */}
      <section id="what-is-visit-phong-nha" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4 font-questrial" style={{ color: '#137065' }}>
              Welcome to Your Phan Rang Adventure, {user?.firstName || 'Traveler'}!
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm">
              Your personalized guide to kitesurfing paradise and Vietnamese culture awaits. 
              Start exploring, saving places, and creating unforgettable memories.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-mango-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <Map className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#137065' }}>Explore Places</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Discover amazing kitesurfing spots, restaurants, and attractions on our interactive map.
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
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#137065' }}>Save Favorites</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Create your personal travel wishlist by liking places you want to visit.
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
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#137065' }}>Plan Your Trip</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Get insider tips on getting here, getting around, and making the most of your visit.
              </p>
              <Button 
                variant="outline"
                className="border-sea-blue text-sea-blue hover:bg-sea-blue hover:text-white"
                onClick={() => window.location.href = '/getting-here'}
              >
                Plan Your Trip
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-xl font-bold mb-4 font-questrial" style={{ color: '#137065' }}>Popular Right Now</h3>
            <p className="text-gray-600 text-sm">Top categories travelers are exploring in Phan Rang</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div 
              className="group cursor-pointer bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
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
              className="group cursor-pointer bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
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
                Discover authentic Vietnamese restaurants and street food favorites.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
