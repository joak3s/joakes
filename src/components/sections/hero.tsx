'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mada } from 'next/font/google'

const mada = Mada({
  subsets: ["latin"],
  weight: ["900"],
  display: "swap",
})

export default function Hero() {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Message submitted:', message)
  }

  const promptButtons = [
    { text: 'Tell me about your case studies', width: 'w-auto' },
    { text: 'What is your vision?', width: 'w-auto' },
    { text: 'Share your background', width: 'w-auto' },
    { text: 'List your skills', width: 'w-auto' }
  ]

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-4xl mx-auto text-center mb-12"
      >
        <h1 className={`${mada.className} text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight tracking-tight mb-6`}>
          I&apos;m Jordan Oakes, a<br/>UX Designer and AI Specialist
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light">
          Ask my personal AI assistant about me!
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="w-full backdrop-blur-xl bg-card/30 rounded-2xl border border-border/30 p-6 shadow-lg">
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me about Jordan..."
                rows={3}
                className="w-full px-4 py-3 bg-background/30 rounded-xl border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-all resize-none"
              />
            </div>
            
            {/* Prompt Buttons */}
            <div className="flex flex-wrap gap-2">
              {promptButtons.map((button, index) => (
                <button
                  key={index}
                  type="button"
                  className="px-4 py-2 bg-background/30 rounded-full border border-border text-foreground text-sm hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  {button.text}
                </button>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button 
                type="submit" 
                className="group relative px-6 py-3 bg-primary rounded-full text-primary-foreground font-medium hover:bg-primary/90 transition-all"
              >
                <span className="relative flex items-center gap-2">
                  Ask AI Assistant
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </section>
  )
} 