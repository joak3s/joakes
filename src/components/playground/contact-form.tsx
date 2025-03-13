'use client';

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMouseGradient } from '@/hooks/useMouseGradient'

interface FormState {
  name: string
  email: string
  subject: string
  message: string
}

interface FormStatus {
  type: 'success' | 'error' | null
  message: string
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [status, setStatus] = useState<FormStatus>({
    type: null,
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const mouseGradient = useMouseGradient({
    gradientSize: 450,
    color: '147, 51, 234',
    secondaryColor: '59, 130, 246',
    opacity: 0.15,
    type: 'radial',
    spread: 80
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({
        type: 'error',
        message: 'Please fill in all required fields'
      })
      setIsSubmitting(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setStatus({
        type: 'error',
        message: 'Please enter a valid email address'
      })
      setIsSubmitting(false)
      return
    }

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setStatus({
        type: 'success',
        message: 'Message sent successfully!'
      })
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    } catch {
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please try again.'
      })
    }

    setIsSubmitting(false)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear status when user starts typing
    if (status.type) {
      setStatus({ type: null, message: '' })
    }
  }

  return (
    <motion.div
      className="relative w-full overflow-hidden rounded-2xl"
      onMouseMove={mouseGradient.handleMouseMove}
      onMouseEnter={mouseGradient.handleMouseEnter}
      onMouseLeave={mouseGradient.handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Glassmorphic gradient background */}
      <div className="absolute inset-0 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 rounded-2xl blur-2xl" />
        <motion.div
          className="absolute inset-0 opacity-0 transition-opacity duration-300"
          style={mouseGradient.style}
        />
      </div>

      {/* Form content */}
      <div className="relative dark:bg-neutral-950/80 bg-white/80 backdrop-blur-xl border dark:border-white/10 border-black/10 p-8 shadow-lg">
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Form Status */}
          <AnimatedStatus status={status} />

          {/* Name Input */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium dark:text-white text-neutral-900"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={cn(
                "w-full px-4 py-2 rounded-xl dark:bg-white/5 bg-black/5",
                "focus:outline-none focus:ring-2 focus:ring-purple-500/50",
                "transition-colors border",
                status.type === 'error' && !formData.name
                  ? "dark:border-red-500/50 border-red-500"
                  : "dark:border-white/10 border-black/10"
              )}
              placeholder="Your name"
            />
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium dark:text-white text-neutral-900"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={cn(
                "w-full px-4 py-2 rounded-xl dark:bg-white/5 bg-black/5",
                "focus:outline-none focus:ring-2 focus:ring-purple-500/50",
                "transition-colors border",
                status.type === 'error' && !formData.email
                  ? "dark:border-red-500/50 border-red-500"
                  : "dark:border-white/10 border-black/10"
              )}
              placeholder="your.email@example.com"
            />
          </div>

          {/* Subject Input */}
          <div className="space-y-2">
            <label
              htmlFor="subject"
              className="text-sm font-medium dark:text-white text-neutral-900"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors"
              placeholder="What's this about?"
            />
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <label
              htmlFor="message"
              className="text-sm font-medium dark:text-white text-neutral-900"
            >
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className={cn(
                "w-full px-4 py-2 rounded-xl dark:bg-white/5 bg-black/5",
                "focus:outline-none focus:ring-2 focus:ring-purple-500/50",
                "transition-colors resize-none border",
                status.type === 'error' && !formData.message
                  ? "dark:border-red-500/50 border-red-500"
                  : "dark:border-white/10 border-black/10"
              )}
              placeholder="Your message here..."
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "w-full px-6 py-3 rounded-xl",
              "bg-gradient-to-r from-purple-500 to-blue-500",
              "text-white font-medium",
              "hover:opacity-90 transition-all",
              "flex items-center justify-center gap-2",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "shadow-lg"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Message
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  )
}

function AnimatedStatus({ status }: { status: FormStatus }) {
  if (!status.type) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "p-4 rounded-xl flex items-center gap-2",
        status.type === 'success'
          ? "bg-green-500/10 text-green-500"
          : "bg-red-500/10 text-red-500"
      )}
    >
      {status.type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
      )}
      <p className="text-sm">{status.message}</p>
    </motion.div>
  )
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
} 