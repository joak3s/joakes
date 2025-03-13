'use client'

import { Mada } from 'next/font/google'
import Link from 'next/link'
import { AIChat } from '@/components/playground/ai-chat'
import { FeaturedWork } from '@/components/playground/featured-work'
import { WorkGrid } from '@/components/playground/work-grid'
import { ContactForm } from '@/components/playground/contact-form'
import { GradientCard } from '@/components/playground/GradientComponents'
import { InteractiveBorderCard } from '@/components/playground/InteractiveBorderCards'
import { AnimatedTitle } from '@/components/playground/animated-title'

const mada = Mada({
  subsets: ["latin"],
  weight: ["900"],
  display: "swap",
})

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <Link 
            href="/"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            ← Back to Portfolio
          </Link>
          <h1 className={`${mada.className} text-2xl text-white`}>
            Design Playground
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center">
          <AnimatedTitle />
        </div>
        
        <div className="space-y-24">

          {/* Gradient Cards Section */}
          <section>
            <h2 className={`${mada.className} text-3xl font-black text-white mb-8`}>
              Gradient Components
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GradientCard
                variant="glow"
                title="Glowing Gradient"
                description="Interactive card with a glowing gradient border that animates on hover"
              />
              <GradientCard
                variant="subtle"
                title="Subtle Gradient"
                description="Minimalist card with a subtle background gradient and gradient text"
              />
              <GradientCard
                variant="glass"
                title="Glassmorphic Gradient"
                description="Modern glassmorphic card with gradient overlay and blur effects"
              />
               <InteractiveBorderCard
                title="Interactive Border"
                description="A smooth gradient border that follows your mouse movement with spring physics"
              />
            </div>
          </section>

          {/* Other sections */}
          <section>
            <h2 className={`${mada.className} text-3xl font-black text-white mb-8`}>
              AI Chat Interface
            </h2>
            <div>
              <AIChat />
            </div>
          </section>

          <section>
            <h2 className={`${mada.className} text-3xl font-black text-white mb-8`}>
              Featured Work
            </h2>
            <div>
              <FeaturedWork />
            </div>
          </section>

          <section>
            <h2 className={`${mada.className} text-3xl font-black text-white mb-8`}>
              Project Grid
            </h2>
            <div>
              <WorkGrid />
            </div>
          </section>

          <section className="pb-24 max-w-2xl mx-auto">
            <h2 className={`${mada.className} text-3xl font-black text-white mb-8`}>
              Contact Form
            </h2>
            <div className="backdrop-blur-xl bg-neutral-950/60 rounded-2xl border-neutral-800/30 p-0 shadow-lg">
              <ContactForm />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
} 