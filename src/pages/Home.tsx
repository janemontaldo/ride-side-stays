import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import ContactForm from '../components/ContactForm';
import PageWrapper from '../components/PageWrapper';
import Container from '../components/Container';
import SectionLabel from '../components/SectionLabel';
import { fetchProperties, type Property } from '../lib/supabase';
import { handleImageError } from '../lib/images';
import { useInView } from '../hooks/useInView';

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [parallaxY, setParallaxY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  const introSection = useInView();
  const propertiesSection = useInView();
  const contactSection = useInView();

  useEffect(() => {
    fetchProperties()
      .then(setProperties)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handler = () => {
      const scrollY = window.scrollY;
      const heroHeight = heroRef.current?.offsetHeight ?? window.innerHeight;
      if (scrollY < heroHeight) setParallaxY(scrollY * 0.28);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <PageWrapper noNavOffset>
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/featured/big-hill-morning-glow.jpg"
            alt="Sunset view over Lorne from Big Hill"
            className="w-full h-full object-cover object-center"
            style={{ transform: `translateY(${parallaxY}px)`, willChange: 'transform' }}
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        <Container className="relative z-10 pb-16 sm:pb-20 lg:pb-28">
          <div className="max-w-2xl pt-[100px]">
            <h1 className="text-white font-bold leading-[1.05] tracking-[-0.025em] text-display-xl mb-5">
              Holiday stays for riders, road&#8209;trippers, and easygoing escapes.
            </h1>
            <p className="text-white/75 text-base sm:text-lg leading-relaxed mb-8 max-w-[420px]">
              Explore handpicked properties in Australia and Europe, starting with our Big Hill stay on the Great Ocean Road.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-white text-nav font-medium hover:gap-3 transition-all duration-300"
            >
              What we do <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Introduction */}
      <section
        ref={introSection.ref as React.RefObject<HTMLElement>}
        className={`py-20 lg:py-28 xl:py-36 reveal-hidden ${introSection.inView ? 'reveal-visible' : ''}`}
      >
        <Container>
          <SectionLabel>Introduction</SectionLabel>
          <p className="text-ink font-medium text-display-sm leading-[1.38] tracking-tight max-w-4xl">
            Ride Side Stays offers relaxed holiday accommodation with a focus on great locations,
            comfortable stays, and practical features for motorcycle travellers and touring guests.
            Whether you're planning a coastal escape in Australia or a
              longer stay in Europe, we make it easy to find a place that suits the journey.

          </p>
        </Container>
      </section>

      {/* Properties */}
      <section
        ref={propertiesSection.ref as React.RefObject<HTMLElement>}
        className={`pb-24 lg:pb-32 reveal-hidden ${propertiesSection.inView ? 'reveal-visible' : ''}`}
      >
        <Container>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2].map(i => (
                <div key={i} className="aspect-[4/5] bg-cream-300 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {properties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Contact */}
      <section
        id="enquire"
        ref={contactSection.ref as React.RefObject<HTMLElement>}
        className={`py-20 lg:py-28 border-t border-cream-400/60 reveal-hidden ${contactSection.inView ? 'reveal-visible' : ''}`}
      >
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-start">
            <div>
              <SectionLabel>Get in touch</SectionLabel>
              <h2 className="text-ink font-bold text-display-md leading-[1.1] tracking-tight mb-6">
                Ready to plan<br />your trip?
              </h2>
              <p className="text-ink-muted text-base leading-relaxed max-w-sm">
                Tell us where you want to go, when you're travelling, and how many people will be
                joining — we'll get back to you quickly.
              </p>
            </div>
            <div>
              <ContactForm propertyOptions={properties.map(p => p.name)} />
            </div>
          </div>
        </Container>
      </section>
    </PageWrapper>
  );
}
