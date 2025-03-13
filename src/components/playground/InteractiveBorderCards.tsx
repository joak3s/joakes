'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useEffect, useCallback } from 'react';

interface BorderCardProps {
  title: string;
  description: string;
  className?: string;
  onClick?: () => void;
}

export function InteractiveBorderCard({ 
  title, 
  description, 
  className,
  onClick 
}: BorderCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  }, []);

  useEffect(() => {
    let animationFrame: number;
    
    const animateGlow = () => {
      if (isHovered || isFocused) {
        setGlowPosition(prev => ({
          x: prev.x + (position.x - prev.x) * 0.1,
          y: prev.y + (position.y - prev.y) * 0.1
        }));
      }
      animationFrame = requestAnimationFrame(animateGlow);
    };

    animationFrame = requestAnimationFrame(animateGlow);
    return () => cancelAnimationFrame(animationFrame);
  }, [position, isHovered, isFocused]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={`${title} - ${description}`}
      className={cn(
        "relative group cursor-pointer outline-none h-full",
        "focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2",
        "dark:focus-visible:ring-purple-400",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setPosition({ x: 50, y: 50 });
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      initial={false}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        willChange: 'transform',
        contain: 'layout'
      }}
    >
      {/* Animated border container */}
      <div 
        className="absolute inset-0 rounded-lg overflow-hidden"
        style={{ willChange: 'opacity' }}
      >
        <div 
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `
              radial-gradient(
                circle at ${glowPosition.x}% ${glowPosition.y}%,
                rgba(147, 51, 234, 1),
                rgba(59, 130, 246, 1) 50%,
                transparent 100%
              )
            `,
            opacity: (isHovered || isFocused) ? 1 : 0.3,
            willChange: 'background, opacity'
          }}
        />
      </div>

      {/* Content */}
      <div 
        className="h-full relative p-6 rounded-lg dark:bg-neutral-950/95 bg-white/95 backdrop-blur-xl border dark:border-white/10 border-black/5 flex flex-col"
        style={{ willChange: 'transform' }}
      >
        <div className="relative z-10 flex flex-col flex-1">
          <h3 className="dark:text-white text-neutral-900 font-semibold mb-2 text-base md:text-lg">
            {title}
          </h3>
          <p className="dark:text-neutral-300 text-neutral-600 text-sm md:text-base leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
} 