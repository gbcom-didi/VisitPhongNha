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
        }, 50); // Typing speed
      } else {
        // Text finished typing, show button
        setIsTyping(false);
        setShowButton(true);
        
        // Wait 3 seconds before cycling to next prompt
        timeout = setTimeout(() => {
          setShowButton(false);
          setIsTyping(true);
          setDisplayedText('');
          setCurrentPromptIndex((prev) => (prev + 1) % prompts.length);
        }, 3000);
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
          {/* Typewriter Text */}
          <div className="text-3xl sm:text-4xl md:text-6xl font-bold mb-8 min-h-[120px] md:min-h-[150px] flex items-center font-questrial">
            <span className="relative" style={{ color: '#137065' }}>
              {displayedText}
              {isTyping && (
                <span className="animate-pulse ml-1" style={{ color: '#F7E74A' }}>|</span>
              )}
            </span>
          </div>
          
          {/* CTA Button */}
          <div className="flex justify-start">
            <Link href={currentPrompt.link}>
              <Button
                size="lg"
                className={`
                  bg-mango-yellow hover:bg-mango-yellow/90 text-white font-semibold px-8 py-3 text-lg
                  transform transition-all duration-300 hover:scale-105 hover:shadow-lg
                  ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}
                style={{
                  transitionDelay: showButton ? '0.2s' : '0s'
                }}
              >
                {currentPrompt.cta}
              </Button>
            </Link>
          </div>
          
          {/* Progress Dots */}
          <div className="flex justify-start space-x-2 mt-8">
            {prompts.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentPromptIndex 
                    ? 'bg-mango-yellow' 
                    : 'bg-jade-green/50 hover:bg-jade-green/75'
                }`}
              />
            ))}
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