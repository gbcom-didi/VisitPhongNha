import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRBAC } from "@/hooks/useRBAC";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  Building2, 
  Plus, 
  BookOpen, 
  MessageSquare, 
  Shield, 
  Users, 
  Home,
  Menu,
  X
} from "lucide-react";

// Import admin components
import AdminBusinesses from "@/components/admin/admin-businesses";
import AdminAddBusiness from "@/components/admin/admin-add-business";
import AdminArticles from "@/components/admin/admin-articles";
import AdminGuestbook from "@/components/admin/admin-guestbook";
import AdminUsers from "@/components/admin/admin-users";

const navigationItems = [
  {
    id: "overview",
    label: "Overview",
    icon: Home,
    description: "Dashboard and statistics"
  },
  {
    id: "manage-businesses",
    label: "Manage Businesses",
    icon: Building2,
    description: "View and edit existing businesses"
  },
  {
    id: "add-business",
    label: "Add Business",
    icon: Plus,
    description: "Add new business listings"
  },
  {
    id: "articles",
    label: "Inspiration Articles",
    icon: BookOpen,
    description: "Add, edit, and manage articles"
  },
  {
    id: "guestbook",
    label: "Guestbook Management",
    icon: MessageSquare,
    description: "View, approve, and moderate entries"
  },
  {
    id: "users",
    label: "User Management",
    icon: Users,
    description: "Manage user accounts and roles"
  }
];

export default function AdminPortal() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { permissions, isAuthenticated } = useRBAC();

  // Check admin access
  if (!isAuthenticated || !permissions.canAccessAdminPanel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this portal.</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <AdminOverview setActiveSection={setActiveSection} />;
      case "manage-businesses":
        return <AdminBusinesses />;
      case "add-business":
        return <AdminAddBusiness />;
      case "articles":
        return <AdminArticles />;
      case "guestbook":
        return <AdminGuestbook />;
      case "users":
        return <AdminUsers />;
      default:
        return <AdminOverview setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-mango-yellow to-coral-sunset rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Visit Phong Nha</h1>
                <p className="text-sm text-gray-500">Admin Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    activeSection === item.id
                      ? "bg-tropical-aqua text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Admin Portal v1.0
            </p>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// Overview component
function AdminOverview({ setActiveSection }: { setActiveSection: (section: string) => void }) {
  const { data: stats, isLoading } = useQuery<{
    businesses: number;
    categories: number;
    articles: number;
    guestbookEntries: number;
    users: number;
  }>({
    queryKey: ["/api/admin/stats"],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your Visit Phong Nha travel platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navigationItems.slice(1).map((item) => {
          const Icon = item.icon;
          return (
            <Card 
              key={item.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setActiveSection(item.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-mango-yellow to-coral-sunset rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg">{item.label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
          <CardDescription>Platform overview and recent activity</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="text-center animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-tropical-aqua">{stats?.businesses || 0}</div>
                <div className="text-sm text-gray-500">Total Businesses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-coral-sunset">{stats?.categories || 0}</div>
                <div className="text-sm text-gray-500">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-jade-green">{stats?.articles || 0}</div>
                <div className="text-sm text-gray-500">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-mango-yellow">{stats?.guestbookEntries || 0}</div>
                <div className="text-sm text-gray-500">Guestbook Entries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats?.users || 0}</div>
                <div className="text-sm text-gray-500">Users</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}