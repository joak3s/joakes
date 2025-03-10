'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function GlassContact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full max-w-2xl mx-auto"
      role="region"
      aria-label="Contact form"
    >
      {/* Vibrant underlay gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-neutral-500/5 to-violet-500/10 blur-3xl"
        aria-hidden="true"
      />

      {/* Glass card */}
      <div
        className="relative backdrop-blur-xl bg-neutral-950/70 border border-white/5 rounded-2xl shadow-2xl p-8 overflow-hidden"
      >
        {/* Subtle gradient overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Let's Connect
          </h2>
          <p className="text-neutral-200 max-w-lg">
            Have a project in mind? I'd love to hear about it. Send me a message and let's create something amazing together.
          </p>

          {/* Form */}
          <form className="space-y-4">
            <div className="space-y-2">
              <label 
                htmlFor="name"
                className="block text-sm font-medium text-neutral-200"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 bg-neutral-900/50 border border-white/5 rounded-lg 
                         text-white placeholder-neutral-400 focus:outline-none focus:ring-2 
                         focus:ring-emerald-500/30 focus:border-transparent transition-colors"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <label 
                htmlFor="email"
                className="block text-sm font-medium text-neutral-200"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 bg-neutral-900/50 border border-white/5 rounded-lg 
                         text-white placeholder-neutral-400 focus:outline-none focus:ring-2 
                         focus:ring-emerald-500/30 focus:border-transparent transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <label 
                htmlFor="message"
                className="block text-sm font-medium text-neutral-200"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full px-4 py-2 bg-neutral-900/50 border border-white/5 rounded-lg 
                         text-white placeholder-neutral-400 focus:outline-none focus:ring-2 
                         focus:ring-emerald-500/30 focus:border-transparent transition-colors 
                         resize-none"
                placeholder="Tell me about your project..."
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 
                       rounded-lg text-white font-medium shadow-lg shadow-emerald-500/10 
                       hover:shadow-emerald-500/20 focus:outline-none focus:ring-2 
                       focus:ring-emerald-500/30 transition-all"
            >
              Send Message
            </motion.button>
          </form>

          {/* Social links */}
          <div className="pt-6 border-t border-white/5">
            <div className="flex items-center justify-center space-x-6">
              <a 
                href="#" 
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="GitHub profile"
              >
                GitHub
              </a>
              <a 
                href="#" 
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="LinkedIn profile"
              >
                LinkedIn
              </a>
              <a 
                href="#" 
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Twitter profile"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 