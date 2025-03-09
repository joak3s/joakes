'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-[999] w-9 h-9 flex items-center justify-center md:hidden"
        aria-label="Toggle menu"
      >
        <div className={`w-6 h-4 relative flex flex-col justify-between transition-all ${isOpen ? 'transform' : ''}`}>
          <span className={`w-full h-0.5 bg-white transition-all ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`w-full h-0.5 bg-white transition-all ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`w-full h-0.5 bg-white transition-all ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </div>
      </button>

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed inset-0 w-full min-h-screen bg-neutral-950 z-[998] transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col gap-8 px-6 pt-28">
          <Link 
            href="/" 
            onClick={() => setIsOpen(false)}
            className="text-2xl text-neutral-200 font-medium font-mada hover:text-white transition-colors tracking-tight"
          >
            Home
          </Link>
          <Link 
            href="/featured" 
            onClick={() => setIsOpen(false)}
            className="text-2xl text-neutral-200 font-medium font-mada hover:text-white transition-colors tracking-tight"
          >
            Featured
          </Link>
          <Link 
            href="/work" 
            onClick={() => setIsOpen(false)}
            className="text-2xl text-neutral-200 font-medium font-mada hover:text-white transition-colors tracking-tight"
          >
            Work
          </Link>
          <Link 
            href="/contact" 
            onClick={() => setIsOpen(false)}
            className="text-2xl text-neutral-200 font-medium font-mada hover:text-white transition-colors tracking-tight"
          >
            Contact
          </Link>
        </nav>
      </div>

      {/* Overlay for when menu is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[997] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
} 