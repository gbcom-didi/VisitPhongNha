import { Link, useLocation } from 'wouter';
import { Home, Compass, BookOpen, Plane, Info, Phone, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SidebarNavigation() {
  const [location] = useLocation();

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/explore', icon: Compass, label: 'Explore' },
    { href: '/inspiration', icon: BookOpen, label: 'Inspiration' },
    { href: '/getting-here', icon: Plane, label: 'Getting Here' },
    { href: '/about', icon: Info, label: 'About' },
    { href: '/contact', icon: Phone, label: 'Contact' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-white border-r border-gray-200 flex flex-col items-center py-3 z-50">
      {/* Logo */}
      <div className="mb-6">
        <Link href="/">
          <div className="w-10 h-10 cursor-pointer">
            <img 
              src="/images/VisitPhongNha-Logo-02.png" 
              alt="Visit Phong Nha Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col space-y-2">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}>
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-colors cursor-pointer",
              location === href || (href !== '/' && location?.startsWith(href))
                ? "bg-mango-yellow text-white" 
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            )}>
              <Icon className="w-5 h-5" />
              <span className="sr-only">{label}</span>
            </div>
          </Link>
        ))}
      </nav>

      {/* User/Login at bottom */}
      <div className="mt-auto">
        <Link href="/login">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer">
            <User className="w-5 h-5" />
            <span className="sr-only">Login</span>
          </div>
        </Link>
      </div>
    </div>
  );
}