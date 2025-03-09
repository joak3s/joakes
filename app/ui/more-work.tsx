import Image from 'next/image';
import Link from 'next/link';

const projects = [
  {
    id: 1,
    title: 'Kosei Performance',
    image: '/kosei-performance.jpg',
    href: '/work/kosei-performance'
  },
  // Add more projects as needed
];

export default function MoreWork() {
  return (
    <section className="w-full py-20 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl sm:text-5xl font-black font-mada text-neutral-200 uppercase mb-4">
            More Work
          </h2>
          <p className="text-xl sm:text-2xl font-light font-roboto text-neutral-200">
            Websites, Graphic Designs, and UX Designs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link 
              key={project.id}
              href={project.href}
              className="group block"
            >
              <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 