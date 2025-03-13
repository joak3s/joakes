'use client';

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ArrowUpRight, Github, Tag } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useMouseGradient } from '@/hooks/useMouseGradient'

interface Project {
  title: string
  description: string
  image: string
  link: string
  github?: string
  tags: string[]
  category: string
}

const projects: Project[] = [
  {
    title: "Swyvvl Real Estate",
    description: "Modern real estate platform with advanced property management features",
    image: "/images/swyvvl-mockup.jpg",
    link: "#",
    github: "https://github.com",
    tags: ["Next.js", "React", "TypeScript"],
    category: "Web App"
  },
  {
    title: "Kosei Performance",
    description: "High-performance automotive service website with booking system",
    image: "/images/kosei-performance.jpg",
    link: "#",
    tags: ["Next.js", "TailwindCSS", "Vercel"],
    category: "Web App"
  },
  {
    title: "Flourish Digital",
    description: "Digital marketing agency with modern design and animations",
    image: "/images/Flourish-MacBook-Air-Mockup-Green-BG.jpg",
    link: "#",
    github: "https://github.com",
    tags: ["React", "Framer Motion", "GSAP"],
    category: "Web App"
  },
  {
    title: "Precision Mercedes",
    description: "Luxury automotive service platform with online booking",
    image: "/images/Precision-Mercedes-Laptop-Home.jpg",
    link: "#",
    github: "https://github.com",
    tags: ["Next.js", "Prisma", "PostgreSQL"],
    category: "Web App"
  },
  {
    title: "RCTB Platform",
    description: "Educational platform with video content and member management",
    image: "/images/RCTB-MacBook-Air-Mockup-Cream.jpg",
    link: "#",
    tags: ["React", "Node.js", "MongoDB"],
    category: "E-Learning"
  },
  {
    title: "Aletheia Design",
    description: "Creative agency portfolio with interactive animations",
    image: "/images/Aletheia-Our-Work-Post-iPhone-Mockup-Purple.jpg",
    link: "#",
    github: "https://github.com",
    tags: ["Next.js", "Three.js", "GSAP"],
    category: "Portfolio"
  }
]

const categories = Array.from(new Set(projects.map(project => project.category)))

function ProjectCard({ title, description, link, github, tags }: Omit<Project, 'image' | 'category'>) {
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlowPosition(prev => ({
      x: prev.x + (x - prev.x) * 0.1,
      y: prev.y + (y - prev.y) * 0.1
    }));
  };

  return (
    <motion.div
      className="relative group cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setGlowPosition({ x: 50, y: 50 });
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated border container */}
      <div className="absolute -inset-[1px] rounded-2xl overflow-hidden">
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
      <div className="relative rounded-2xl dark:bg-neutral-950/90 bg-white/90 backdrop-blur-xl border dark:border-white/10 border-black/10 p-6">
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900">{title}</h3>
            <div className="flex gap-2">
              {github && (
                <Link
                  href={github}
                  className="p-2 -mr-2 rounded-xl dark:hover:bg-white/5 hover:bg-black/5 transition-colors"
                  target="_blank"
                >
                  <Github className="w-5 h-5 dark:text-white text-neutral-900" />
                </Link>
              )}
              <Link
                href={link}
                className="p-2 -mr-2 rounded-xl dark:hover:bg-white/5 hover:bg-black/5 transition-colors"
                target="_blank"
              >
                <ArrowUpRight className="w-5 h-5 dark:text-white text-neutral-900" />
              </Link>
            </div>
          </div>
          <p className="text-sm dark:text-neutral-400 text-neutral-600 mb-4 flex-grow">{description}</p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2.5 py-1 text-xs rounded-lg dark:bg-white/5 bg-black/5 dark:text-white text-neutral-900 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function WorkGrid() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const mouseGradient = useMouseGradient({
    gradientSize: 450,
    color: '147, 51, 234',
    secondaryColor: '59, 130, 246',
    opacity: 0.15,
    type: 'radial',
    spread: 80
  })

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = !selectedCategory || project.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Search and Filter */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-4"
        onMouseMove={mouseGradient.handleMouseMove}
        onMouseEnter={mouseGradient.handleMouseEnter}
        onMouseLeave={mouseGradient.handleMouseLeave}
      >
        {/* Search Input with Glassmorphic Effect */}
        <div className="relative flex-1">
          <div className="absolute -inset-[1px] rounded-xl overflow-hidden">
            <div 
              className={cn(
                "absolute inset-0 transition-opacity duration-300",
                "bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20",
                isSearchFocused ? "opacity-100" : "opacity-30"
              )}
            />
            <motion.div
              className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300"
              style={mouseGradient.style}
            />
          </div>
          <div className="relative rounded-xl dark:bg-neutral-950/80 bg-white/80 backdrop-blur-xl border dark:border-white/10 border-black/10">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 dark:text-white/70 text-neutral-500" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-9 pr-4 py-2.5 bg-transparent focus:outline-none dark:text-white text-neutral-900 dark:placeholder:text-white/50 placeholder:text-neutral-500"
            />
          </div>
        </div>

        {/* Category Filter with Glassmorphic Effect */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          <motion.button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "px-4 py-2.5 rounded-xl text-sm whitespace-nowrap",
              "dark:bg-neutral-950/80 bg-white/80 backdrop-blur-xl border",
              !selectedCategory
                ? "dark:border-purple-500/50 border-purple-500/50 dark:text-purple-400 text-purple-600 dark:bg-purple-500/10 bg-purple-500/10"
                : "dark:border-white/10 border-black/10 dark:text-white text-neutral-900 hover:dark:bg-white/5 hover:bg-black/5"
            )}
            whileHover={{ opacity: 0.9 }}
            whileTap={{ scale: 0.98 }}
          >
            All
          </motion.button>
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm whitespace-nowrap",
                "dark:bg-neutral-950/80 bg-white/80 backdrop-blur-xl border",
                selectedCategory === category
                  ? "dark:border-purple-500/50 border-purple-500/50 dark:text-purple-400 text-purple-600 dark:bg-purple-500/10 bg-purple-500/10"
                  : "dark:border-white/10 border-black/10 dark:text-white text-neutral-900 hover:dark:bg-white/5 hover:bg-black/5"
              )}
              whileHover={{ opacity: 0.9 }}
              whileTap={{ scale: 0.98 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Tag className="w-12 h-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No projects found</h3>
          <p className="mt-2 text-muted-foreground">
            Try adjusting your search or filter to find what you&apos;re looking for.
          </p>
        </div>
      )}
    </div>
  )
} 