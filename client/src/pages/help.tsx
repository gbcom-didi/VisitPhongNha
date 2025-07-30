import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Mail, MessageCircle } from 'lucide-react';

export default function Help() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-tropical-aqua to-jade-green">
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-questrial">Help Center</h1>
            <p className="text-xl max-w-2xl mx-auto">Find answers to common questions and get support for your Visit Phong Nha experience</p>
          </div>
        </div>
      </section>



      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-questrial">Frequently Asked Questions</h2>
            <p className="text-gray-600">Common questions about using Visit Phong Nha</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">How do I search for specific types of businesses?</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Use the category filters on the Explore page to find specific business types like accommodation, restaurants, caves, or adventure tours. You can also use the search bar to find businesses by name or use the interactive map to browse by location.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">How do I save places to my favorites?</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Click the heart icon on any business card or in the business detail modal. You must be signed in to save places. Access your saved places by clicking the heart icon in the navigation or visiting the Saved Places page.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">How do I sign in or create an account?</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Click "Sign In" in the navigation menu. You can sign in using Google, Facebook, or create an account with your email address. All authentication is handled securely through Firebase.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">How do I book accommodation or tours?</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Click on any business to view details, then use the booking buttons to check availability on Booking.com, Agoda, or visit the business website directly. Many businesses also provide direct contact information for bookings.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">Can I leave reviews or comments about businesses?</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                You can share your experiences in our Guestbook section, where you can write about your Phong Nha adventures and tag specific businesses. We also display authentic Google Reviews for businesses to help you make informed decisions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">How do I get directions to a business?</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                In each business detail modal, click "Get Directions" to open Google Maps with turn-by-turn directions. You can also click "View on Google Maps" to see the business location on Google Maps directly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">Is the website available in Vietnamese?</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Currently, Visit Phong Nha is available in English. We're working on adding Vietnamese language support in the future to better serve local visitors and businesses.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">How often is business information updated?</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                We regularly update business information including ratings, photos, and contact details. If you notice outdated information, please contact us and we'll update it promptly.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-questrial">Still Need Help?</h2>
          <p className="text-gray-600 mb-8">Can't find what you're looking for? Our team is here to help.</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-chili-red rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Email Support</h3>
                <p className="text-gray-600 text-sm mb-4">Send us a detailed message and we'll get back to you within 24 hours</p>
                <a href="mailto:hello@visitphongnha.com?subject=Help Request" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-chili-red hover:bg-chili-red/90 text-white">
                    Contact Support
                  </Button>
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-tropical-aqua rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Contact Form</h3>
                <p className="text-gray-600 text-sm mb-4">Use our contact form for detailed inquiries and support requests</p>
                <a href="/contact">
                  <Button variant="outline" className="text-tropical-aqua border-tropical-aqua hover:bg-tropical-aqua hover:text-white">
                    Contact Form
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}