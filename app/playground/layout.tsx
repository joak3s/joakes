import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Design Playground - Jordan Oakes",
  description: "Interactive design components and animations showcase",
};

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
} 