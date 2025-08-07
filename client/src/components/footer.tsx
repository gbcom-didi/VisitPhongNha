
import { Facebook, Instagram, Mail } from 'lucide-react';
import { Link } from 'wouter';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
          {/* Brand Section with Logo */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              {/* Logo Image */}
              <div className="w-16 h-16 mr-4">
                <img 
                  src="/images/VisitPhongNha-Logo-02.png" 
                  alt="Visit Phong Nha Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-jade-green mb-1 font-questrial">Visit Phong Nha</h4>
                <p className="text-sm text-gray-600">Quang Binh Travel Hub</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6 leading-relaxed max-w-md">
              Your local guide to the heart of Phong Nha, where adventure meets Vietnamese charm.
            </p>
            
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/visitphongnha" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-jade-green hover:text-white transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/visitphongnha/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-jade-green hover:text-white transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="mailto:hello@visitphongnha.com" 
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-jade-green hover:text-white transition-all duration-200"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Explore Section */}
          <div>
            <h5 className="text-lg font-semibold text-gray-900 mb-6">Explore</h5>
            <ul className="space-y-4">
              <li>
                <Link href="/explore" className="text-gray-600 hover:text-jade-green transition-colors duration-200 text-sm">
                  Interactive Map
                </Link>
              </li>
              <li>
                <Link href="/inspiration" className="text-gray-600 hover:text-jade-green transition-colors duration-200 text-sm">
                  Inspiration
                </Link>
              </li>
              <li>
                <Link href="/guestbook" className="text-gray-600 hover:text-jade-green transition-colors duration-200 text-sm">
                  Guestbook
                </Link>
              </li>
              <li>
                <Link href="/getting-here" className="text-gray-600 hover:text-jade-green transition-colors duration-200 text-sm">
                  Getting Here
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h5 className="text-lg font-semibold text-gray-900 mb-6">Support</h5>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-jade-green transition-colors duration-200 text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-jade-green transition-colors duration-200 text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-600 hover:text-jade-green transition-colors duration-200 text-sm">
                  Help
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-jade-green transition-colors duration-200 text-sm">
                  Terms & Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              &copy; 2025 Visit Phong Nha. All rights reserved. Built for the tourism community in Quang Binh Province, Vietnam.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
