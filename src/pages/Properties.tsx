import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import PageWrapper from '../components/PageWrapper';
import Container from '../components/Container';
/*import SectionLabel from '../components/SectionLabel';*/
import { fetchProperties, type Property } from '../lib/supabase';
import { useInView } from '../hooks/useInView';

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const headerSection = useInView();
  const listSection = useInView();

  useEffect(() => {
    fetchProperties()
      .then(setProperties)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper>
      {/* Header */}
      <section
        ref={headerSection.ref as React.RefObject<HTMLElement>}
        className={`pt-16 pb-12 lg:pb-16 reveal-hidden ${headerSection.inView ? 'reveal-visible' : ''}`}
      >
        <Container className="pt-8">
          
          <h1 className="text-ink font-bold text-display-lg leading-[1.06] tracking-tight max-w-3xl">
            Handpicked stays in great locations.
          </h1>
          <p className="text-ink-muted text-base leading-relaxed mt-5 max-w-xl">
            A collection of holiday properties in Australia and Europe, chosen for good locations, relaxed comfort, and easy access to road and riding routes.
          </p>
        </Container>
      </section>

      {/* Listing */}
      <section
        ref={listSection.ref as React.RefObject<HTMLElement>}
        className={`pb-24 lg:pb-32 reveal-hidden ${listSection.inView ? 'reveal-visible' : ''}`}
      >
        <Container>
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2].map(i => (
                <div key={i} className="aspect-[4/5] bg-cream-300 rounded-2xl animate-pulse" />
              ))}
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <AlertCircle className="w-12 h-12 text-cream-400 mb-4" />
              <p className="text-ink-soft text-lg font-medium">Unable to load properties</p>
              <p className="text-ink-muted text-sm mt-2">Please try refreshing the page.</p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {properties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </PageWrapper>
  );
}
