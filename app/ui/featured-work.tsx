import Image from 'next/image';
import Link from 'next/link';

export default function FeaturedWork() {
  return (
    <section className="relative w-full">
      <div className="w-full px-4 sm:px-6 lg:px-16 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl sm:text-5xl font-black font-mada text-neutral-200 uppercase mb-4">
              FEATURED WORK
            </h2>
            <p className="text-xl sm:text-2xl font-light font-roboto text-neutral-200">
              Case studies of Webflow websites and UX Designs.
            </p>
          </div>

          <div className="space-y-28">
            <article className="flex flex-col gap-6">
              <div className="aspect-[2/1] relative rounded-2xl overflow-hidden">
                <Image
                  src="/images/swyvvl-mockup.jpg"
                  alt="Swyvvl Mobile Desktop Tablet Mockup"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1100px"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl sm:text-4xl font-black font-mada text-neutral-200 uppercase">
                  Swyvvl Real Estate Platform
                </h3>
                <p className="text-white text-base font-light font-roboto leading-relaxed max-w-prose">
                  Swyvvl aimed to transform the real estate industry by creating a transparent, efficient platform connecting home buyers, sellers, agents, and mortgage lenders. I designed and developed a responsive, user-friendly website featuring MLS listings, commission-sharing tools, and instant connections with agents and lenders, all while ensuring legal compliance and aligning with Swyvvl's innovative vision.
                </p>
                <div className="flex justify-center sm:justify-start">
                  <Link 
                    href="/work/swyvvl" 
                    className="inline-flex px-8 py-4 bg-zinc-950 rounded-md border border-neutral-600 text-white text-sm font-semibold hover:border-neutral-500 transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
} 