import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

// Define prompts with their CTAs and links
const prompts = [
  {
    text: "I want to explore a cave.",
    cta: "Show me cave tours",
    link: "/explore?category=caves"
  },
  {
    text: "I want to eat street food.",
    cta: "Show me street food spots",
    link: "/explore?category=street-food"
  },
  {
    text: "I'm looking for an adventure.",
    cta: "Lets get moving",
    link: "/explore?category=adventure"
  },
  {
    text: "I would like a cold beer!",
    cta: "Take me to the bar",
    link: "/explore?tags=beer"
  }
];

export function InteractiveHero() {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showButton, setShowButton] = useState(false);

  const currentPrompt = prompts[currentPromptIndex];

  // Automatic cycling mechanism - ensures prompts rotate even without user interaction
  useEffect(() => {
    const interval = setInterval(() => {
      setShowButton(false);
      setTimeout(() => {
        setIsTyping(true);
        setDisplayedText('');
        setCurrentPromptIndex((prev) => (prev + 1) % prompts.length);
      }, 200);
    }, 6000); // Change every 6 seconds

    return () => clearInterval(interval);
  }, []);
  


  const scrollToExplore = () => {
    setTimeout(() => {
      const welcomeSection = document.getElementById('what-is-visit-phong-nha');
      if (welcomeSection) {
        welcomeSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        window.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      // Typewriter effect
      if (displayedText.length < currentPrompt.text.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentPrompt.text.slice(0, displayedText.length + 1));
        }, 40); // Typing speed
      } else {
        // Text finished typing, show button
        setIsTyping(false);
        setShowButton(true);
        
        // Wait 4 seconds before cycling to next prompt
        timeout = setTimeout(() => {
          setShowButton(false);
          setTimeout(() => {
            setIsTyping(true);
            setDisplayedText('');
            setCurrentPromptIndex((prev) => (prev + 1) % prompts.length);
          }, 200); // Small delay between prompts
        }, 4000);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isTyping, currentPrompt.text, currentPromptIndex]);

  return (
    <div className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/vpn-hero-02.png')",
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left max-w-lg md:max-w-2xl lg:max-w-3xl">
          {/* Typewriter Text and Button */}
          <div className="min-h-[120px] md:min-h-[150px] flex flex-col justify-center">
            {/* Text Container */}
            <div className="text-3xl sm:text-4xl md:text-6xl font-normal font-questrial mb-1" style={{ color: '#137065' }}>
              <span className="inline-block">
                {displayedText}
                <span className="animate-pulse ml-1" style={{ color: '#137065' }}>|</span>
              </span>
            </div>
            
            {/* Button positioned to align with text width */}
            <div className="flex justify-start mt-1">
              <div style={{ width: `${displayedText.length * 0.6}em` }}></div>
              <Link href={currentPrompt.link}>
                <Button
                  size="lg"
                  className={`
                    bg-coral-sunset hover:bg-coral-sunset/90 text-white font-semibold px-8 py-3 text-lg
                    transform transition-all duration-300 hover:scale-105 border-0
                    ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                  `}
                  style={{
                    transitionDelay: showButton ? '0.2s' : '0s',
                    boxShadow: 'none'
                  }}
                >
                  {currentPrompt.cta}
                </Button>
              </Link>
            </div>
          </div>
          

        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button 
          onClick={scrollToExplore}
          className="flex flex-col items-center space-y-2 hover:opacity-75 transition-opacity"
          style={{ color: '#137065' }}
        >
          <span className="text-sm">Learn more</span>
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}