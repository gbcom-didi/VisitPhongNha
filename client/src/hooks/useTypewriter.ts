
import { useState, useEffect } from 'react';

interface UseTypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
}

export const useTypewriter = ({ text, speed = 100, delay = 0 }: UseTypewriterProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }
    }, currentIndex === 0 ? delay : speed);

    return () => clearTimeout(timeout);
  }, [currentIndex, text, speed, delay]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    // Stop cursor blinking after 5 seconds
    const stopCursorTimeout = setTimeout(() => {
      clearInterval(cursorInterval);
      setShowCursor(false);
    }, 5000);

    return () => {
      clearInterval(cursorInterval);
      clearTimeout(stopCursorTimeout);
    };
  }, []);

  return { displayText, showCursor, isComplete: currentIndex >= text.length };
};
