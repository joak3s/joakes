'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function NeumorphicElements() {
  const [isPressed, setIsPressed] = useState(false);

  // Progress data
  const skills = [
    { name: 'React', progress: 90 },
    { name: 'TypeScript', progress: 85 },
    { name: 'Next.js', progress: 80 },
  ];

  const circularProgress = 75;

  return (
    <div className="space-y-12">
      {/* Neumorphic Button */}
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-xl font-medium text-white">Neumorphic Button</h3>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsPressed(!isPressed)}
          className={`
            relative px-8 py-3 rounded-xl text-emerald-500 font-medium
            transition-all duration-200 select-none
            ${isPressed ? 
              'bg-neutral-900 shadow-[inset_3px_3px_6px_#0a0a0a,inset_-3px_-3px_6px_#262626]' : 
              'bg-neutral-900 shadow-[5px_5px_10px_#0a0a0a,-5px_-5px_10px_#262626] hover:shadow-[7px_7px_14px_#0a0a0a,-7px_-7px_14px_#262626]'
            }
          `}
        >
          Interactive Button
        </motion.button>
      </div>

      {/* Neumorphic Card */}
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-xl font-medium text-white">Neumorphic Progress Indicators</h3>
        <div className="w-full max-w-md">
          <div className="
            bg-neutral-900 rounded-2xl p-6
            shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#262626]
          ">
            {/* Card Header */}
            <div className="
              mb-6 p-4 rounded-xl
              shadow-[inset_3px_3px_6px_#0a0a0a,inset_-3px_-3px_6px_#262626]
            ">
              <h4 className="text-lg font-medium text-emerald-500">
                Progress Indicators
              </h4>
              <p className="text-sm text-neutral-400">
                Various neumorphic progress styles
              </p>
            </div>

            {/* Card Content */}
            <div className="space-y-8">
              {/* Linear Progress Bars */}
              <div className="space-y-4">
                <h5 className="text-sm font-medium text-neutral-200 mb-4">Linear Progress</h5>
                {skills.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">{skill.name}</span>
                      <span className="text-emerald-500">{skill.progress}%</span>
                    </div>
                    <div className="
                      h-2 rounded-full
                      shadow-[inset_2px_2px_4px_#0a0a0a,inset_-2px_-2px_4px_#262626]
                    ">
                      <div 
                        className="
                          h-full rounded-full
                          bg-gradient-to-r from-emerald-600 to-emerald-500
                          shadow-[2px_2px_4px_#0a0a0a,-2px_-2px_4px_#262626]
                          transition-all duration-500
                        "
                        style={{ width: `${skill.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Circular Progress */}
              <div className="flex justify-center pt-4">
                <div className="relative w-32 h-32">
                  {/* Circular Track */}
                  <div className="
                    absolute inset-0 rounded-full
                    shadow-[inset_4px_4px_8px_#0a0a0a,inset_-4px_-4px_8px_#262626]
                  "/>
                  
                  {/* Progress Circle */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      className="text-neutral-800"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="58"
                      cx="64"
                      cy="64"
                    />
                    <circle
                      className="text-emerald-500 transition-all duration-500"
                      strokeWidth="8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="58"
                      cx="64"
                      cy="64"
                      strokeDasharray={`${2 * Math.PI * 58}`}
                      strokeDashoffset={`${2 * Math.PI * 58 * (1 - circularProgress / 100)}`}
                    />
                  </svg>
                  
                  {/* Percentage Display */}
                  <div className="
                    absolute inset-0 flex items-center justify-center
                    text-2xl font-bold text-emerald-500
                  ">
                    {circularProgress}%
                  </div>
                </div>
              </div>

              {/* Segmented Progress */}
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-neutral-200">Segmented Progress</h5>
                <div className="flex gap-1">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`
                        flex-1 h-1.5 rounded-full transition-all duration-300
                        ${i < 7 ? 
                          'bg-emerald-500 shadow-[1px_1px_2px_#0a0a0a,-1px_-1px_2px_#262626]' : 
                          'shadow-[inset_1px_1px_2px_#0a0a0a,inset_-1px_-1px_2px_#262626]'
                        }
                      `}
                    />
                  ))}
                </div>
              </div>

              {/* Steps Progress */}
              <div className="flex justify-between items-center pt-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex flex-col items-center gap-2">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${step <= 2 ?
                        'bg-emerald-500 shadow-[2px_2px_4px_#0a0a0a,-2px_-2px_4px_#262626]' :
                        'shadow-[inset_2px_2px_4px_#0a0a0a,inset_-2px_-2px_4px_#262626]'
                      }
                    `}>
                      <span className={`text-sm font-medium ${step <= 2 ? 'text-neutral-900' : 'text-neutral-400'}`}>
                        {step}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-400">Step {step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 