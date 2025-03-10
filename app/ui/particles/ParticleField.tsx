'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { particleConfig } from './config';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocity: {
    x: number;
    y: number;
  };
}

// Debounce function type
type DebouncedFunction<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void;

// Debounce function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): DebouncedFunction<T> {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default function ParticleField() {
  const particlesRef = useRef<Particle[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const configRef = useRef(particleConfig);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastUpdateTimeRef = useRef<number>(performance.now());
  const isVisibleRef = useRef(true);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Handle responsive configuration
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let currentConfig = { ...particleConfig };

      for (const responsive of particleConfig.responsive) {
        if (width <= responsive.breakpoint) {
          currentConfig = {
            ...currentConfig,
            particles: {
              ...currentConfig.particles,
              number: {
                ...currentConfig.particles.number,
                ...responsive.options.particles.number,
              },
            },
          };
          break;
        }
      }

      configRef.current = currentConfig;
      initializeParticles();
    };

    handleResize();
    const debouncedResize = debounce(handleResize, 250);
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, []);

  // Generate random particle
  const createParticle = useCallback((index: number): Particle => {
    const { size, opacity } = configRef.current.particles;
    return {
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: size.random ? Math.random() * (size.max - size.min) + size.min : size.value,
      opacity: opacity.random ? Math.random() * (opacity.max - opacity.min) + opacity.min : opacity.value,
      velocity: {
        x: (Math.random() - 0.5) * configRef.current.particles.movement.speed,
        y: (Math.random() - 0.5) * configRef.current.particles.movement.speed,
      },
    };
  }, []);

  // Initialize particles
  const initializeParticles = useCallback(() => {
    const initialParticles = Array.from(
      { length: configRef.current.particles.number.value }, 
      (_, i) => createParticle(i)
    );
    particlesRef.current = initialParticles;
    setParticles(initialParticles);
  }, [createParticle]);

  // Handle mouse movement with throttling
  useEffect(() => {
    let lastMove = 0;
    const throttleMs = 16; // ~60fps

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMove >= throttleMs) {
        mousePositionRef.current = {
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        };
        lastMove = now;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animate particles using requestAnimationFrame
  const updateParticles = useCallback((timestamp: number) => {
    if (!isVisibleRef.current) {
      animationFrameRef.current = requestAnimationFrame(updateParticles);
      return;
    }

    if (timestamp - lastUpdateTimeRef.current < 16) { // Limit to ~60fps
      animationFrameRef.current = requestAnimationFrame(updateParticles);
      return;
    }

    const updatedParticles = particlesRef.current.map(particle => {
      let newX = particle.x + particle.velocity.x;
      let newY = particle.y + particle.velocity.y;

      // Handle out of bounds based on config
      if (configRef.current.particles.movement.outMode === "wrap") {
        if (newX > 100) newX = 0;
        if (newX < 0) newX = 100;
        if (newY > 100) newY = 0;
        if (newY < 0) newY = 100;
      }

      // Repulsion from mouse
      const dx = newX - mousePositionRef.current.x;
      const dy = newY - mousePositionRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const repulseDistance = configRef.current.particles.interactivity.repulse.distance;
      const repulseStrength = configRef.current.particles.interactivity.repulse.strength;
      
      if (distance < repulseDistance) {
        const angle = Math.atan2(dy, dx);
        const force = (repulseDistance - distance) / repulseDistance * repulseStrength;
        newX += Math.cos(angle) * force;
        newY += Math.sin(angle) * force;
      }

      return {
        ...particle,
        x: newX,
        y: newY,
      };
    });

    particlesRef.current = updatedParticles;
    setParticles(updatedParticles);
    lastUpdateTimeRef.current = timestamp;
    animationFrameRef.current = requestAnimationFrame(updateParticles);
  }, []);

  // Start animation loop
  useEffect(() => {
    initializeParticles();
    animationFrameRef.current = requestAnimationFrame(updateParticles);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initializeParticles, updateParticles]);

  // Handle click to add particles with debouncing
  const handleClick = useCallback(
    debounce(() => {
      const newParticles = Array.from(
        { length: configRef.current.particles.interactivity.push.particles_nb }, 
        (_, i) => createParticle(particlesRef.current.length + i)
      );
      particlesRef.current = [...particlesRef.current, ...newParticles];
      setParticles(prev => [...prev, ...newParticles]);
    }, 100),
    [createParticle]
  );

  // Memoize particle elements
  const particleElements = useMemo(() => (
    particles.map((particle) => (
      <motion.div
        key={particle.id}
        className="absolute rounded-full bg-white"
        initial={{ x: `${particle.x}vw`, y: `${particle.y}vh`, opacity: particle.opacity }}
        animate={{
          x: `${particle.x}vw`,
          y: `${particle.y}vh`,
          opacity: particle.opacity,
        }}
        transition={{
          duration: 0.016,
          ease: "linear",
        }}
        style={{
          width: `${particle.size}px`,
          height: `${particle.size}px`,
          willChange: 'transform',
        }}
      />
    ))
  ), [particles]);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0"
      onClick={handleClick}
      style={{ 
        pointerEvents: 'auto',
        contain: 'strict',
      }}
    >
      {particleElements}
    </div>
  );
} 