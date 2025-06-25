
import { Facebook, Instagram, Youtube, Mail } from 'lucide-react';
import { Link } from 'wouter';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
          {/* Brand Section with Logo */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              {/* Logo SVG */}
              <div className="w-16 h-16 mr-4">
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  <defs>
                    <radialGradient id="skyGradient" cx="50%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#FFB366" />
                      <stop offset="100%" stopColor="#FF8C42" />
                    </radialGradient>
                  </defs>
                  
                  {/* Sky background */}
                  <circle cx="200" cy="200" r="200" fill="url(#skyGradient)" />
                  
                  {/* Mountains */}
                  <path d="M 0 280 Q 100 180 200 200 Q 300 220 400 160 L 400 400 L 0 400 Z" fill="#4A9B8A" opacity="0.9" />
                  <path d="M 50 320 Q 150 220 250 240 Q 350 260 400 200 L 400 400 L 50 400 Z" fill="#3D8B7A" opacity="0.8" />
                  <path d="M 100 360 Q 200 260 300 280 Q 350 290 400 240 L 400 400 L 100 400 Z" fill="#2E6B5A" opacity="0.7" />
                  
                  {/* Vietnamese woman silhouette */}
                  <g transform="translate(160, 240)">
                    {/* Body */}
                    <ellipse cx="20" cy="60" rx="25" ry="45" fill="#F5E6D3" />
                    
                    {/* Head */}
                    <circle cx="20" cy="0" r="18" fill="#F5E6D3" />
                    
                    {/* Traditional hat (non la) */}
                    <ellipse cx="20" cy="-8" rx="28" ry="12" fill="#F5E6D3" />
                    <ellipse cx="20" cy="-12" rx="32" ry="8" fill="#F5E6D3" />
                    
                    {/* Arms */}
                    <ellipse cx="5" cy="40" rx="8" ry="20" fill="#F5E6D3" transform="rotate(-20)" />
                    <ellipse cx="35" cy="40" rx="8" ry="20" fill="#F5E6D3" transform="rotate(20)" />
                  </g>
                  
                  {/* Text */}
                  <text x="200" y="80" textAnchor="middle" className="text-3xl font-light" fill="#F5E6D3" fontFamily="Arial, sans-serif">PHONG</text>
                  <text x="200" y="120" textAnchor="middle" className="text-3xl font-light" fill="#F5E6D3" fontFamily="Arial, sans-serif">NHA</text>
                </svg>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-jade-green mb-1 font-questrial">Visit Phong Nha</h4>
                <p className="text-sm text-gray-600">Phong Nha Travel Hub</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6 leading-relaxed max-w-md">
              Your ultimate guide to Phong Nha's cave paradise and Vietnamese culture. 
              Discover, explore, and experience the best of Vietnam's hidden gems.
            </p>
            
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-jade-green hover:text-white transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-jade-green hover:text-white transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-jade-green hover:text-white transition-all duration-200"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                href="mailto:info@didivui.com" 
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
                <Link href="/explore?category=kiting" className="text-gray-600 hover:text-jade-green transition-colors duration-200 text-sm">
                  Kitesurfing Spots
                </Link>
              </li>
              <li>
                <Link href="/explore?category=food-drink" className="text-gray-600 hover:text-jade-green transition-colors duration-200 text-sm">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link href="/explore?category=stay" className="text-gray-600 hover:text-jade-green transition-colors duration-200 text-sm">
                  Accommodations
                </Link>
              </li>
              <li>
                <Link href="/explore?category=attractions" className="text-gray-600 hover:text-jade-green transition-colors duration-200 text-sm">
                  Attractions
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
              &copy; 2025 Visit Phong Nha. All rights reserved. Built for the cave exploration community in Quang Binh Province, Vietnam.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
