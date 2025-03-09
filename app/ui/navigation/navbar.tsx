import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-stone-950 shadow-md backdrop-blur-[5px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-1">
            <span className="text-white text-4xl font-black font-mada uppercase">J</span>
            <span className="text-neutral-200 text-4xl font-black font-mada uppercase">Oakes</span>
          </Link>
          
          <div className="flex items-center gap-8">
            <Link 
              href="/" 
              className="text-neutral-500 hover:text-white text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/featured" 
              className="text-neutral-200 hover:text-white text-sm transition-colors"
            >
              Featured
            </Link>
            <Link 
              href="/work" 
              className="text-neutral-200 hover:text-white text-sm transition-colors"
            >
              Work
            </Link>
            <Link 
              href="/contact" 
              className="bg-neutral-950 text-white px-4 py-2 rounded-md border border-neutral-800 text-sm font-semibold hover:border-neutral-700 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 