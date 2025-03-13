'use client';

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const promptButtons = [
  { text: 'Tell me about your case studies' },
  { text: 'What is your vision?' },
  { text: 'Share your background' },
  { text: 'List your skills' }
]

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isHovered, setIsHovered] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }])
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "This is a demo response. In a real implementation, this would connect to an AI service."
      }])
    }, 1000)
    
    setInput('')
  }

  const handlePromptClick = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        className="relative w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Glowing gradient background */}
        <div className="absolute -inset-[1px] rounded-2xl transition-all duration-500">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-purple-600/50 via-blue-600/50 to-purple-600/50 rounded-2xl blur-xl transition-all duration-500"
            style={{
              opacity: isHovered ? 0.7 : 0.4,
              transform: isHovered ? 'scale(1.02)' : 'scale(1)',
            }}
          />
          <div 
            className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-2xl transition-all duration-500"
            style={{
              opacity: isHovered ? 0.5 : 0.2,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative rounded-2xl dark:bg-neutral-950/90 bg-white/90 backdrop-blur-xl border dark:border-white/10 border-black/10 p-6 shadow-lg">
          <div className="flex flex-col space-y-6">
            {/* Chat messages container */}
            <div className="flex flex-col space-y-4 min-h-[300px] max-h-[400px] overflow-y-auto scrollbar-thin dark:scrollbar-thumb-white/10 scrollbar-thumb-black/10 scrollbar-track-transparent pr-2">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-2xl mt-16 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white mb-4 shadow-lg">
                    <Bot className="w-8 h-8" />
                  </div>
                  <p className="text-xl font-medium mb-2 dark:text-white text-neutral-900">How can I help you today?</p>
                  <p className="text-base dark:text-neutral-400 text-neutral-600">Ask me anything about Jordan&apos;s work and experience.</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className={cn(
                    "flex items-start space-x-3",
                    message.role === 'assistant' ? "" : "justify-end"
                  )}>
                    {message.role === 'assistant' && (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-semibold shadow-lg">
                        AI
                      </div>
                    )}
                    <div className={cn("flex-1", message.role === 'user' && "flex justify-end")}>
                      <div className={cn(
                        "rounded-xl p-4 max-w-[80%] shadow-sm",
                        message.role === 'assistant' 
                          ? "dark:bg-white/5 bg-black/5 backdrop-blur-md" 
                          : "dark:bg-purple-500/20 bg-purple-500/10 backdrop-blur-md ml-auto"
                      )}>
                        <p className="dark:text-white text-neutral-900">{message.content}</p>
                      </div>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center text-white text-sm font-semibold shadow-lg">
                        U
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Prompt Buttons */}
            <div className="flex flex-wrap gap-2">
              {promptButtons.map((button, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(button.text)}
                  className="px-4 py-2 rounded-xl dark:bg-white/5 bg-black/5 backdrop-blur-md border dark:border-white/10 border-black/10 dark:text-white text-neutral-900 text-sm hover:dark:bg-white/10 hover:bg-black/10 transition-all shadow-sm hover:shadow"
                >
                  {button.text}
                </button>
              ))}
            </div>

            {/* Input area */}
            <form onSubmit={handleSubmit} className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about Jordan..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 dark:text-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none shadow-sm"
              />
              <button 
                type="submit"
                className="absolute right-3 bottom-3 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition-all flex items-center gap-2 shadow-lg"
              >
                Ask AI
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 