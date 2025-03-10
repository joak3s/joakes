'use client';

import Link from 'next/link';
import MobileMenu from './mobile-menu';
import { Mada } from 'next/font/google';

const mada = Mada({
  subsets: ["latin"],
  weight: ["900"],
  display: "swap",
});

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[999] bg-stone-950 shadow-md backdrop-blur-[5px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 tracking-wide">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="nav-logo">
            <div className={`${mada.className} nav-logo-text`}>
              <span className="nav-logo-j">J</span>
              <span className="nav-logo-oakes">OAKES</span>
            </div>
          </Link>
          
          {/* Desktop/Tablet Navigation (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link 
              href="/" 
              className="text-neutral-400 hover:text-white text-sm font-normal transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/featured" 
              className="text-white hover:text-neutral-200 text-sm font-normal transition-colors"
            >
              Featured
            </Link>
            <Link 
              href="/work" 
              className="text-white hover:text-neutral-200 text-sm font-normal transition-colors"
            >
              Work
            </Link>
            <Link 
              href="/contact" 
              className="text-white hover:text-neutral-200 text-sm font-normal transition-colors"
            >
              Contact
            </Link>
            <Link 
              href="/playground" 
              className="text-white hover:text-neutral-200 text-sm font-normal transition-colors"
            >
              Playground
            </Link>
            <Link 
              href="/particles" 
              className="text-white hover:text-neutral-200 text-sm font-normal transition-colors"
            >
              Particles
            </Link>
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
} 