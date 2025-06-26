import { Link, useLocation } from 'wouter';
import { Home, Compass, Lightbulb, Plane, Info, Phone, User, LogOut, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { SignInModal } from '@/components/auth/SignInModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';

export function SidebarNavigation() {
  const [location] = useLocation();
  
  const { isAuthenticated, logout } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/explore', icon: Compass, label: 'Explore' },
    { href: '/inspiration', icon: Lightbulb, label: 'Inspiration' },
    { href: '/getting-here', icon: Plane, label: 'Getting Here' },
    { href: '/about', icon: Info, label: 'About' },
    { href: '/contact', icon: Phone, label: 'Contact' },
  ];

  return (
    <TooltipProvider>
      <div className="fixed left-0 top-0 h-full w-16 bg-white border-r border-gray-200 flex flex-col items-center py-3 z-50">
        {/* Logo */}
        <div className="mb-6">
          <Link href="/">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-10 h-10 cursor-pointer">
                  <img 
                    src="/images/VisitPhongNha-Logo-02.png" 
                    alt="Visit Phong Nha Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Visit Phong Nha</p>
              </TooltipContent>
            </Tooltip>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col space-y-2">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors cursor-pointer",
                    location === href || (href !== '/' && location?.startsWith(href))
                      ? "bg-mango-yellow text-white" 
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  )}>
                    <Icon className="w-5 h-5" />
                    <span className="sr-only">{label}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{label}</p>
                </TooltipContent>
              </Tooltip>
            </Link>
          ))}
          
          {/* Saved Places - only for authenticated users */}
          {isAuthenticated && (
            <Link href="/saved">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors cursor-pointer",
                    location === '/saved'
                      ? "bg-red-500 text-white" 
                      : "text-gray-500 hover:bg-red-100 hover:text-red-500"
                  )}>
                    <Heart className={cn(
                      "w-5 h-5",
                      location === '/saved' ? "fill-current" : ""
                    )} />
                    <span className="sr-only">Saved Places</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Saved Places</p>
                </TooltipContent>
              </Tooltip>
            </Link>
          )}
        </nav>

        {/* User/Login at bottom */}
        <div className="mt-auto">
          {isAuthenticated ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={logout}
                  className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer shadow-sm"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="sr-only">Sign Out</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Sign Out</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowSignInModal(true)}
                  className="w-10 h-10 rounded-lg flex items-center justify-center bg-mango-yellow text-white hover:bg-mango-yellow/90 transition-colors cursor-pointer shadow-sm"
                >
                  <User className="w-5 h-5" />
                  <span className="sr-only">Sign In</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Sign In</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Sign In Modal */}
        <SignInModal 
          isOpen={showSignInModal} 
          onClose={() => setShowSignInModal(false)} 
        />
      </div>
    </TooltipProvider>
  );
}