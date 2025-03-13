import { useEffect, useCallback } from 'react';

interface AnimationConfig {
  onAnimate: (progress: number) => void;
  duration?: number;
  shouldAnimate?: boolean;
}

export const useOptimizedAnimation = ({
  onAnimate,
  duration = 1000,
  shouldAnimate = true
}: AnimationConfig) => {
  const animate = useCallback(() => {
    let start: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      
      onAnimate(progress);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [duration, onAnimate]);

  useEffect(() => {
    if (shouldAnimate) {
      return animate();
    }
  }, [shouldAnimate, animate]);
}; 