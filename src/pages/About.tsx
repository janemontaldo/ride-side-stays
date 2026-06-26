import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import Container from '../components/Container';
import SectionLabel from '../components/SectionLabel';
import { useInView } from '../hooks/useInView';

const highlights = [
  'Scenic and memorable locations.',
  'Comfortable holiday accommodation.',
  'Suitable for riders, couples, and small groups.',
  'Simple enquiry process with direct contact.',
  'A growing collection of stays across Australia and Europe.',
];

export default function About() {
  const heroSection = useInView();
  const missionSection = useInView();
  const offersSection = useInView();

  return (
    <PageWrapper>
      {/* Page header */}
      <section
        ref={heroSection.ref as React.RefObject<HTMLElement>}
        className={`pt-16 pb-0 reveal-hidden ${heroSection.inView ? 'reveal-visible' : ''}`}
      >
        <Container className="pt-12">
          <SectionLabel className="mb-10">Introduction</SectionLabel>
          <p className="text-ink font-medium text-display-sm leading-[1.38] tracking-tight max-w-4xl mb-16">
           Ride Side Stays offers thoughtfully chosen holiday stays in Australia and Europe, with a focus on relaxed comfort, beautiful locations, and easy booking. Our first property is in Lorne, Victoria, and more stays will be added over time.
          </p>
        </Container>
      </section>

      {/* Our mission */}
      <section
        ref={missionSection.ref as React.RefObject<HTMLElement>}
        className={`border-t border-cream-400/60 reveal-hidden ${missionSection.inView ? 'reveal-visible' : ''}`}
      >
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 lg:gap-16 py-14 lg:py-16">
            <div className="flex items-start gap-2 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-ink-muted flex-shrink-0 mt-[6px]" />
              <span className="text-sm text-ink-muted font-medium">Our mission</span>
            </div>
            <div className="space-y-5 text-ink-soft text-base leading-relaxed">
              <p>
              We built Ride Side Stays for travellers who enjoy the road as much as the destination. From motorcycle tours and road trips to relaxed breaks for couples and small groups, our stays are designed to feel welcoming, simple, and memorable.</p>

<p>We aim to make planning easy, with clear property details, strong images, and a direct enquiry process that helps guests decide quickly and confidently.
              </p>

            </div>
          </div>
        </Container>
      </section>

      {/* What we offer */}
      <section
        ref={offersSection.ref as React.RefObject<HTMLElement>}
        className={`border-t border-cream-400/60 reveal-hidden ${offersSection.inView ? 'reveal-visible' : ''}`}
      >
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 lg:gap-16 py-14 lg:py-16">
            <div className="flex items-start gap-2 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-ink-muted flex-shrink-0 mt-[6px]" />
              <span className="text-sm text-ink-muted font-medium">What we offer</span>
            </div>
            <div>
              <p className="text-ink-soft text-base font-medium mb-5">
                Scenic and memorable locations.
              </p>
              <ul className="space-y-2.5 text-ink-soft text-base leading-relaxed list-disc list-inside">
                {highlights.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-cream-400/60 py-16 lg:py-20">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 bg-ink text-white px-7 py-3.5 rounded-full font-medium text-sm hover:bg-ink-soft transition-colors hover:gap-3"
            >
              View properties <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-ink border border-cream-400 px-7 py-3.5 rounded-full font-medium text-sm hover:border-ink-faint transition-colors"
            >
              Get in touch
            </Link>
          </div>
        </Container>
      </section>
    </PageWrapper>
  );
}
