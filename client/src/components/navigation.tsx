import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Heart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { SignInModal } from '@/components/auth/SignInModal';

export function Navigation() {
  const [location] = useLocation();
  const { currentUser, isAuthenticated, logout, canAccessAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const desktopNavigationLinks = [
    { href: '/explore', label: 'Explore' },
    { href: '/inspiration', label: 'Inspiration' },
    { href: '/guestbook', label: 'Guestbook' },
    { href: '/getting-here', label: 'Getting Here' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const mobileNavigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
    { href: '/inspiration', label: 'Inspiration' },
    { href: '/guestbook', label: 'Guestbook' },
    { href: '/getting-here', label: 'Getting Here' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/' && location === '/') return true;
    if (href !== '/' && location.startsWith(href)) return true;
    return false;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <Link href="/" className="flex-shrink-0">
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Logo Image */}
                <div className="w-8 h-8 sm:w-10 sm:h-10">
                  <img 
                    src="/images/VisitPhongNha-Logo-02.png" 
                    alt="Visit Phong Nha Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h1 className="text-sm sm:text-base md:text-lg font-bold text-mango-yellow font-questrial truncate">Visit Phong Nha</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Quang Binh Travel Hub</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6 absolute left-1/2 transform -translate-x-1/2">
            {desktopNavigationLinks.map(({ href, label }) => (
              <Link key={href} href={href} className={`text-sm transition-colors ${
                isActiveLink(href)
                  ? 'text-tropical-aqua font-medium'
                  : 'text-gray-700 hover:text-tropical-aqua'
              }`}>
                {label}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
            {isAuthenticated && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex text-gray-700 hover:text-tropical-aqua"
                onClick={() => window.location.href = '/saved'}
              >
                <Heart className="w-5 h-5" />
              </Button>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-1 sm:space-x-3">
                {currentUser?.photoURL && (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                  />
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs sm:text-sm px-2 sm:px-3"
                  onClick={logout}
                >
                  <span className="hidden sm:inline">Sign Out</span>
                  <span className="sm:hidden">Out</span>
                </Button>
              </div>
            ) : (
              <Button 
                className="bg-mango-yellow text-white hover:bg-mango-yellow/90 font-medium shadow-sm text-xs sm:text-sm px-2 sm:px-3"
                onClick={() => setShowSignInModal(true)}
              >
                <span className="hidden sm:inline">Sign In</span>
                <span className="sm:hidden">Sign In</span>
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-700 p-1"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {mobileNavigationLinks.map(({ href, label }) => (
                <Link 
                  key={href} 
                  href={href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActiveLink(href)
                      ? 'text-tropical-aqua bg-teal-50'
                      : 'text-gray-700 hover:text-tropical-aqua hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link 
                  href="/saved"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-chili-red hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Saved Places
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sign In Modal */}
      <SignInModal 
        isOpen={showSignInModal} 
        onClose={() => setShowSignInModal(false)} 
      />
    </nav>
  );
}
