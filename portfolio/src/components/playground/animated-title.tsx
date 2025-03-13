'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Mada } from 'next/font/google';

const mada = Mada({
  subsets: ["latin"],
  weight: ["900"],
  display: "swap",
});

export function AnimatedTitle() {
  const [isVisible, setIsVisible] = useState(false);
  const letters = Array.from('JOAKES');

  // Spring animation for each letter
  const letterAnimations = letters.map((_, i) => {
    const y = useSpring(100, {
      mass: 1,
      stiffness: 100,
      damping: 15
    });

    const opacity = useSpring(0, {
      mass: 1,
      stiffness: 100,
      damping: 15
    });

    return { y, opacity };
  });

  // Gradient animation
  const gradientY = useSpring(100, {
    mass: 1,
    stiffness: 80,
    damping: 15
  });

  const gradientOpacity = useSpring(0, {
    mass: 1,
    stiffness: 80,
    damping: 15
  });

  useEffect(() => {
    setIsVisible(true);
    
    // Animate letters sequentially
    letters.forEach((_, i) => {
      setTimeout(() => {
        letterAnimations[i].y.set(0);
        letterAnimations[i].opacity.set(1);
      }, i * 100);
    });

    // Animate gradient
    setTimeout(() => {
      gradientY.set(0);
      gradientOpacity.set(1);
    }, letters.length * 100);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center py-20 px-6">
        <div className="relative">
          {/* Base Text Layer */}
          <h1 
            className={cn(
              mada.className,
              "text-[4rem] md:text-[6rem] lg:text-[8rem] leading-none whitespace-pre select-none"
            )}
            aria-label="Joakes"
          >
            <span className="sr-only">Joakes</span>
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                style={{
                  y: letterAnimations[i].y,
                  opacity: letterAnimations[i].opacity,
                }}
                className={cn(
                  "inline-block",
                  i === 0
                    ? "dark:text-white text-neutral-900"
                    : "dark:text-neutral-300 text-neutral-700"
                )}
              >
                {letter}
              </motion.span>
            ))}
          </h1>

          {/* Gradient Mask Layer */}
          <motion.div
            style={{
              y: gradientY,
              opacity: gradientOpacity,
            }}
            className="absolute inset-0 pointer-events-none"
          >
            <h1 
              className={cn(
                mada.className,
                "text-[4rem] md:text-[6rem] lg:text-[8rem] leading-none whitespace-pre"
              )}
            >
              <span className="text-transparent">J</span>
              <span className="relative">
                <span 
                  className={cn(
                    "absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500",
                    "bg-clip-text text-transparent bg-[length:200%_auto]",
                    "animate-[gradientFlow_3s_linear_infinite]",
                    "opacity-0 group-hover:opacity-100 transition-opacity"
                  )}
                  aria-hidden="true"
                >
                  OAKES
                </span>
                <span 
                  className={cn(
                    "bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500",
                    "bg-clip-text text-transparent bg-[length:200%_auto]",
                    "animate-[gradientFlow_3s_linear_infinite]"
                  )}
                >
                  OAKES
                </span>
              </span>
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-0 right-0 text-center"
      >
        <p className="dark:text-neutral-400 text-neutral-600 text-lg">
          Animated Title Component
        </p>
        <div className="flex justify-center gap-3 mt-3">
          <span className="px-3 py-1 text-sm rounded-full dark:bg-purple-500/10 bg-purple-500/10 dark:text-purple-400 text-purple-600 dark:border-purple-500/20 border-purple-500/20 border">
            Framer Motion
          </span>
          <span className="px-3 py-1 text-sm rounded-full dark:bg-blue-500/10 bg-blue-500/10 dark:text-blue-400 text-blue-600 dark:border-blue-500/20 border-blue-500/20 border">
            Spring Physics
          </span>
        </div>
      </motion.div>
    </div>
  );
} 