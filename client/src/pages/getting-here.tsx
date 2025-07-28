import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plane, Bus, Train, Car, MapPin, Clock, DollarSign, ExternalLink, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function GettingHere() {
  const routes = {
    hanoi: {
      name: 'Hanoi',
      color: 'mango-yellow',
      options: [
        {
          type: 'Overnight Bus',
          icon: Bus,
          duration: '12h 27m',
          price: '300,000-400,000 VND',
          details: 'TBus leaves at 17:30, arrives 04:04. Grouptour departs 17:30, arrives 05:57. Sleeper buses with reclining seats, AC, WiFi',
          companies: ['TBus', 'Grouptour', 'Other operators']
        },
        {
          type: 'Train to Đồng Hới',
          icon: Train,
          duration: '9-11 hours',
          price: '700,000-800,000 VND',
          details: 'Soft-sleeper berths. Overnight trains depart 19:00-22:00',
          companies: ['Vietnam Railways']
        },
        {
          type: 'Flight to Đồng Hới',
          icon: Plane,
          duration: '1h 20m + transfer',
          price: '700,000-1,200,000 VND',
          details: 'Flight takes 1h20m. 45km transfer to Phong Nha from airport',
          companies: ['Vietnam Airlines', 'VietJet Air', 'Bamboo Airways']
        },
        {
          type: 'Motorbike',
          icon: Car,
          duration: '2 days',
          price: '200,000-300,000 VND/day',
          details: 'Over 500km journey. Scenic but long ride via Ho Chi Minh Highway',
          companies: ['Local rental shops']
        }
      ]
    },
    danang: {
      name: 'Da Nang',
      color: 'coral-sunset',
      options: [
        {
          type: 'Direct Bus',
          icon: Bus,
          duration: '6h 45m',
          price: '300,000-400,000 VND',
          details: 'Queen Cafe Bus leaves 14:15, arrives 21:00. Grouptour departs 14:30, arrives 21:48. Sleeper buses with AC, WiFi',
          companies: ['Queen Cafe', 'Grouptour']
        },
        {
          type: 'Train to Đồng Hới',
          icon: Train,
          duration: '4-5 hours',
          price: '280,000-450,000 VND',
          details: 'Take train to Đồng Hới, then bus/taxi to Phong Nha. Soft seats available',
          companies: ['Vietnam Railways']
        },
        {
          type: 'Private Transfer',
          icon: Car,
          duration: '6 hours',
          price: '3,700,000 VND',
          details: 'Direct car transfer from Da Nang to Phong Nha',
          companies: ['Private operators']
        },
        {
          type: 'Motorbike',
          icon: Car,
          duration: '6-7 hours',
          price: '150,000-200,000 VND/day',
          details: 'Scenic ride via QL 1A and Ho Chi Minh Highway',
          companies: ['Local rental shops']
        }
      ]
    },
    hoian: {
      name: 'Hội An',
      color: 'tropical-aqua',
      options: [
        {
          type: 'Direct Bus',
          icon: Bus,
          duration: '8h 30m',
          price: '300,000-430,000 VND',
          details: 'Green Trips (13:15-21:45), Grouptour (13:30-21:33), Queen Cafe (13:30-21:00), TBus (07:00-16:00)',
          companies: ['Green Trips', 'Grouptour', 'Queen Cafe', 'TBus']
        },
        {
          type: 'Train via Da Nang',
          icon: Train,
          duration: '5-6 hours total',
          price: '280,000-450,000 VND',
          details: 'Taxi/shuttle 30km to Da Nang station, then train to Đồng Hới, then bus to Phong Nha',
          companies: ['Vietnam Railways']
        },
        {
          type: 'Private Car',
          icon: Car,
          duration: '6-7 hours',
          price: '4,400,000 VND',
          details: 'Direct private transfer from Hội An to Phong Nha',
          companies: ['Private operators']
        }
      ]
    },
    hue: {
      name: 'Huế',
      color: 'jade-green',
      options: [
        {
          type: 'Direct Bus',
          icon: Bus,
          duration: '4 hours',
          price: '300,000 VND',
          details: 'Full Moon Party Tour runs 4 daily buses from TM Brother office at 16:20, 16:30, 16:35, 16:40, arriving 20:30',
          companies: ['Full Moon Party Tour']
        },
        {
          type: 'Train to Đồng Hới',
          icon: Train,
          duration: '2-3 hours',
          price: '100,000-250,000 VND',
          details: 'Hard seats from 100,000 VND, soft seats 160,000 VND, soft-sleeper berths 250,000 VND',
          companies: ['Vietnam Railways']
        },
        {
          type: 'Private Car',
          icon: Car,
          duration: '3-4 hours',
          price: '1,300,000-1,500,000 VND',
          details: 'Direct private car or taxi transfer from Huế to Phong Nha',
          companies: ['Private operators']
        },
        {
          type: 'Motorbike',
          icon: Car,
          duration: '4-5 hours',
          price: '150,000-200,000 VND/day',
          details: '220km ride along Ho Chi Minh Road',
          companies: ['Local rental shops']
        }
      ]
    },
    ninhbinh: {
      name: 'Ninh Bình',
      color: 'mango-yellow',
      options: [
        {
          type: 'Direct Bus',
          icon: Bus,
          duration: '8 hours',
          price: '350,000-600,000 VND',
          details: 'Queen Cafe from central station (20:00-04:00) or Tam Coc (20:30-04:00). Grouptour morning bus (04:00-12:45). Full Moon Party VIP cabins',
          companies: ['Queen Cafe', 'Grouptour', 'Full Moon Party Tour']
        },
        {
          type: 'Train to Đồng Hới',
          icon: Train,
          duration: '7-8 hours',
          price: '350,000-700,000 VND',
          details: 'Soft seats 350,000 VND, soft-sleeper berths 550,000-700,000 VND',
          companies: ['Vietnam Railways']
        },
        {
          type: 'Private Car',
          icon: Car,
          duration: '7-8 hours',
          price: '4,000,000-6,000,000 VND',
          details: '470km journey, one-way private car hire',
          companies: ['Private operators']
        },
        {
          type: 'Motorbike',
          icon: Car,
          duration: '10 hours',
          price: '200,000 VND/day',
          details: 'Long ride via Ho Chi Minh Highway',
          companies: ['Local rental shops']
        }
      ]
    },
    donghoi: {
      name: 'Đồng Hới',
      color: 'coral-sunset',
      options: [
        {
          type: 'Local Bus (B4/B1)',
          icon: Bus,
          duration: '1 hour',
          price: '35,000 VND',
          details: 'B4 from Post Office 05:30-17:00 hourly, stops at tourist centre. B1 similar timetable, stops on highway',
          companies: ['Local bus service']
        },
        {
          type: 'Taxi / Grab',
          icon: Car,
          duration: '45-60 minutes',
          price: '600,000-700,000 VND',
          details: 'Taxi or rideshare direct to Phong Nha',
          companies: ['Grab', 'Local taxis']
        },
        {
          type: 'Private Car',
          icon: Car,
          duration: '45 minutes',
          price: '600,000-900,000 VND',
          details: '600,000 VND sedan, 700,000 VND SUV, 900,000 VND 16-seat van',
          companies: ['Private operators']
        },
        {
          type: 'Motorbike',
          icon: Car,
          duration: '1 hour',
          price: '100,000-120,000 VND/day',
          details: '45km ride via QL 1A and QL 15',
          companies: ['Local rental shops']
        }
      ]
    }
  };

  const [selectedRoute, setSelectedRoute] = useState('hanoi');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-80 bg-gradient-to-r from-tropical-aqua to-jade-green">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Getting to Phong Nha</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-4">
              Your gateway to Vietnam's spectacular cave kingdom
            </p>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Phong Nha is a small village beside the Son River and the main gateway to Phong Nha-Ke Bang National Park
            </p>
          </div>
        </div>
      </section>

      {/* Route Selection Tabs */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Starting Point</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select your departure city to see detailed travel options with current schedules and prices
            </p>
          </div>

          <Tabs value={selectedRoute} onValueChange={setSelectedRoute} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto p-2 bg-gray-100 rounded-xl">
              {Object.entries(routes).map(([key, route]) => (
                <TabsTrigger 
                  key={key} 
                  value={key}
                  className="data-[state=active]:bg-white data-[state=active]:shadow-md py-3 px-2 text-sm font-medium"
                >
                  {route.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(routes).map(([key, route]) => (
              <TabsContent key={key} value={key} className="mt-8">
                <div className="mb-8">
                  <h3 className={`text-3xl font-bold mb-2 ${
                    route.color === 'mango-yellow' ? 'text-mango-yellow' :
                    route.color === 'coral-sunset' ? 'text-coral-sunset' :
                    route.color === 'tropical-aqua' ? 'text-tropical-aqua' :
                    'text-jade-green'
                  }`}>From {route.name}</h3>
                  <p className="text-gray-600">All information verified from schedules and booking sites during July 2025</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {route.options.map((option, index) => {
                    const IconComponent = option.icon;
                    const bgColorClass = 
                      route.color === 'mango-yellow' ? 'bg-mango-yellow' :
                      route.color === 'coral-sunset' ? 'bg-coral-sunset' :
                      route.color === 'tropical-aqua' ? 'bg-tropical-aqua' :
                      'bg-jade-green';
                    
                    return (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className={`w-12 h-12 ${bgColorClass} rounded-lg flex items-center justify-center`}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">{option.type}</CardTitle>
                              <div className="flex items-center space-x-4 mt-1">
                                <Badge variant="secondary" className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{option.duration}</span>
                                </Badge>
                                <Badge variant="outline" className="flex items-center space-x-1">
                                  <DollarSign className="w-3 h-3" />
                                  <span>{option.price}</span>
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4">{option.details}</p>
                          <div className="border-t pt-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Available through:</p>
                            <div className="flex flex-wrap gap-2">
                              {option.companies.map((company, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {company}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Practical Tips */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Practical Travel Tips</h2>
            <p className="text-xl text-gray-600">Essential information for a smooth journey to Phong Nha</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-mango-yellow/20">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-mango-yellow" />
                  <CardTitle className="text-xl text-mango-yellow">Before You Travel</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Check Schedules</h4>
                  <p className="text-sm text-gray-600">Bus and train timetables can change. Confirm departure times with operators 1-2 days before travel.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Book Early</h4>
                  <p className="text-sm text-gray-600">Sleeper bus seats and soft-sleeper train berths sell out quickly during peak season.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Bring Cash</h4>
                  <p className="text-sm text-gray-600">Local buses and taxis often require payment in cash (VND). Keep small notes for fares and snacks.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-tropical-aqua/20">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Info className="w-8 h-8 text-tropical-aqua" />
                  <CardTitle className="text-xl text-tropical-aqua">Transfers in Đồng Hới</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">From Airport/Train Station</h4>
                  <p className="text-sm text-gray-600">Arrange transfer from Đồng Hới to Phong Nha in advance. Local buses depart from Post Office.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Local Bus B4</h4>
                  <p className="text-sm text-gray-600">Runs hourly 05:30-17:00 from Đồng Hới Post Office, stops at Phong Nha tourist centre.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Private Transport</h4>
                  <p className="text-sm text-gray-600">Taxis and private cars can be booked in advance for direct transfers.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Reference */}
          <div className="mt-12 bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Distance Reference</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-mango-yellow">500km</div>
                <div className="text-sm text-gray-600">From Hanoi</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-coral-sunset">320km</div>
                <div className="text-sm text-gray-600">From Da Nang</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-tropical-aqua">350km</div>
                <div className="text-sm text-gray-600">From Hội An</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-jade-green">220km</div>
                <div className="text-sm text-gray-600">From Huế</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-mango-yellow">470km</div>
                <div className="text-sm text-gray-600">From Ninh Bình</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-coral-sunset">45km</div>
                <div className="text-sm text-gray-600">From Đồng Hới</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}