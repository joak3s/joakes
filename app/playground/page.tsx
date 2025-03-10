'use client';

import { Mada } from 'next/font/google';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const DesignComponent = dynamic(() => import('../ui/design-component'), {
  ssr: true,
});

const mada = Mada({
  subsets: ["latin"],
  weight: ["900"],
  display: "swap",
});

export default function Playground() {
  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Navigation Bar */}
      <div className="sticky top-0 z-50 w-full bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/"
              className="text-neutral-200 hover:text-white transition-colors"
            >
              ← Back to Portfolio
            </Link>
            <h1 className={`${mada.className} text-xl text-white`}>
              Design Playground
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {/* Section 1: Gradient Cards */}
            <section>
              <h2 className={`${mada.className} text-3xl font-black text-white mb-8`}>
                Gradient Components
              </h2>
              <DesignComponent />
            </section>

            {/* Section 2: Component Controls */}
            <section className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
              <h2 className={`${mada.className} text-2xl font-black text-white mb-4`}>
                Component Controls
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-300">
                    Gradient Direction
                  </label>
                  <select className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white">
                    <option>Top Right</option>
                    <option>Top</option>
                    <option>Right</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-300">
                    Animation Speed
                  </label>
                  <select className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white">
                    <option>Slow</option>
                    <option>Medium</option>
                    <option>Fast</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-300">
                    Hover Effect
                  </label>
                  <select className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white">
                    <option>Scale</option>
                    <option>Rotate</option>
                    <option>Both</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Section 3: Code Preview */}
            <section className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
              <h2 className={`${mada.className} text-2xl font-black text-white mb-4`}>
                Code Preview
              </h2>
              <pre className="bg-neutral-950 rounded-lg p-4 overflow-x-auto">
                <code className="text-neutral-300">
                  {`<motion.div
  whileHover={{ scale: 1.02 }}
  className="relative p-[2px] rounded-2xl 
    bg-gradient-to-tr from-neutral-800 
    via-neutral-700 to-neutral-800"
>
  {/* Component content */}
</motion.div>`}
                </code>
              </pre>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
} 