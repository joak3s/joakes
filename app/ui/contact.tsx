'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <section className="w-full py-20 bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-black font-mada text-neutral-200 uppercase mb-16">
          Contact Me
        </h2>

        <div className="flex justify-center">
          <div className="w-full max-w-xl p-6 sm:p-10 bg-neutral-900 rounded-2xl border-2 border-neutral-700">
            <h3 className="text-2xl sm:text-3xl font-medium font-mada text-neutral-200 mb-8 tracking-wide">
              Fill out the form to get in touch with me!
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label 
                  htmlFor="name"
                  className="block text-neutral-300 text-base font-bold font-mada"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name..."
                  className="w-full px-3 py-2.5 bg-neutral-800 rounded-lg border border-stone-500 text-neutral-400 text-sm font-normal placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label 
                  htmlFor="email"
                  className="block text-neutral-300 text-base font-bold font-mada"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email..."
                  className="w-full px-3 py-2.5 bg-neutral-800 rounded-lg border border-stone-500 text-neutral-400 text-sm font-normal placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label 
                  htmlFor="message"
                  className="block text-neutral-300 text-base font-bold font-mada"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter your message here..."
                  rows={4}
                  className="w-full px-3 py-2.5 bg-neutral-800 rounded-lg border border-stone-500 text-neutral-400 text-sm font-normal placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-colors resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-9 py-3 bg-stone-950 rounded-lg border border-neutral-600 text-stone-300 text-base font-semibold hover:border-neutral-500 transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
} 