import type { Metadata } from "next";
import { Mada } from "next/font/google";
import "./globals.css";
import Navbar from "./ui/navigation/navbar";

// Configure Mada font for headings
const mada = Mada({
  subsets: ["latin"],
  weight: ["900"],  // Only load the weight we need
  variable: "--font-mada",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jordan Oakes - UX Designer & AI Specialist",
  description: "Portfolio of Jordan Oakes, showcasing UX design work and AI expertise",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${mada.variable}`}>
      <body className="min-h-screen bg-neutral-950 font-roboto">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
