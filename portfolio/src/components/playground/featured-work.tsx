'use client';

import { motion } from 'framer-motion'
import { ArrowUpRight, Github } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface Project {
  title: string
  description: string
  image: string
  link: string
  github?: string
  tags: string[]
}

const projects: Project[] = [
  {
    title: "Swyvvl Real Estate",
    description: "Modern real estate platform with advanced property management features",
    image: "/images/swyvvl-mockup.jpg",
    link: "#",
    github: "https://github.com",
    tags: ["Next.js", "React", "TypeScript"]
  },
  {
    title: "Kosei Performance",
    description: "High-performance automotive service website with booking system",
    image: "/images/kosei-performance.jpg",
    link: "#",
    tags: ["Next.js", "TailwindCSS", "Vercel"]
  },
  {
    title: "Flourish Digital",
    description: "Digital marketing agency with modern design and animations",
    image: "/images/Flourish-MacBook-Air-Mockup-Green-BG.jpg",
    link: "#",
    github: "https://github.com",
    tags: ["React", "Framer Motion", "GSAP"]
  }
]

interface FeaturedWorkCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
}

function FeaturedWorkCard({ title, description, image, link }: FeaturedWorkCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
    setGlowPosition(prev => ({
      x: prev.x + (x - prev.x) * 0.1,
      y: prev.y + (y - prev.y) * 0.1
    }));
  };

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="relative group cursor-pointer block"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setPosition({ x: 50, y: 50 });
      }}
      initial={false}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated border container */}
      <div className="absolute -inset-[1px] rounded-lg overflow-hidden">
        <div 
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `
              radial-gradient(
                circle at ${glowPosition.x}% ${glowPosition.y}%,
                rgba(147, 51, 234, 0.5),
                rgba(59, 130, 246, 0.5) 50%,
                transparent 100%
              )
            `,
            opacity: isHovered ? 1 : 0.3
          }}
        />
      </div>

      {/* Content */}
      <div className="relative rounded-lg dark:bg-neutral-950/95 bg-white/95 backdrop-blur-xl border dark:border-white/10 border-black/10 overflow-hidden">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2 dark:text-white text-neutral-900">{title}</h3>
          <p className="dark:text-neutral-400 text-neutral-600">{description}</p>
        </div>
      </div>
    </motion.a>
  );
}

export function FeaturedWork() {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <FeaturedWorkCard key={index} title={project.title} description={project.description} image={project.image} link={project.link} />
        ))}
      </div>
    </div>
  )
} 