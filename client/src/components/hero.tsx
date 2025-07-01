
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { useTypewriter } from '@/hooks/useTypewriter';

export function Hero() {
  const { displayText, showCursor } = useTypewriter({
    text: 'Discover Phong Nha',
    speed: 120,
    delay: 1000
  });

  const scrollToExplore = () => {
    // Add a small delay to ensure the DOM is fully rendered
    setTimeout(() => {
      const welcomeSection = document.getElementById('what-is-visit-phong-nha');
      if (welcomeSection) {
        welcomeSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        // Fallback: scroll to a fixed position if element not found
        window.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  return (
    <section className="relative h-[90vh] bg-gradient-to-r from-coral-sunset to-mango-yellow">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/inspiration/vpn-hero-01.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Main Content - Aligned with Logo */}
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left max-w-lg md:max-w-2xl lg:max-w-3xl">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 font-questrial min-h-[1.2em]" style={{ color: '#137065' }}>
                {displayText}
                <span 
                  className={`inline-block w-1 h-[0.8em] ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}
                  style={{ backgroundColor: '#137065', animation: 'none' }}
                />
              </h2>
              <p className="text-lg sm:text-xl mb-8 leading-relaxed" style={{ color: '#137065' }}>
                Where nature, adventure, and culture meet.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-mango-yellow hover:bg-mango-yellow/90 text-white px-8 py-3 text-lg"
                  onClick={() => window.location.href = '/explore'}
                >
                  Explore like a local
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 text-white hover:bg-white px-8 py-3 text-lg bg-transparent"
                  style={{ 
                    borderColor: '#137065', 
                    color: '#137065'
                  }}
                  onClick={() => window.location.href = '/inspiration'}
                >
                  Discover hidden places
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Learn More Button - Center Bottom */}
        <div className="flex justify-center pb-8">
          <Button 
            variant="ghost"
            size="lg"
            className="flex flex-col items-center gap-2 text-white hover:bg-white/10"
            style={{ color: '#137065' }}
            onClick={scrollToExplore}
          >
            <span>Learn more</span>
            <ArrowDown className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
