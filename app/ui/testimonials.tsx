import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    text: "Working with Jordan on Swyvvl's website has been a game changer for our business. He not only delivered a sleek, user-friendly platform, but also implemented systems to streamline our operations and improve our digital presence. His understanding of the user experience, paired with a sharp eye for design, made all the difference as a Product Designer and Web Designer.",
    author: "Rob Brower",
    role: "CTO of Swyvvl & CEO of Aletheia Digital Media",
    image: "/rob-headshot.jpg"
  },
  {
    id: 2,
    text: "Jordan's ability to capture our brand's energy and translate it into a visually dynamic, user-friendly website was nothing short of amazing. The slick motion graphics and e-commerce align perfectly with our social media, making it easy for us to engage our customers. Jordan gave us the platform we needed to grow OTL and expand our offerings.",
    author: "Paddy Gleason",
    role: "Professional Paintball Player & Founder of Off The Leash Lifestyle",
    image: "/paddy-headshot.jpg"
  },
  {
    id: 3,
    text: "Jordan created a website for my clinic that truly reflects our brand. His design is clean, professional, and easy for our patients to navigate. Since launching the site, we've seen a noticeable increase in both online traffic and new patient inquiries. His work has significantly impacted our business growth.",
    author: "Dr. Brett Petrilli",
    role: "Doctor & Owner of Chiropractic Healthcare",
    image: "/brett-headshot.jpg"
  }
];

export default function Testimonials() {
  return (
    <section className="w-full py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl sm:text-5xl font-black font-mada text-zinc-900 uppercase mb-4">
            Client Testimonies
          </h2>
          <p className="text-xl sm:text-2xl font-light font-roboto text-neutral-800">
            A few words from those I've partnered with.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="flex flex-col justify-between p-6 sm:p-8 bg-neutral-200 rounded-xl h-full"
            >
              <blockquote className="text-neutral-800 font-normal font-roboto leading-relaxed mb-8">
                "{testimonial.text}"
              </blockquote>
              
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-neutral-800 font-bold font-mada text-lg">
                    {testimonial.author}
                  </div>
                  <div className="text-neutral-800 text-sm font-normal font-mada">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 