import type { Metadata } from "next";
import { Mada, Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "./ui/navigation/navbar";
import Footer from "./ui/footer";

// Configure Mada font for headings
const mada = Mada({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-mada",
  display: "swap",
});

// Configure Roboto font for body text
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jordan Oakes - UX Designer & AI Specialist",
  description: "Portfolio of Jordan Oakes, showcasing UX design work and AI expertise",
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${mada.variable} ${roboto.variable}`}>
      <body className={`${roboto.className} min-h-screen bg-neutral-950 text-white antialiased`}>
        {/* Only render Navbar and Footer if not in playground */}
        {children && !children.toString().includes('PlaygroundLayout') && (
          <>
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </>
        )}
        {/* Render playground content directly */}
        {children && children.toString().includes('PlaygroundLayout') && children}
      </body>
    </html>
  );
}
