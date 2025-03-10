'use client';

import { useState } from 'react';
import { Mada } from 'next/font/google';

const mada = Mada({
  subsets: ["latin"],
  weight: ["900"],
  display: "swap",
});

export default function Hero() {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Message submitted:', message);
  };

  const promptButtons = [
    { text: 'Case Studies', width: 'w-36' },
    { text: 'Vision', width: 'w-20' },
    { text: 'Background', width: 'w-32' },
    { text: 'Skills', width: 'w-20' }
  ];

  return (
    <>
      {/* Full Viewport Width Background Container */}
      <div className="fixed inset-0 w-screen h-screen pointer-events-none">
        {/* Gradient Circle */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 w-[280px] sm:w-[400px] md:w-[600px] h-[200px] sm:h-[300px] md:h-[400px] opacity-15 bg-white rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px]"
          style={{ top: '45%' }}
        />
      </div>

      {/* Content Section */}
      <section className="relative w-full px-4 sm:px-6 lg:px-16 pt-24 md:pt-28 pb-16 flex flex-col items-center gap-6 md:gap-16">
        <div className="relative z-10 w-full max-w-4xl mx-auto text-center py-8">
          <h1 className={`${mada.className} text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-4 [text-shadow:_0px_4px_2px_rgb(0_0_0_/_0.20)]`}>
            I'm Jordan Oakes, a<br/>UX Designer and AI Specialist
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-200 font-light">
            Ask my personal AI assistant about me!
          </p>
        </div>

        <div className="relative z-10 w-full max-w-2xl px-4">
          <form onSubmit={handleSubmit} className="w-full bg-neutral-900 rounded-2xl border border-neutral-950 p-6">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me about Jordan..."
                  className="w-full min-h-[4rem] px-4 py-3 bg-zinc-950 rounded-2xl shadow-[0px_0px_5px_0px_rgba(255,255,255,0.07)] border border-neutral-800 text-neutral-400 text-base md:text-lg font-normal placeholder:text-neutral-400 focus:outline-none focus:border-neutral-700 transition-colors"
                />
              </div>
              
              {/* Mobile Submit Button */}
              <div className="flex justify-end md:hidden">
                <button 
                  type="submit" 
                  className="w-11 h-11 bg-stone-300 rounded-full border-2 border-stone-300 flex items-center justify-center"
                >
                  <div className="w-4 h-5 bg-zinc-800" />
                </button>
              </div>

              {/* Desktop/Tablet Submit Button */}
              <div className="hidden md:flex items-center justify-between gap-4">
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

          {/* Mobile Prompt Buttons */}
          <div className="flex flex-wrap gap-2 mt-4 md:hidden">
            {promptButtons.map((button, index) => (
              <button
                key={index}
                className={`${button.width} h-11 rounded-full border-2 border-neutral-600 flex justify-center items-center`}
              >
                <span className="text-stone-300 text-base font-normal">
                  {button.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
} 