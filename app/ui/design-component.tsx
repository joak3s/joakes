'use client';

import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';

const DesignComponent = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
  };

  // Individual card mouse tracking
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation angle based on mouse position
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
    
    // Update the card's custom properties
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    card.style.setProperty('--gradient-angle', `${angle}deg`);
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 py-16 px-8">
      <div className="max-w-7xl mx-auto space-y-32">
        {/* Section 1: Gradient Stroke Cards */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-12">Gradient Stroke Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Design System", 
                gradient: "from-blue-600 via-violet-600 to-fuchsia-500",
                colors: ["#2563eb", "#7c3aed", "#d946ef"]
              },
              { 
                title: "Components", 
                gradient: "from-emerald-500 via-teal-500 to-cyan-400",
                colors: ["#10b981", "#14b8a6", "#22d3ee"]
              },
              { 
                title: "Animations", 
                gradient: "from-amber-500 via-orange-500 to-red-500",
                colors: ["#f59e0b", "#f97316", "#ef4444"]
              }
            ].map((card, index) => (
              <motion.div
                key={`gradient-${index}`}
                className="group relative rounded-2xl cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                onMouseMove={handleCardMouseMove}
                style={{
                  '--mouse-x': '0px',
                  '--mouse-y': '0px',
                  '--gradient-angle': '0deg'
                } as React.CSSProperties}
              >
                {/* Card background */}
                <div className="absolute inset-0 bg-neutral-900 rounded-2xl" />
                
                {/* Gradient border container */}
                <div className="absolute inset-0 rounded-2xl p-[1px] z-[1]">
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-30 group-hover:opacity-100 transition-all duration-500"
                    style={{
                      background: `linear-gradient(var(--gradient-angle), ${card.colors[0]}, ${card.colors[1]}, ${card.colors[2]})`,
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'exclude',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      padding: '1px'
                    } as React.CSSProperties}
                  />
                  
                  {/* Mouse follow effect */}
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-80 transition-all duration-300"
                    style={{
                      background: `
                        radial-gradient(
                          600px circle at var(--mouse-x) var(--mouse-y),
                          ${card.colors[1]}20,
                          transparent 40%
                        )
                      `,
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'exclude',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      padding: '1px'
                    }}
                  />
                </div>
                
                {/* Content container */}
                <div className="relative p-6 h-full z-[2]">
                  <div className="flex flex-col h-full">
                    <h3 className="text-xl font-semibold text-white mb-3">{card.title}</h3>
                    <p className="text-neutral-300 text-sm">
                      Interactive card with dynamic gradient borders that follow your mouse movement.
                    </p>
                    <div className="mt-auto pt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 text-sm font-medium text-white bg-gradient-to-r ${card.gradient} rounded-lg opacity-80 hover:opacity-100 transition-all duration-300 shadow-lg shadow-neutral-950/50`}
                      >
                        Explore
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 2: Scroll-triggered Animation Cards */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-12">Scroll Animations</h2>
          <div className="grid grid-cols-1 gap-8">
            {[1, 2, 3].map((index) => (
              <motion.div
                key={`scroll-${index}`}
                className="relative rounded-2xl overflow-hidden"
                initial={{ opacity: 0 }}
                whileInView={{ 
                  opacity: 1,
                  transition: {
                    duration: 0.5,
                    delay: index * 0.2,
                    ease: "easeOut"
                  }
                }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-700 to-neutral-900 opacity-75" />
                <div className="relative p-8">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ 
                      opacity: 1,
                      transition: {
                        duration: 0.5,
                        delay: 0.3 + index * 0.2,
                        ease: "easeOut"
                      }
                    }}
                    viewport={{ once: true }}
                  >
                    <motion.h3 
                      className="text-2xl font-bold text-white mb-4"
                      initial={{ opacity: 0 }}
                      whileInView={{
                        opacity: 1,
                        transition: {
                          duration: 0.5,
                          delay: 0.4 + index * 0.2,
                          ease: "easeOut"
                        }
                      }}
                      viewport={{ once: true }}
                    >
                      Scroll Effect {index}
                    </motion.h3>
                    <motion.p 
                      className="text-white/80"
                      initial={{ opacity: 0 }}
                      whileInView={{
                        opacity: 1,
                        transition: {
                          duration: 0.5,
                          delay: 0.5 + index * 0.2,
                          ease: "easeOut"
                        }
                      }}
                      viewport={{ once: true }}
                    >
                      Smooth fade animation as you scroll through the content.
                    </motion.p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 3: Interactive Feature Cards */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-12">Interactive Feature Cards</h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            onMouseMove={handleMouseMove}
          >
            {[1, 2, 3].map((index) => (
              <motion.div
                key={`feature-${index}`}
                className="relative rounded-2xl cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                onClick={() => setSelectedCard(selectedCard === index ? null : index)}
              >
                {/* Animated gradient border */}
                <motion.div 
                  className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 blur-sm"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  animate={{
                    opacity: selectedCard === index ? 1 : 0,
                    scale: selectedCard === index ? 1.02 : 1
                  }}
                />
                
                {/* Content container */}
                <div className="relative bg-neutral-900/90 rounded-2xl p-6 h-full border border-neutral-800/50">
                  <div className="flex flex-col h-full">
                    <motion.h3 
                      className="text-xl font-semibold text-white mb-3"
                      animate={{ 
                        scale: selectedCard === index ? 1.05 : 1,
                        color: selectedCard === index ? '#fff' : '#e5e7eb'
                      }}
                    >
                      Feature {index}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-neutral-300 text-sm"
                      animate={{ opacity: selectedCard === index ? 1 : 0.8 }}
                    >
                      Interactive card with dynamic gradients. Click to expand and see more details.
                    </motion.p>

                    <AnimatePresence>
                      {selectedCard === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 text-sm text-neutral-400"
                        >
                          Additional details appear when the card is selected.
                          The gradient border intensifies and the card subtly elevates.
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="mt-auto pt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg opacity-90 hover:opacity-100 transition-opacity"
                      >
                        Learn More
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default DesignComponent; 