'use client';

import { useState } from 'react';

export default function Hero() {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle chat submission here
    console.log('Message submitted:', message);
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 pt-20 pb-16 bg-neutral-950 flex flex-col items-center gap-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-black font-mada text-white leading-tight tracking-tight mb-4 [text-shadow:_0px_4px_2px_rgb(0_0_0_/_0.20)]">
          I'm Jordan Oakes, a<br/>UX Designer and AI Specialist
        </h1>
        <p className="text-xl sm:text-2xl text-gray-200 font-light font-roboto">
          Ask my personal AI assistant about me!
        </p>
      </div>

      <div className="w-full max-w-2xl px-4">
        <form onSubmit={handleSubmit} className="w-full bg-neutral-900 rounded-2xl border border-neutral-950 p-6 sm:p-12">
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me about Jordan..."
                className="w-full min-h-[4rem] px-4 py-3 bg-zinc-950 rounded-2xl shadow-[0px_0px_5px_0px_rgba(255,255,255,0.07)] border border-neutral-800 text-neutral-400 text-lg font-normal placeholder:text-neutral-400 focus:outline-none focus:border-neutral-700 transition-colors"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <button 
                type="button" 
                className="px-5 py-3 rounded-full border border-neutral-700 text-stone-300 text-base hover:bg-neutral-800 transition-colors"
              >
                Case Studies
              </button>
              <button 
                type="submit" 
                className="p-3 bg-neutral-700 rounded-full border-2 border-neutral-700 hover:bg-neutral-600 transition-colors"
              >
                <div className="w-4 h-5 bg-neutral-300" />
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-80 opacity-20 bg-white rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
} 