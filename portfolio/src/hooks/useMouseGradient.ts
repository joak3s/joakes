'use client';

import { useState } from 'react';

interface MouseGradientOptions {
  gradientSize?: number;
  color?: string;
  secondaryColor?: string;
  opacity?: number;
  type?: 'radial' | 'linear';
  spread?: number;
}

export function useMouseGradient({
  gradientSize = 400,
  color = '147, 51, 234',
  secondaryColor = '59, 130, 246',
  opacity = 0.15,
  type = 'radial',
  spread = 80
}: MouseGradientOptions = {}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 50, y: 50 });
  };

  const style = {
    background: type === 'radial'
      ? `radial-gradient(${gradientSize}px circle at ${position.x}% ${position.y}%, rgb(${color}, ${opacity}), rgb(${secondaryColor}, ${opacity}) ${spread}%, transparent 100%)`
      : `linear-gradient(${position.x}deg, rgb(${color}, ${opacity}), rgb(${secondaryColor}, ${opacity}) ${spread}%, transparent 100%)`,
    opacity: isHovered ? 1 : 0
  };

  return {
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    style,
    isHovered
  };
} 