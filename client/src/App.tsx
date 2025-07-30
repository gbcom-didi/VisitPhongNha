import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { AuthProvider } from "@/contexts/AuthContext";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Explore from "@/pages/explore";
import { InspirationPage } from "@/pages/inspiration";
import { InspirationArticlePage } from "@/pages/inspiration-article";
import GettingHere from "@/pages/getting-here";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Admin from "@/pages/admin";
import AdminPortal from "@/pages/admin-portal";
import { Favorites } from "@/pages/favorites";
import { Guestbook } from "@/pages/guestbook";
import { ModerationPage } from "@/pages/moderation";
import Help from "@/pages/help";
import TermsPrivacy from "@/pages/terms-privacy";

function Router() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tropical-aqua"></div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/explore" component={Explore} />
      <Route path="/inspiration" component={InspirationPage} />
      <Route path="/inspiration/:id" component={InspirationArticlePage} />
      <Route path="/getting-here" component={GettingHere} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin-portal" component={AdminPortal} />
      <Route path="/moderation" component={ModerationPage} />
      <Route path="/saved" component={Favorites} />
      <Route path="/guestbook" component={Guestbook} />
      <Route path="/help" component={Help} />
      <Route path="/privacy" component={TermsPrivacy} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
