'use client';

import { useSpring, config } from '@react-spring/web';
import { useState, useEffect } from 'react';

export const useLetterAnimation = (word: string, delay: number = 0) => {
  const [isVisible, setIsVisible] = useState(false);
  const letters = word.split('');

  // Calculate total animation duration for gradient timing
  const lastLetterDelay = delay + 800 + ((letters.length - 2) * 100);

  // Create spring animation for each letter
  const animations = letters.map((_, index) => {
    // Calculate decreasing delay for subsequent letters
    const letterDelay = index === 0 
      ? delay  // First letter (J) has initial delay
      : delay + 800 + (index * 100); // Slower sequence for OAKES

    return useSpring({
      from: { 
        opacity: 0, 
        transform: 'translateY(20px)',
      },
      to: async (next) => {
        // Wait for calculated delay
        await new Promise(resolve => setTimeout(resolve, letterDelay));
        
        // Animate in with slower timing
        await next({ 
          opacity: 1, 
          transform: 'translateY(0px)',
          config: {
            tension: 120,
            friction: 14
          }
        });

        // Optional bounce effect for first letter
        if (index === 0) {
          await next({ 
            transform: 'translateY(-5px)',
            config: { tension: 200, friction: 12 }
          });
          await next({ 
            transform: 'translateY(0px)',
            config: { tension: 180, friction: 14 }
          });
        }
      },
      config: {
        ...config.gentle,
        tension: index === 0 ? 140 : 120,
        friction: index === 0 ? 12 : 14
      }
    });
  });

  // Gradient animation that starts after letters appear
  const gradientAnimation = useSpring({
    from: { opacity: 0 },
    to: async (next) => {
      // Wait for all letters to animate
      await new Promise(resolve => setTimeout(resolve, lastLetterDelay + 400));
      await next({ opacity: 1 });
    },
    config: { tension: 120, friction: 14 }
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return { animations, gradientAnimation, isVisible };
}; 