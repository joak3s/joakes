import { Metadata } from "next"
import Hero from "@/components/sections/hero"

export const metadata: Metadata = {
  title: "Jordan Oakes | UX Designer & AI Specialist",
  description: "Portfolio of Jordan Oakes, showcasing UX design and AI expertise through interactive experiences and case studies.",
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      {/* Additional sections will be added here */}
    </main>
  )
}
