import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Users, Map, Target, Wind, Camera } from 'lucide-react';

export default function About() {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-questrial">About Visit Phong Nha</h1>
            <p className="text-xl max-w-2xl mx-auto">Connecting travelers with Vietnam's hidden paradise</p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-questrial">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Visit Phong Nha is Vietnam's premier travel platform dedicated to showcasing the incredible beauty and adventure opportunities of Quang Binh province. We're passionate about connecting international explorers and curious travelers with authentic Vietnamese experiences, local businesses, and unforgettable adventures.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 shadow-lg">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-coral-sunset rounded-lg flex items-center justify-center mr-4">
                    <Wind className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">For the Adventurous Traveler</h3>
                </div>
                <p className="text-gray-600">
                  We understand the unique needs of adventurous travelers - from self-guided tours to the best caves for different experience levels. Our platform is built by adventurers, for adventurers.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 shadow-lg">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-jade-green rounded-lg flex items-center justify-center mr-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Supporting Local Businesses</h3>
                </div>
                <p className="text-gray-600">
                  Every listing on our platform supports local Vietnamese entrepreneurs. From family-run restaurants to boutique accommodations, we help travelers discover authentic experiences.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-questrial">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Visit Phong Nha began as a passion project inspired by a deep love for the region’s stunning landscapes, vibrant culture, and warm hospitality. Created by long-time residents, locals and repeat visitos, the goal was to build a truly useful guide that captures the magic of this extraordinary place.
                </p>
                <p>
                  What started as a simple map of of places to visit, has now evolved into Vietnam's most comprehensive travel platform for Phong Nha. We've partnered with local businesses, cultural experts, and adventure guides to create an authentic, insider's perspective on this remarkable destination.
                </p>
                <p>
                  Today, Visit Phong Nha serves thousands of travelers annually, helping them discover not just the world-class cave exploration, but also the rich local culture, delicious local cuisine, and stunning natural landscapes that make Phong Nha truly special.
                </p>
              </div>
            </div>
            <div className="lg:order-first">
              <div 
                className="aspect-square bg-cover bg-center rounded-2xl shadow-xl"
                style={{
                  backgroundImage: `url('images/IMG_2089.jpg')`
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-questrial">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at Visit Phong Nha
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-tropical-aqua rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Authentic Experiences</h3>
              <p className="text-gray-600">
                We showcase genuine Vietnamese culture and experiences, not tourist traps. Every recommendation comes from local knowledge and personal experience.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-tropical-aqua rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community First</h3>
              <p className="text-gray-600">
                We believe in building bridges between travelers and local communities, creating mutually beneficial relationships that last beyond a single visit.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-tropical-aqua rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Sustainable Tourism</h3>
              <p className="text-gray-600">
                We promote responsible travel practices that preserve Phong Nha's natural beauty and cultural heritage for future generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-questrial">The Future of Visit Phong Nha</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our vision extends beyond Phong Nha. We're building a scalable network of regional tourism hubs across Vietnam, each celebrating the unique character and opportunities of different provinces. From the islands of Phu Quy to the beaches of Phan Rang, we aim to become Vietnam's most trusted travel companion.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <Map className="w-8 h-8 text-tropical-aqua mr-3" />
                  <h3 className="text-xl font-semibold">Expanding Coverage</h3>
                </div>
                <p className="text-gray-600">
                  We're actively mapping new regions across Vietnam, bringing the same detailed, authentic travel information to more destinations.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <Camera className="w-8 h-8 text-tropical-aqua mr-3" />
                  <h3 className="text-xl font-semibold">Enhanced AI</h3>
                </div>
                <p className="text-gray-600">
                  We’re also building powerful tools to enhance your journey! Our upcoming AI-powered travel assistant that offers real-time recommendations, local tips, and personalized itinerary support, all at your fingertips.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-questrial">Join Our Journey</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Visit Phong Nha is more than a travel platform - it's a community of adventurers, culture enthusiasts, and local partners working together to showcase the best of Vietnam. Whether you're a traveler, local business owner, or fellow adventurer, we'd love to have you join our mission.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="bg-mango-yellow hover:bg-mango-yellow/90 text-white px-8 py-3 rounded-lg transition-colors"
                onClick={() => window.location.href = '/explore'}
              >
                Start Exploring
              </button>
              <button 
                className="border border-jade-green text-jade-green hover:bg-jade-green hover:text-white px-8 py-3 rounded-lg transition-colors"
                onClick={() => window.location.href = '/contact'}
              >
                Get In Touch
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
