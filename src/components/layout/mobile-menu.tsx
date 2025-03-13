'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-[999] w-9 h-9 flex items-center justify-center md:hidden"
        aria-label="Toggle menu"
      >
        <div className={`w-6 h-4 relative flex flex-col justify-between transition-all ${isOpen ? 'transform' : ''}`}>
          <span className={`w-full h-0.5 bg-foreground transition-all ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`w-full h-0.5 bg-foreground transition-all ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`w-full h-0.5 bg-foreground transition-all ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </div>
      </button>

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed inset-0 w-full min-h-screen bg-background z-[998] transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col gap-8 px-6 pt-28">
          <Link 
            href="/" 
            onClick={() => setIsOpen(false)}
            className="text-2xl text-foreground font-medium hover:text-foreground/80 transition-colors tracking-tight"
          >
            Home
          </Link>
          <Link 
            href="/featured" 
            onClick={() => setIsOpen(false)}
            className="text-2xl text-foreground font-medium hover:text-foreground/80 transition-colors tracking-tight"
          >
            Featured
          </Link>
          <Link 
            href="/work" 
            onClick={() => setIsOpen(false)}
            className="text-2xl text-foreground font-medium hover:text-foreground/80 transition-colors tracking-tight"
          >
            Work
          </Link>
          <Link 
            href="/contact" 
            onClick={() => setIsOpen(false)}
            className="text-2xl text-foreground font-medium hover:text-foreground/80 transition-colors tracking-tight"
          >
            Contact
          </Link>
          <Link 
            href="/playground" 
            onClick={() => setIsOpen(false)}
            className="text-2xl text-foreground font-medium hover:text-foreground/80 transition-colors tracking-tight"
          >
            Playground
          </Link>
          <button
            onClick={() => {
              setTheme(theme === "dark" ? "light" : "dark")
              setIsOpen(false)
            }}
            className="inline-flex items-center text-2xl text-foreground font-medium hover:text-foreground/80 transition-colors tracking-tight"
          >
            <span className="mr-2">Theme</span>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>
        </nav>
      </div>

      {/* Overlay for when menu is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[997] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
} 