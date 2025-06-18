import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { useTypewriter } from '@/hooks/useTypewriter';

export function Hero() {
  const { displayText, showCursor } = useTypewriter({
    text: 'Discover Phan Rang',
    speed: 120,
    delay: 1000
  });

  const scrollToExplore = () => {
    const exploreSection = document.getElementById('explore');
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen sm:h-96 bg-gradient-to-r from-sea-blue to-tropical-aqua">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/images/my-hoa-love.jpg')`, // Updated image path
          backgroundBlendMode: 'overlay'
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen sm:h-full px-4 py-8 sm:py-0">
        <div className="text-center text-white max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 font-questrial min-h-[1.2em]">
            {displayText}
            <span 
              className={`inline-block w-1 h-[0.8em] ml-1 bg-white ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}
              style={{ animation: 'none' }}
            />
          </h2>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Your ultimate guide to kitesurfing paradise and Vietnamese culture. 
            Explore hidden gems, authentic experiences, and the best spots for adventure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-chili-red hover:bg-red-600 text-white px-8 py-3 text-lg"
              onClick={() => window.location.href = '/explore'}
            >
              Start Exploring
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-sea-blue px-8 py-3 text-lg bg-transparent"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Video
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}