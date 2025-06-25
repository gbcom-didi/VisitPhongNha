import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Heart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useRBAC } from '@/hooks/useRBAC';

export function Navigation() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { permissions } = useRBAC();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
    { href: '/getting-here', label: 'Getting Here' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Admin' },
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
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex-shrink-0">
              <div className="flex items-center space-x-3">
                {/* Logo Image */}
                <div className="w-10 h-10">
                  <img 
                    src="/images/VisitPhongNha-Logo-02.png" 
                    alt="Visit Phong Nha Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-mango-yellow font-questrial">Visit Phong Nha</h1>
                  <p className="text-xs text-gray-500">Quang Binh Travel Hub</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationLinks.map(({ href, label }) => (
              <Link key={href} href={href} className={`transition-colors ${
                isActiveLink(href)
                  ? 'text-tropical-aqua font-medium'
                  : 'text-gray-700 hover:text-tropical-aqua'
              }`}>
                {label}
              </Link>
            ))}
            {isAuthenticated && permissions.canAccessAdminPanel && adminLinks.map(({ href, label }) => (
              <Link key={href} href={href} className={`transition-colors ${
                isActiveLink(href)
                  ? 'text-tropical-aqua font-medium'
                  : 'text-gray-700 hover:text-tropical-aqua'
              }`}>
                {label}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
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
              <div className="flex items-center space-x-3">
                {user?.profileImageUrl && (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = '/api/logout'}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                className="bg-tropical-aqua text-white hover:bg-tropical-aqua/90"
                onClick={() => window.location.href = '/api/login'}
              >
                Sign In
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-700"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {navigationLinks.map(({ href, label }) => (
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
    </nav>
  );
}
