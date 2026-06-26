import { useEffect, useState } from 'react';
import ContactForm from '../components/ContactForm';
import PageWrapper from '../components/PageWrapper';
import Container from '../components/Container';
import SectionLabel from '../components/SectionLabel';
import { fetchProperties, type Property } from '../lib/supabase';
import { useInView } from '../hooks/useInView';

export default function Contact() {
  const [properties, setProperties] = useState<Property[]>([]);
  const headerSection = useInView();
  const formSection = useInView();

  useEffect(() => {
    fetchProperties().then(setProperties).catch(console.error);
  }, []);

  return (
    <PageWrapper>
      {/* Header */}
      <section
        ref={headerSection.ref as React.RefObject<HTMLElement>}
        className={`pt-16 pb-12 reveal-hidden ${headerSection.inView ? 'reveal-visible' : ''}`}
      >
        <Container className="pt-8">
          <SectionLabel>Contact</SectionLabel>
          <h1 className="text-ink font-bold text-display-lg leading-[1.06] tracking-tight max-w-2xl">
            Get in touch.
          </h1>
          <p className="text-ink-muted text-base leading-relaxed mt-5 max-w-md">
            We're easy to reach and happy to answer any questions about the properties, availability, or planning your trip.
          </p>
        </Container>
      </section>

      {/* Content */}
      <section
        ref={formSection.ref as React.RefObject<HTMLElement>}
        className={`py-12 pb-24 lg:pb-32 border-t border-cream-400/60 reveal-hidden ${formSection.inView ? 'reveal-visible' : ''}`}
      >
        <Container narrow>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-7">
            Send a message
          </p>
          <ContactForm propertyOptions={properties.map(p => p.name)} />
        </Container>
      </section>
    </PageWrapper>
  );
}
