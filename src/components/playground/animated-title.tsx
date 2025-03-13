'use client';

import { useEffect, useMemo } from 'react';
import { motion, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Mada } from 'next/font/google';

const mada = Mada({
  subsets: ["latin"],
  weight: ["900"],
  display: "swap",
});

export function AnimatedTitle() {
  const letters = Array.from('JOAKES');
  
  // Create individual spring animations for each letter
  const y1 = useSpring(100, { mass: 1, stiffness: 100, damping: 15 });
  const y2 = useSpring(100, { mass: 1, stiffness: 100, damping: 15 });
  const y3 = useSpring(100, { mass: 1, stiffness: 100, damping: 15 });
  const y4 = useSpring(100, { mass: 1, stiffness: 100, damping: 15 });
  const y5 = useSpring(100, { mass: 1, stiffness: 100, damping: 15 });
  const y6 = useSpring(100, { mass: 1, stiffness: 100, damping: 15 });

  const opacity1 = useSpring(0, { mass: 1, stiffness: 100, damping: 15 });
  const opacity2 = useSpring(0, { mass: 1, stiffness: 100, damping: 15 });
  const opacity3 = useSpring(0, { mass: 1, stiffness: 100, damping: 15 });
  const opacity4 = useSpring(0, { mass: 1, stiffness: 100, damping: 15 });
  const opacity5 = useSpring(0, { mass: 1, stiffness: 100, damping: 15 });
  const opacity6 = useSpring(0, { mass: 1, stiffness: 100, damping: 15 });

  const letterAnimations = useMemo(() => [
    { y: y1, opacity: opacity1 },
    { y: y2, opacity: opacity2 },
    { y: y3, opacity: opacity3 },
    { y: y4, opacity: opacity4 },
    { y: y5, opacity: opacity5 },
    { y: y6, opacity: opacity6 }
  ], [y1, y2, y3, y4, y5, y6, opacity1, opacity2, opacity3, opacity4, opacity5, opacity6]);

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
  }, [letters, letterAnimations, gradientY, gradientOpacity]);

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