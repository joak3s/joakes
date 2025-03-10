import Link from 'next/link';
import { Mada } from 'next/font/google';

const mada = Mada({
  subsets: ["latin"],
  weight: ["900"],
  display: "swap",
});

const socialLinks = [
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com',
  },
  {
    name: 'GitHub',
    href: 'https://github.com',
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com',
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-8 bg-neutral-950 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="nav-logo">
              <div className={`${mada.className} nav-logo-text`}>
                <span className="nav-logo-j">J</span>
                <span className="nav-logo-oakes">OAKES</span>
              </div>
            </Link>
            <p className="text-sm text-neutral-400">
              © {currentYear} Jordan Oakes. All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-6">
            {socialLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-neutral-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
} 