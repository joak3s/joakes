'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  span: {
    col: number;
    row: number;
  };
}

const projects: Project[] = [
  {
    id: 1,
    title: "Swyvvl Platform",
    description: "A modern web application for digital content management",
    category: "Web Development",
    image: "/images/swyvvl-mockup.jpg",
    span: { col: 2, row: 2 }
  },
  {
    id: 2,
    title: "Performance Analytics",
    description: "Real-time performance monitoring and analytics dashboard",
    category: "Analytics",
    image: "/images/kosei-performance.jpg",
    span: { col: 1, row: 1 }
  },
  {
    id: 3,
    title: "Portfolio Website",
    description: "Interactive portfolio showcasing projects and skills",
    category: "Design",
    image: "/images/Joakes-Webgraph-Portfolio.jpg",
    span: { col: 1, row: 1 }
  },
  {
    id: 4,
    title: "Team Collaboration",
    description: "Building amazing products with talented individuals",
    category: "Team",
    image: "/images/paddy-headshot.jpg",
    span: { col: 1, row: 2 }
  },
];

export default function AsymmetricGrid() {
  const gridRef = useRef(null);
  const isInView = useInView(gridRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <section className="w-full">
      {/* Header with gradient text */}
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
            Featured Projects
          </span>
        </h2>
        <p className="text-neutral-400 max-w-2xl mx-auto">
          Explore our latest work showcasing modern design and technical excellence
        </p>
      </div>

      {/* Asymmetric Grid */}
      <motion.div
        ref={gridRef}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
      >
        {projects.map((project) => (
          <motion.div
            key={project.id}
            variants={itemVariants}
            className={`
              group relative overflow-hidden rounded-2xl bg-neutral-900
              ${project.span.col === 2 ? 'md:col-span-2' : ''}
              ${project.span.row === 2 ? 'row-span-2' : ''}
              transform transition-transform duration-300 hover:scale-[1.02]
              shadow-lg hover:shadow-xl
            `}
          >
            {/* Project Image with Overlay */}
            <div className="relative w-full h-full min-h-[300px]">
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent z-10" />
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
                {/* Category Tag */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-sm rounded-full 
                    bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {project.category}
                  </span>
                </div>
                
                {/* Project Info */}
                <h3 className="text-xl font-bold text-white mb-2 
                  transform transition-transform duration-300 group-hover:translate-x-2">
                  {project.title}
                </h3>
                <p className="text-neutral-400 transform transition-transform 
                  duration-300 group-hover:translate-x-2">
                  {project.description}
                </p>
                
                {/* Hover Effect Line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r 
                  from-emerald-500 to-blue-500 transform origin-left scale-x-0 
                  transition-transform duration-300 group-hover:scale-x-100" />
              </div>
            </div>

            {/* Interactive Elements */}
            <div className="absolute top-4 right-4 z-30 opacity-0 transform 
              translate-y-2 transition-all duration-300 group-hover:opacity-100 
              group-hover:translate-y-0">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm 
                  hover:bg-white/20 transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full 
        mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full 
        mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
    </section>
  );
} 