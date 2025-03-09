import type { Metadata } from "next";
import { Mada, Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "./ui/navigation/navbar";

const mada = Mada({
  subsets: ["latin"],
  variable: "--font-mada",
  display: "swap",
});

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
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
    <html lang="en" className={`${mada.variable} ${roboto.variable}`}>
      <body className="min-h-screen bg-neutral-950 font-sans">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
