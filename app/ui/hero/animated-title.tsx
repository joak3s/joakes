'use client';

import { animated } from '@react-spring/web';
import { useLetterAnimation } from '@/app/hooks/useLetterAnimation';
import { Mada } from 'next/font/google';

const mada = Mada({
  subsets: ["latin"],
  weight: ["900"],
  display: "swap",
});

const AnimatedSpan = animated('span');
const AnimatedDiv = animated('div');

export default function AnimatedTitle() {
  const { animations, gradientAnimation, isVisible } = useLetterAnimation('JOAKES', 500);

  return (
    <section 
      className="relative min-h-[70vh] flex items-center justify-center bg-[#121212] overflow-hidden"
      aria-label="Hero section with animated name"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full 
          mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full 
          mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Title Container */}
        <div className="relative">
          {/* White Text Layer */}
          <h1 
            className={`${mada.className} text-[8rem] md:text-[12rem] lg:text-[16rem] leading-none whitespace-pre`}
            aria-label="Joakes"
          >
            <span className="sr-only">Joakes</span>
            <AnimatedSpan
              style={animations[0]}
              className="text-white"
            >
              J
            </AnimatedSpan>
            {animations.slice(1).map((animation, index) => (
              <AnimatedSpan
                key={index + 1}
                style={animation}
                className="text-neutral-300"
              >
                {Array.from('OAKES')[index]}
              </AnimatedSpan>
            ))}
          </h1>

          {/* Gradient Mask Layer */}
          <AnimatedDiv 
            style={gradientAnimation}
            className="absolute inset-0 pointer-events-none"
          >
            <h1 className={`${mada.className} text-[8rem] md:text-[12rem] lg:text-[16rem] leading-none whitespace-pre`}>
              <span className="text-transparent">J</span>
              <span className="relative">
                <span className="absolute inset-0 animate-gradient-flow bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 
                  bg-clip-text text-transparent bg-[length:100%_auto] opacity-0 group-hover:opacity-100"
                  aria-hidden="true"
                >
                  OAKES
                </span>
                <span className="animate-gradient-flow bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 
                  bg-clip-text text-transparent bg-[length:100%_auto]"
                >
                  OAKES
                </span>
              </span>
            </h1>
          </AnimatedDiv>
        </div>

        {/* Subtitle */}
        <div className="mt-8 space-y-4 opacity-0 animate-[fadeIn_0.5s_ease-out_1.5s_forwards]">
          <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto">
            Crafting digital experiences with modern web technologies
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="inline-block px-3 py-1 text-sm rounded-full 
              bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Next.js
            </span>
            <span className="inline-block px-3 py-1 text-sm rounded-full 
              bg-blue-500/10 text-blue-400 border border-blue-500/20">
              React
            </span>
            <span className="inline-block px-3 py-1 text-sm rounded-full 
              bg-purple-500/10 text-purple-400 border border-purple-500/20">
              TypeScript
            </span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2
          opacity-0 animate-[fadeIn_0.5s_ease-out_2s_forwards]">
          <div className="w-6 h-10 border-2 border-neutral-500 rounded-full p-1">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full 
              animate-[scrollBounce_1.5s_infinite]" />
          </div>
        </div>
      </div>
    </section>
  );
} 