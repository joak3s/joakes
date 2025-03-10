'use client';

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Swyvvl',
    description: 'A modern ride-sharing platform connecting drivers with passengers, featuring real-time tracking and seamless payments.',
    image: '/images/swyvvl-mockup.jpg',
    tags: ['React Native', 'Node.js', 'MongoDB', 'WebSocket'],
    link: 'https://swyvvl.com'
  },
  {
    id: 2,
    title: 'Webgraph Portfolio',
    description: 'A dynamic portfolio website showcasing creative work with interactive animations and smooth transitions.',
    image: '/images/Joakes-Webgraph-Portfolio.jpg',
    tags: ['Next.js', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
    link: 'https://webgraph.com'
  },
  {
    id: 3,
    title: 'Kosei Performance',
    description: 'An e-commerce platform for performance auto parts with advanced filtering and real-time inventory management.',
    image: '/images/kosei-performance.jpg',
    tags: ['Next.js', 'Shopify', 'Tailwind CSS', 'TypeScript'],
    link: 'https://koseiperformance.com'
  },
];

function ProjectCard({ project, scrollYProgress }: { project: Project; scrollYProgress: MotionValue<number> }) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Create individual scroll progress for each card
  const { scrollYProgress: cardProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start']
  });
  
  // Transform the scroll progress into y-position and opacity
  const y = useTransform(cardProgress, [0, 0.5, 1], [100, 0, -100]);
  const opacity = useTransform(cardProgress, [0, 0.5, 1], [0.6, 1, 0.6]);
  const scale = useTransform(cardProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <motion.div
      ref={cardRef}
      style={{ y, opacity, scale }}
      className="relative flex flex-col md:flex-row gap-8 items-center bg-neutral-900/50 
        rounded-2xl p-8 backdrop-blur-sm border border-neutral-800 hover:border-neutral-700 
        transition-colors group"
    >
      <div className="w-full md:w-1/2 aspect-video relative rounded-xl overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      
      <div className="w-full md:w-1/2 space-y-4">
        <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-neutral-300">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm rounded-full bg-neutral-800 text-neutral-300
                border border-neutral-700 group-hover:border-neutral-600 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 px-6 py-2 rounded-full bg-neutral-800 text-white 
            hover:bg-neutral-700 transition-colors border border-neutral-700 
            hover:border-neutral-600"
        >
          View Project
        </a>
      </div>
    </motion.div>
  );
}

export default function ProjectShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  return (
    <section className="py-20 bg-[#121212]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          Featured Projects
        </h2>
        
        <div
          ref={containerRef}
          className="relative space-y-24 py-12"
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 