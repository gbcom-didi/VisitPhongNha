import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, Bus, Car, MapPin, Clock, DollarSign, ExternalLink } from 'lucide-react';

export default function GettingHereBackup() {
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

      {/* Quick Facts */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-coral-sunset text-white p-6 rounded-lg">
              <Clock className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Average Travel Time</h3>
              <p className="mt-1">6-8 hours from major cities</p>
            </div>
            <div className="bg-tropical-aqua text-white p-6 rounded-lg">
              <DollarSign className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Budget Friendly</h3>
              <p className="mt-1">Bus tickets from $10-20 USD</p>
            </div>
            <div className="bg-jade-green text-white p-6 rounded-lg">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Gateway Location</h3>
              <p className="mt-1">Quang Binh Province, Central Vietnam</p>
            </div>
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
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-chili-red mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Da Nang Airport</h4>
                      <p className="text-sm text-gray-600">4-5 hours drive to Phong Nha</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-coral-sunset mb-2">Airlines</h4>
                  <p className="text-sm text-gray-600">Vietnam Airlines, VietJet Air, Bamboo Airways</p>
                </div>
              </CardContent>
            </Card>

            {/* By Bus */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-tropical-aqua rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bus className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">By Bus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-tropical-aqua mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">From Hanoi</h4>
                      <p className="text-sm text-gray-600">Overnight bus, 10-12 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-tropical-aqua mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">From Da Nang/Hoi An</h4>
                      <p className="text-sm text-gray-600">7-8 hours direct</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-tropical-aqua mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">From Hue</h4>
                      <p className="text-sm text-gray-600">4-5 hours direct</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-tropical-aqua mb-2">Popular Operators</h4>
                  <p className="text-sm text-gray-600">Queen Cafe, The Sinh Tourist, Grouptour</p>
                </div>
              </CardContent>
            </Card>

            {/* By Train */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-jade-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">By Train + Transfer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-jade-green mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Dong Hoi Station</h4>
                      <p className="text-sm text-gray-600">45 minutes to Phong Nha by bus/taxi</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-jade-green mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">From Hanoi</h4>
                      <p className="text-sm text-gray-600">9-11 hours by train</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-jade-green mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">From Hue</h4>
                      <p className="text-sm text-gray-600">2-3 hours by train</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-jade-green mb-2">Train Classes</h4>
                  <p className="text-sm text-gray-600">Hard seat, Soft seat, Sleeper berths</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Routes */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-questrial">Popular Travel Routes</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Choose the best option for your departure city</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* From Hanoi */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl text-coral-sunset">From Hanoi</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start p-3 bg-gray-50 rounded">
                      <div>
                        <h4 className="font-semibold">Overnight Bus</h4>
                        <p className="text-sm text-gray-600">Sleeper bus, air-con, WiFi</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">$15-35</p>
                        <p className="text-sm text-gray-600">10-12h</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-start p-3 bg-gray-50 rounded">
                      <div>
                        <h4 className="font-semibold">Train + Bus</h4>
                        <p className="text-sm text-gray-600">Overnight train to Dong Hoi</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">$30-35</p>
                        <p className="text-sm text-gray-600">11-12h</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-start p-3 bg-gray-50 rounded">
                      <div>
                        <h4 className="font-semibold">Flight + Transfer</h4>
                        <p className="text-sm text-gray-600">Fly to Dong Hoi + taxi</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">$60-120</p>
                        <p className="text-sm text-gray-600">3-4h</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* From Da Nang/Hoi An */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl text-tropical-aqua">From Da Nang / Hoi An</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start p-3 bg-gray-50 rounded">
                      <div>
                        <h4 className="font-semibold">Direct Bus</h4>
                        <p className="text-sm text-gray-600">Queen Cafe, Grouptour</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">$15-20</p>
                        <p className="text-sm text-gray-600">7-8h</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-start p-3 bg-gray-50 rounded">
                      <div>
                        <h4 className="font-semibold">Train + Bus</h4>
                        <p className="text-sm text-gray-600">Train to Dong Hoi + local bus</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">$15-25</p>
                        <p className="text-sm text-gray-600">6-7h</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-start p-3 bg-gray-50 rounded">
                      <div>
                        <h4 className="font-semibold">Private Car</h4>
                        <p className="text-sm text-gray-600">Direct transfer</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">$150-180</p>
                        <p className="text-sm text-gray-600">6h</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                <CardTitle className="text-xl">Booking Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold text-coral-sunset">Book in Advance</h4>
                  <p className="text-sm text-gray-600">Especially during peak season (Oct-Apr)</p>
                </div>
                <div>
                  <h4 className="font-semibold text-jade-green">Bring Cash</h4>
                  <p className="text-sm text-gray-600">Vietnamese Dong for local transport</p>
                </div>
                <div>
                  <h4 className="font-semibold text-mango-yellow">Check Weather</h4>
                  <p className="text-sm text-gray-600">Rainy season can affect transport</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Booking Resources */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 font-questrial">Booking Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Button
              variant="outline"
              className="h-16 border-coral-sunset text-coral-sunset hover:bg-coral-sunset hover:text-white"
              asChild
            >
              <a href="https://www.12go.asia" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-5 h-5 mr-2" />
                12Go Asia
              </a>
            </Button>
            <Button
              variant="outline"
              className="h-16 border-tropical-aqua text-tropical-aqua hover:bg-tropical-aqua hover:text-white"
              asChild
            >
              <a href="https://www.thesinhtourist.vn" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-5 h-5 mr-2" />
                The Sinh Tourist
              </a>
            </Button>
            <Button
              variant="outline"
              className="h-16 border-jade-green text-jade-green hover:bg-jade-green hover:text-white"
              asChild
            >
              <a href="https://www.vietjetair.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-5 h-5 mr-2" />
                VietJet Air
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}