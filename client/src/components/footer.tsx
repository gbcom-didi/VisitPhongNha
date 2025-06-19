import { Facebook, Instagram, Youtube, Mail } from 'lucide-react';
import { Link } from 'wouter';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <h4 className="text-2xl font-bold text-tropical-aqua mb-4 font-questrial">ĐiĐi VUi</h4>
            <p className="text-xs text-gray-400 mb-2">Phan Rang Travel Hub</p>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Your ultimate guide to Phan Rang's kitesurfing paradise and Vietnamese culture. 
              Discover, explore, and experience the best of Vietnam's hidden gems.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                href="mailto:info@didivui.com" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Explore Section */}
          <div>
            <h5 className="font-semibold mb-4">Explore</h5>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/explore?category=kiting" className="hover:text-white transition-colors">
                  Kitesurfing Spots
                </Link>
              </li>
              <li>
                <Link href="/explore?category=food-drink" className="hover:text-white transition-colors">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link href="/explore?category=stay" className="hover:text-white transition-colors">
                  Accommodations
                </Link>
              </li>
              <li>
                <Link href="/explore?category=attractions" className="hover:text-white transition-colors">
                  Attractions
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h5 className="font-semibold mb-4">Support</h5>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Help
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Terms & Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 ĐiĐiVui. All rights reserved. Built for the kitesurfing community in Ninh Thuan, Vietnam.</p>
        </div>
      </div>
    </footer>
  );
}
