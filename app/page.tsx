import Hero from './ui/hero';
import FeaturedWork from './ui/featured-work';
import MoreWork from './ui/more-work';
import Testimonials from './ui/testimonials';
import About from './ui/about';
import Contact from './ui/contact';

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full bg-neutral-950">
      <Hero />
      <FeaturedWork />
      <MoreWork />
      <Testimonials />
      <About />
      <Contact />
    </div>
  );
}
