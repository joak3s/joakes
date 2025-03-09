import Image from 'next/image';

const skills = [
  "4+ years of User-Experience Designer.",
  "10+ years of Adobe Creative Suite experience as Graphic Designer.",
  "B.S. Cognitive Science: Artificial Intelligence & Human-Computer Interaction at University of California Santa Cruz."
];

export default function About() {
  return (
    <section className="w-full py-20 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-black font-mada text-neutral-200 uppercase mb-16">
          About Me
        </h2>

        <div className="flex flex-col items-center gap-10">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden shadow-lg">
            <Image
              src="/jordan-headshot.jpg"
              alt="Jordan Oakes"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-3xl sm:text-4xl font-black font-mada text-neutral-200 uppercase tracking-wide mb-8">
              Jordan Oakes
            </h3>

            <p className="text-xl sm:text-2xl font-bold font-mada text-neutral-200 mb-10 leading-relaxed">
              I create user-centric websites with Webflow and bring visual concepts to life through Adobe Creative Suite.
            </p>

            <ul className="space-y-5 text-left max-w-xl mx-auto">
              {skills.map((skill, index) => (
                <li 
                  key={index}
                  className="text-neutral-300 text-lg font-normal font-roboto leading-relaxed flex items-start gap-2"
                >
                  <span className="text-neutral-500 mt-1">•</span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
} 