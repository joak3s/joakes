'use client';

import Link from 'next/link';
import ParticleField from '../ui/particles/ParticleField';

export default function ParticlePage() {
  return (
    <main className="min-h-screen bg-black text-white relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 p-4 z-10 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link 
            href="/" 
            className="text-white hover:text-neutral-200 transition-colors"
          >
            ← Back to Home
          </Link>
          <h1 className="text-xl font-medium">Particle Demo</h1>
        </div>
      </nav>

      {/* Particle Effect */}
      <ParticleField />

      {/* Content */}
      <div className="relative z-10 pt-24 px-4 max-w-7xl mx-auto">
        <div className="space-y-8">
          <section className="bg-black/50 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-medium mb-4">Interactive Particle System</h2>
            <p className="text-neutral-300">
              Move your mouse around to interact with the particles. Click anywhere to add more particles.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
} 