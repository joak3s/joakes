"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Mada } from 'next/font/google'
import MobileMenu from "./mobile-menu"

const mada = Mada({
  subsets: ["latin"],
  weight: ["900"],
  display: "swap",
})

export function Navbar() {
  const { theme, setTheme } = useTheme()

  return (
    <nav className="fixed top-0 left-0 right-0 z-[999] bg-background/85 shadow-md backdrop-blur-[5px] border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="nav-logo">
            <div className={`${mada.className} nav-logo-text`}>
              <span className="text-primary">J</span>
              <span className="text-foreground">OAKES</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link 
              href="/" 
              className="text-muted-foreground hover:text-foreground text-sm font-normal transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/featured" 
              className="text-foreground hover:text-foreground/80 text-sm font-normal transition-colors"
            >
              Featured
            </Link>
            <Link 
              href="/work" 
              className="text-foreground hover:text-foreground/80 text-sm font-normal transition-colors"
            >
              Work
            </Link>
            <Link 
              href="/contact" 
              className="text-foreground hover:text-foreground/80 text-sm font-normal transition-colors"
            >
              Contact
            </Link>
            <Link 
              href="/playground" 
              className="text-foreground hover:text-foreground/80 text-sm font-normal transition-colors"
            >
              Playground
            </Link>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </button>
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </nav>
  )
} 