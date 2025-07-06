import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, Bus, Car, MapPin, Clock, DollarSign, ExternalLink } from 'lucide-react';

export default function GettingHere() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-coral-sunset to-mango-yellow">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundBlendMode: 'overlay'
          }}
        />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-questrial">Getting to Phong Nha</h1>
            <p className="text-xl max-w-2xl mx-auto">Your complete guide to reaching Vietnam's cave paradise</p>
          </div>
        </div>
      </section>

      {/* Main Transportation Options */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* By Air */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-coral-sunset rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plane className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">By Air</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-chili-red mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Dong Hoi Airport</h4>
                      <p className="text-sm text-gray-600">1 hour drive to Phong Nha</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-chili-red mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Hanoi Noi Bai Airport</h4>
                      <p className="text-sm text-gray-600">4 hours drive to Phong Nha</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <h5 className="font-semibold mb-2">Airlines</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Vietnam Airlines</li>
                    <li>• VietJet Air</li>
                    <li>• Bamboo Airways</li>
                  </ul>
                </div>
                <Button className="w-full bg-coral-sunset hover:bg-coral-sunset/90 text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Search Flights
                </Button>
              </CardContent>
            </Card>

            {/* By Bus */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-jade-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bus className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">By Bus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-sea-blue mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">From Hanoi</h4>
                      <p className="text-sm text-gray-600">8-9 hours, multiple daily departures</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-sea-blue mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">From Hue</h4>
                      <p className="text-sm text-gray-600">3-4 hours, regular departures</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-sea-blue mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">From Da Nang</h4>
                      <p className="text-sm text-gray-600">5-6 hours, daily departures</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <h5 className="font-semibold mb-2">Bus Companies</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Sinh Tourist</li>
                    <li>• Futa Bus Lines</li>
                    <li>• Mai Linh Express</li>
                  </ul>
                </div>
                <Button variant="outline" className="w-full border-jade-green text-jade-green hover:bg-jade-green hover:text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Bus Schedules
                </Button>
              </CardContent>
            </Card>

            {/* By Car */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-mango-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">By Car</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-tropical-aqua mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Highway 1A Route</h4>
                      <p className="text-sm text-gray-600">Scenic coastal drive with ocean views</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <DollarSign className="w-5 h-5 text-tropical-aqua mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Car Rental</h4>
                      <p className="text-sm text-gray-600">$25-50/day, international license required</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Car className="w-5 h-5 text-tropical-aqua mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Private Transfer</h4>
                      <p className="text-sm text-gray-600">Door-to-door service available</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <h5 className="font-semibold mb-2">Rental Companies</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Avis Vietnam</li>
                    <li>• Budget Car Rental</li>
                    <li>• Local operators</li>
                  </ul>
                </div>
                <Button variant="outline" className="w-full border-mango-yellow text-mango-yellow hover:bg-mango-yellow hover:text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Rental Options
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Travel Tips */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-questrial">Travel Tips & Information</h2>
            <p className="text-gray-600">Important information for your journey to Phong Nha</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Getting Around Phong Nha</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold text-chili-red">Motorbike Rental</h4>
                  <p className="text-sm text-gray-600">$5-10/day - most popular option</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sea-blue">Taxi & Grab</h4>
                  <p className="text-sm text-gray-600">Available in main areas</p>
                </div>
                <div>
                  <h4 className="font-semibold text-tropical-aqua">Local Bus</h4>
                  <p className="text-sm text-gray-600">Budget-friendly for longer distances</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Useful Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold text-chili-red">Language</h4>
                  <p className="text-sm text-gray-600">Vietnamese, basic English in tourist areas</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sea-blue">Time Zone</h4>
                  <p className="text-sm text-gray-600">UTC+7 (Indochina Time)</p>
                </div>
                <div>
                  <h4 className="font-semibold text-tropical-aqua">Internet</h4>
                  <p className="text-sm text-gray-600">WiFi widely available, SIM cards cheap</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      

      <Footer />
    </div>
  );
}
