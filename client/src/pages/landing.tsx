import { Hero } from '@/components/hero';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Map, Heart, Navigation as NavigationIcon, Plane, Bus, Car } from 'lucide-react';

export default function Landing() {
  const scrollToExplore = () => {
    const exploreSection = document.getElementById('explore');
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Hero />
      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4 font-questrial">How Visit Phong Nha Works</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover, save, and experience the best of Phong Nha with our interactive travel platform 
              designed for adventurers and culture seekers. Soon you'll be able to chat with our intelligent, AI-powered travel assistant to help you explore, plan, and personalise your next adventure.
            </p>    
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-mango-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <Map className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Explore Interactive Map</h4>
              <p className="text-gray-600">
                Browse cave sites, restaurants, accommodations, and attractions on our detailed map.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-coral-sunset rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Save Your Favorites</h4>
              <p className="text-gray-600">
                Create your personal travel wishlist by saving places you want to visit.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-jade-green rounded-full flex items-center justify-center mx-auto mb-4">
                <NavigationIcon className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Get Directions</h4>
              <p className="text-gray-600">
                Navigate easily to your chosen destinations with integrated directions.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Featured Categories Section */}
      <section id="explore" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4 font-questrial">Explore Categories</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From world-class kitesurfing to authentic Vietnamese cuisine and stunning natural attractions.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group cursor-pointer" onClick={() => window.location.href = '/explore?category=kiting'}>
              <div 
                className="relative h-48 bg-cover bg-center rounded-xl overflow-hidden mb-4"
                style={{
                  backgroundImage: `url('/images/kitesurfing-vietnam-01.jpg')`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/70 transition-all" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="text-xl font-semibold">Kitesurfing</h4>
                  <p className="text-sm opacity-90">15+ spots</p>
                </div>
              </div>
            </div>
            <div className="group cursor-pointer" onClick={() => window.location.href = '/explore?category=food-drink'}>
              <div 
                className="relative h-48 bg-cover bg-center rounded-xl overflow-hidden mb-4"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400')`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent group-hover:from-black/30 transition-all" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="text-xl font-semibold">Food & Drink</h4>
                  <p className="text-sm opacity-90">25+ restaurants</p>
                </div>
              </div>
            </div>
            <div className="group cursor-pointer" onClick={() => window.location.href = '/explore?category=accommodation'}>
              <div 
                className="relative h-48 bg-cover bg-center rounded-xl overflow-hidden mb-4"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400')`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent group-hover:from-black/30 transition-all" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="text-xl font-semibold">Accommodation</h4>
                  <p className="text-sm opacity-90">12+ places</p>
                </div>
              </div>
            </div>
            <div className="group cursor-pointer" onClick={() => window.location.href = '/explore?category=attractions'}>
              <div 
                className="relative h-48 bg-cover bg-center rounded-xl overflow-hidden mb-4"
                style={{
                  backgroundImage: `url('/images/my-hoa-tower-2.jpg')`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent group-hover:from-black/30 transition-all" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="text-xl font-semibold">Attractions</h4>
                  <p className="text-sm opacity-90">20+ places</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button 
              size="lg"
              className="bg-chili-red hover:bg-red-600 text-white px-8 py-3"
              onClick={() => window.location.href = '/explore'}
            >
              Explore All Places
            </Button>
          </div>
        </div>
      </section>
      {/* Getting Here Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4 font-questrial">Getting to Ninh Thuan</h3>
            <p className="text-gray-600">Multiple ways to reach this kitesurfing paradise</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-chili-red rounded-lg flex items-center justify-center mb-4">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">By Air</h4>
              <p className="text-gray-600 mb-4">
                Fly into Cam Ranh International Airport (1.5 hours drive) or Ho Chi Minh City (4 hours drive).
              </p>
              <Button 
                variant="link" 
                className="text-chili-red hover:text-red-600 p-0"
                onClick={() => window.location.href = '/getting-here'}
              >
                View flight options →
              </Button>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-sea-blue rounded-lg flex items-center justify-center mb-4">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">By Bus</h4>
              <p className="text-gray-600 mb-4">
                Regular bus services from Ho Chi Minh City, Nha Trang, and Da Lat to Phan Rang city.
              </p>
              <Button 
                variant="link" 
                className="text-chili-red hover:text-red-600 p-0"
                onClick={() => window.location.href = '/getting-here'}
              >
                Bus schedules →
              </Button>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-tropical-aqua rounded-lg flex items-center justify-center mb-4">
                <Car className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">By Car</h4>
              <p className="text-gray-600 mb-4">
                Scenic coastal drive via Highway 1A. Rent a car or book private transfer.
              </p>
              <Button 
                variant="link" 
                className="text-chili-red hover:text-red-600 p-0"
                onClick={() => window.location.href = '/getting-here'}
              >
                Rental options →
              </Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
