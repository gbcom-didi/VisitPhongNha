import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Eye, Lock, Users, FileText, Mail } from 'lucide-react';

export default function TermsPrivacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-jade-green to-tropical-aqua">
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-questrial">Terms & Privacy</h1>
            <p className="text-xl max-w-2xl mx-auto">Our commitment to your privacy and terms of service</p>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-questrial">Privacy at a Glance</h2>
            <p className="text-gray-600">Your privacy and security are our top priorities</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-jade-green rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure Authentication</h3>
                <p className="text-sm text-gray-600">
                  We use Firebase Authentication to securely manage your account with industry-standard encryption.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-tropical-aqua rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Tracking</h3>
                <p className="text-sm text-gray-600">
                  We don't use tracking cookies or third-party analytics. Your browsing is private.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-chili-red rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Data Protection</h3>
                <p className="text-sm text-gray-600">
                  Your personal information is encrypted and never shared with third parties.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Terms of Service */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <FileText className="w-6 h-6 mr-2 text-jade-green" />
                Terms of Service
              </CardTitle>
              <p className="text-gray-600">Last updated: July 30, 2025</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-tropical-aqua">1. Acceptance of Terms</h3>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using Visit Phong Nha ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3 text-tropical-aqua">2. Description of Service</h3>
                <p className="text-gray-700 leading-relaxed">
                  Visit Phong Nha is a travel platform that provides information about businesses, accommodations, restaurants, caves, and activities in the Phong Nha region of Quang Binh Province, Vietnam. We facilitate discovery and booking of local services but are not responsible for the quality or availability of services provided by third-party businesses.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3 text-tropical-aqua">3. User Accounts</h3>
                <p className="text-gray-700 leading-relaxed">
                  To access certain features, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You must provide accurate and complete information when creating your account.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3 text-tropical-aqua">4. User Content</h3>
                <p className="text-gray-700 leading-relaxed">
                  Users may submit content including reviews, comments, and guestbook entries. You retain ownership of your content but grant us a license to use, display, and distribute it on our platform. You are responsible for ensuring your content is accurate, lawful, and respectful.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3 text-tropical-aqua">5. Third-Party Services</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our platform integrates with third-party services including Google Maps, Booking.com, and Agoda for enhanced functionality. Your use of these services is subject to their respective terms of service. We are not responsible for the practices or content of third-party services.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3 text-tropical-aqua">6. Limitation of Liability</h3>
                <p className="text-gray-700 leading-relaxed">
                  Visit Phong Nha provides information "as is" without warranty. We are not liable for any damages arising from your use of the service or reliance on business information. Always verify details directly with businesses before making reservations or travel plans.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Privacy Policy */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Shield className="w-6 h-6 mr-2 text-chili-red" />
                Privacy Policy
              </CardTitle>
              <p className="text-gray-600">Last updated: July 30, 2025</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-chili-red">Information We Collect</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We collect information you provide directly to us, such as when you create an account, save places, or submit guestbook entries:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Name and email address (through Firebase Authentication)</li>
                  <li>Saved places and preferences</li>
                  <li>Guestbook entries and comments</li>
                  <li>Contact form submissions</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3 text-chili-red">How We Use Your Information</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Personalize your experience with saved places</li>
                  <li>Respond to your comments and questions</li>
                  <li>Send you service-related communications</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3 text-chili-red">Information Sharing</h3>
                <p className="text-gray-700 leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal information to third parties. We may share information in the following limited circumstances: with your consent, to comply with legal obligations, or to protect our rights and the safety of our users.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3 text-chili-red">Data Security</h3>
                <p className="text-gray-700 leading-relaxed">
                  We implement appropriate security measures to protect your personal information. We use Firebase Authentication for secure account management and encrypt sensitive data. However, no method of transmission over the internet is 100% secure.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3 text-chili-red">Cookies and Tracking</h3>
                <p className="text-gray-700 leading-relaxed">
                  We use minimal cookies necessary for the functionality of our service, including Firebase authentication cookies. We do not use tracking cookies or third-party analytics that compromise your privacy.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3 text-chili-red">Your Rights</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Access and update your personal information</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt out of non-essential communications</li>
                  <li>Request a copy of your data</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-questrial">Questions About Our Policies?</h2>
          <p className="text-gray-600 mb-8">
            If you have any questions about these Terms of Service or Privacy Policy, please contact us.
          </p>
          
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-6">
            <div className="w-12 h-12 bg-tropical-aqua rounded-lg flex items-center justify-center mr-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Email Us</h3>
              <a href="mailto:hello@visitphongnha.com?subject=Terms and Privacy Inquiry" className="text-tropical-aqua hover:text-tropical-aqua/80">
                hello@visitphongnha.com
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}