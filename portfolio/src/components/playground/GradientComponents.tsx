'use client';

import { motion, HTMLMotionProps, useMotionTemplate, useAnimationFrame, useMotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMouseGradient } from '@/hooks/useMouseGradient';
import { useState, useCallback, memo } from 'react';
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';

// Add keyframes for shine animation
const shineAnimation = `
  @keyframes shine {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

interface GradientCardProps extends Omit<HTMLMotionProps<"div">, "title" | "children"> {
  title: string;
  description: string;
  variant?: 'glow' | 'subtle' | 'glass' | 'autoGlow';
  onClick?: () => void;
}

const cardVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

const GradientCardBase = memo(({
  title,
  description,
  variant = 'glow',
  className,
  onClick,
  ...props
}: GradientCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const rotation = useMotionValue(0);
  
  const mouseGradient = useMouseGradient({
    gradientSize: 350,
    color: '147, 51, 234',
    secondaryColor: '59, 130, 246',
    opacity: 0.3,
    type: 'radial',
    spread: 60
  });

  // Automatic rotation animation with optimized hook
  useOptimizedAnimation({
    onAnimate: (progress) => {
      if (variant === 'autoGlow' && (isHovered || isFocused)) {
        rotation.set((progress * 360) % 360);
      }
    },
    duration: 3000,
    shouldAnimate: variant === 'autoGlow' && (isHovered || isFocused)
  });

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  }, [onClick]);

  const baseMotionProps: HTMLMotionProps<"div"> = {
    variants: cardVariants,
    initial: "initial",
    whileHover: "hover",
    whileTap: "tap",
    ...props
  };

  // Add shine animation to head
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = shineAnimation;
    document.head.appendChild(style);
  }

  const variants = {
    glow: (
      <motion.div
        {...baseMotionProps}
        role="button"
        tabIndex={0}
        aria-label={`${title} - ${description}`}
        className={cn(
          'relative group cursor-pointer outline-none h-full',
          'focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2',
          'dark:focus-visible:ring-purple-400',
          className
        )}
        onKeyDown={handleKeyDown}
        onClick={onClick}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{ willChange: 'transform' }}
      >
        <div 
          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-500"
          style={{ willChange: 'opacity' }}
        />
        <div 
          className="h-full relative p-6 dark:bg-neutral-950/90 bg-white/90 ring-1 dark:ring-neutral-800/50 ring-neutral-200/50 rounded-lg backdrop-blur-xl flex flex-col"
          style={{ willChange: 'transform' }}
        >
          <div className="space-y-2 flex flex-col flex-1">
            <h3 className="dark:text-white text-neutral-900 font-semibold text-base md:text-lg">
              {title}
            </h3>
            <p className="dark:text-neutral-300 text-neutral-600 text-sm md:text-base leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </motion.div>
    ),
    subtle: (
      <motion.div
        {...baseMotionProps}
        className={cn('relative group cursor-pointer isolate h-full', className)}
      >
        <div className="h-full relative rounded-lg dark:bg-gradient-to-br dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 bg-gradient-to-br from-neutral-100 via-neutral-100 to-neutral-200 p-6 flex flex-col">
          <div className="space-y-2 flex flex-col flex-1">
            <h3 className="dark:bg-gradient-to-r dark:from-white dark:to-neutral-400 bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent font-semibold text-base md:text-lg">
              {title}
            </h3>
            <p className="dark:text-neutral-300 text-neutral-600 text-sm md:text-base leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </motion.div>
    ),
    glass: (
      <motion.div
        {...baseMotionProps}
        onMouseMove={mouseGradient.handleMouseMove}
        onMouseEnter={mouseGradient.handleMouseEnter}
        onMouseLeave={mouseGradient.handleMouseLeave}
        className={cn('relative group cursor-pointer h-full', className)}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500" />
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300"
          style={mouseGradient.style}
        />
        <div className="h-full relative backdrop-blur-md rounded-lg border dark:border-white/10 border-black/10 p-6 dark:bg-white/5 bg-black/5 flex flex-col">
          <div className="space-y-2 flex flex-col flex-1">
            <h3 className="font-semibold mb-2 dark:text-white text-neutral-900 text-base md:text-lg">
              {title}
            </h3>
            <p className="text-sm md:text-base dark:text-neutral-300 text-neutral-600 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </motion.div>
    ),
    autoGlow: (
      <motion.div
        {...baseMotionProps}
        className={cn('relative group cursor-pointer', className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div 
          className="absolute -inset-0.5 rounded-lg blur-md transition-opacity duration-500"
          style={{
            background: useMotionTemplate`
              conic-gradient(
                from ${rotation}deg at 50% 50%,
                rgba(147, 51, 234, 0.6),
                rgba(59, 130, 246, 0.6),
                rgba(147, 51, 234, 0.6)
              )
            `,
            opacity: isHovered ? 0.8 : 0.3
          }}
        />
        <div className="relative p-6 dark:bg-neutral-950/90 bg-white/90 ring-1 dark:ring-neutral-800/50 ring-neutral-200/50 rounded-lg backdrop-blur-xl">
          <div className="space-y-2">
            <h3 className="dark:text-white text-neutral-900 font-semibold">{title}</h3>
            <p className="dark:text-neutral-400 text-neutral-600 text-sm">{description}</p>
          </div>
        </div>
      </motion.div>
    ),
  };

  return variants[variant];
});

GradientCardBase.displayName = 'GradientCard';

export const GradientCard = GradientCardBase; 